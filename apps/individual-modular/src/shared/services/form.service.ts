import {Injectable} from '@angular/core';
import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

import * as _ from 'lodash';
import * as moment from 'moment';
import {v4 as uuidv4} from 'uuid';

import {BACKEND_DATE_FORMAT, DANGER_ZONE} from '@uex/uex-constants';
import {Factor, Insured, ItemContent} from '@uex/uex-models';

@Injectable()
export class FormService {
    constructor(private store: Store<State>) {}

    private keysForArrayValues: string[] = ['group'];

    buildValidators(item: ItemContent): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (item.required) {
            validators.push(Validators.required);
        }

        if (item.type === 'email') {
            validators.push(
                Validators.compose([
                    Validators.email,
                    Validators.pattern(
                        '^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$'
                    ),
                ])
            );
        }

        if (item.type === 'checkbox' && item.requiredTrue) {
            validators.push(Validators.requiredTrue);
        }

        if (item.type === 'checkbox' && item.required) {
            validators.push(Validators.requiredTrue);
        } else if (item.type === 'checkbox' && item.checked) {
            validators.push(Validators.required);
        }

        if (item.validation && item.validation.type === 'regex') {
            validators.push(Validators.pattern(item.validation.value));
        }

        return validators;
    }

    buildMask(control: any): string[] {
        let mask = [];
        if ('validation' in control && control.validation.mask) {
            mask = control.validation.mask.split(',').map((char: string) => {
                const match = /^\/(.*)\/([a-z]*)$/.exec(char.trim());
                if (match) {
                    return new RegExp(match[1]);
                } else {
                    return char;
                }
            });
        }
        return mask;
    }

    findFromListValidator(list: any[], key: string): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (!control.value) {
                return null;
            }
            const index = _.findIndex(list, [key, control.value[key]]);
            return index < 0 ? {notFoundInList: {value: control.value}} : null;
        };
    }

    getPathWithReference(reference: string, values: any, insuredIndex = 0): any {
        if (!reference) {
            return values;
        }
        return reference.split('.').reduce((acc, curr) => {
            if (this.keysForArrayValues.indexOf(curr) > -1) {
                return acc[curr][0];
            } else if (curr === 'insured[index]') {
                const insuredKey = curr.replace('[index]', '');
                return acc[insuredKey][insuredIndex];
            } else if (curr === 'insured') {
                return acc[curr][insuredIndex];
            }
            return acc[curr] ? acc[curr] : curr;
        }, values);
    }

    createNewPathForArrayIndex(reference: string, insuredIndex = 0): string {
        if (!reference) {
            return '';
        }
        const s = [];
        reference.split('.').map((curr) => {
            if (this.keysForArrayValues.indexOf(curr) > -1) {
                s.push(`${curr}[0]`);
            } else if (curr === 'insured[index]') {
                s.push(`${curr.replace('[index]', `[${insuredIndex}]`)}`);
            } else if (curr === 'insured') {
                s.push(`${curr}[${insuredIndex}]`);
            } else {
                s.push(curr);
            }
        });
        return s.join('.');
    }

    updateValueByType(existingValue: any, newValue: any): any {
        if (_.isArray(existingValue)) {
            existingValue = [...existingValue, newValue];
        } else if (_.isObject(existingValue)) {
            existingValue = {...existingValue, ...newValue};
        } else {
            existingValue = newValue;
        }
        return existingValue;
    }

    setPathWithReference(reference: string, values: any, newValue: any): any {
        const copy = {...values};
        const split = reference.split('.');
        _.reduceRight(
            split,
            (acc, cur) => {
                acc[cur] = newValue;
                return acc;
            },
            {}
        );
        return copy;
    }

    findValueWithObjectReference(item: any, entityPolicy: any, insuredIndex = 0): any {
        let result = null;
        if ('object_reference' in item) {
            item.object_reference.map((objectReference) => {
                const reference = objectReference.reference;
                const newPath = this.createNewPathForArrayIndex(reference, insuredIndex);
                const newPathArray = newPath.split('.');
                const foundValue = _.get(entityPolicy, newPath);
                if (newPathArray[newPathArray.length - 1] === 'factor') {
                    const foundValueInArray = _.find(foundValue, ['name', objectReference.name]);
                    result = foundValueInArray ? foundValueInArray.code : null;
                } else if (_.isObject(foundValue)) {
                    const referenceName =
                        objectReference.name !== null
                            ? objectReference.name
                            : newPathArray[newPathArray.length - 1];
                    const foundInObject = _.get(foundValue, referenceName);
                    // prettier-ignore
                    result = (typeof foundInObject !== undefined) ? foundInObject : null;
                } else {
                    // prettier-ignore
                    result = foundValue ? foundValue : result;
                }
            });
        }
        return result;
    }

    filterAutoCompleteList(value: any, list: any[]): any[] {
        const filterValue = value.toLowerCase().replace(/\s/g, '');
        return list.filter((option: any) => {
            return option.name.toLowerCase().includes(filterValue);
        });
    }

    createCodeNameFromAutoCompleteList(list: any, objectReference: any): Factor {
        let value = null;
        if (typeof list === 'string') {
            value = list;
        } else {
            value = list.value;
        }
        return {
            code: value,
            name: objectReference.name,
        };
    }

    getUpdateValue(objectReference: any, values: any, formValue: any): any {
        const reference = objectReference.reference;
        const existingValue = this.getPathWithReference(reference, values);
        const newPath = this.createNewPathForArrayIndex(reference);
        const newPathArray = newPath.split('.');
        let updatedValue: any = null;
        if (newPathArray[newPathArray.length - 1] === 'factor') {
            const uniqueExisting = _.reject(existingValue, ['name', objectReference.name]);
            const toUpdate = this.createCodeNameFromAutoCompleteList(formValue, objectReference);
            updatedValue = this.updateValueByType(uniqueExisting, toUpdate);
        } else if (
            objectReference.name === 'address_country' ||
            objectReference.name === 'insured_civility'
        ) {
            updatedValue = this.updateValueByType(existingValue, {
                [objectReference.name]: formValue.value,
            });
        } else if (objectReference.name === null) {
            updatedValue = this.updateValueByType(existingValue, formValue);
        } else {
            updatedValue = this.updateValueByType(existingValue, {
                [objectReference.name]: formValue,
            });
        }
        return updatedValue;
    }

    getUpdatedPathValue(
        objectReference: any,
        currentEntityPolicy: any,
        formValue: any,
        index = 0
    ): any {
        const reference = objectReference.reference;
        const existingValue = this.getPathWithReference(reference, currentEntityPolicy, index);
        const newPath = this.createNewPathForArrayIndex(reference, index);
        const newPathArray = newPath.split('.');
        let updatedValue: any = null;
        if (newPathArray[newPathArray.length - 1] === 'factor') {
            const uniqueExisting = _.reject(existingValue, ['name', objectReference.name]);
            let toUpdate: Factor = null;
            if (objectReference.name === DANGER_ZONE) {
                toUpdate = {code: formValue, name: objectReference.name};
            } else {
                if (formValue) {
                    toUpdate = this.createCodeNameFromAutoCompleteList(formValue, objectReference);
                }
            }
            updatedValue = this.updateValueByType(uniqueExisting, toUpdate);
        } else if (objectReference.name === null) {
            updatedValue = this.updateValueByType(existingValue, formValue);
        } else {
            updatedValue = this.updateValueByType(existingValue, {
                [objectReference.name]: formValue,
            });
        }
        return {newPath, updatedValue};
    }

    getValueByControlType(type: string, formControlValue: any): string | number {
        let formValue: any = null;
        switch (type) {
            case 'dropdown':
                if (typeof formControlValue === 'string') {
                    formValue = formControlValue;
                } else {
                    formValue = formControlValue?.value;
                }
                break;
            case 'date':
                // eslint-disable-next-line no-case-declarations
                const date = moment(formControlValue?.singleDate.jsDate).format(
                    BACKEND_DATE_FORMAT
                );
                formValue = date;
                break;
            default:
                formValue = formControlValue;
                break;
        }
        return formValue;
    }

    getDateModel(value: any): any {
        const momentValue = value ? moment(value, BACKEND_DATE_FORMAT) : null;
        if (!momentValue) {
            return null;
        }
        const model: any = {
            isRange: false,
            dateRange: null,
        };
        model.singleDate = {
            jsDate: momentValue.toDate(),
        };
        return model;
    }

    createInsured(insuredType: string, formValue: {[key: string]: any}): Partial<Insured> {
        let customisation = null;
        this.store.pipe(take(1), select(selectors.getCustomisation)).subscribe((data) => {
            customisation = data;
        });
        return {
            customisation,
            id: uuidv4(),
            insured_age: formValue['insured_age'],
            insured_bmi: null,
            insured_type: insuredType,
            insured_email: null,
            insured_label: null,
            insured_gender: formValue['insured_gender'],
            insured_height: null,
            insured_weight: null,
            insured_age_label: `${formValue['insured_age'].years} year(s) `,
            insured_birthdate: formValue['insured_birthdate'],
            insured_last_name: null,
            insured_linked_to: null,
            insured_first_name: null,
            insured_is_insured: true,
            insured_occupation: null,
            insured_nationality: null,
            insured_identity_type: null,
            insured_marital_status: null,
            insured_health_question: null,
            insured_identity_number: null,
            insured_accept_term_and_cond: false,
            is_selected: false,
            user_policy_customisation_profile: null,
        };
    }
}
