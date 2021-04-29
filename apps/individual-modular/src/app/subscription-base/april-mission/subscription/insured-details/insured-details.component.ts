import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';

import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import * as _ from 'lodash';
import * as moment from 'moment';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {BACKEND_DATE_FORMAT, INSURED_DETAILS, SUBSCRIPTION, SUBSCRIPTION_LINK} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService, FormService} from '@individual-modular/services/index';

@Component({
    selector: 'app-insured-details',
    templateUrl: './insured-details.component.html',
    styleUrls: ['./insured-details.component.scss'],
})
export class InsuredDetailsComponent implements OnInit {
    public entityPolicy: EntityPolicy = null;
    public options: {[key: string]: any[]} = {};
    public filteredOptions: {[key: string]: Observable<any[]>} = {};
    public subFlow: any = null;
    public insuredDetailsForm: FormGroup;
    public mask: Array<any> = environment.phone.mask;
    public offerId: string | number;
    private selectedLanguageCountry: string;
    public selectedCountry: string;
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public fieldMasks: {[key: string]: string[]} = {};
    constructor(
        private fb: FormBuilder,
        private flowService: FlowService,
        private formService: FormService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService
    ) {
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.dispatch(actions.setSubscriptionActiveSubFlow({sub_flow: INSURED_DETAILS}));
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store
            .pipe(select(selectors.selectSubscriptionSubFlow, INSURED_DETAILS))
            .subscribe((data) => {
                this.subFlow = data.fields;
            })
            .unsubscribe();
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
        this.store.pipe(select(selectors.getSelectedCountry)).subscribe((data) => {
            this.selectedCountry = data;
        });
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.insuredDetailsForm = this.fb.group({});
        this.subFlow.form_controls.map((formControl: any) => {
            formControl.controls.map((control: any) => {
                const validators = this.formService.buildValidators(control);
                let formBuilderControl: FormControl;

                if (control.type === 'dropdown') {
                    this.options[control.id] = control.options;
                    const foundValue = this.formService.findValueWithObjectReference(control, this.entityPolicy);
                    const foundOptionValue = foundValue
                        ? _.find(this.options[control.id], ['value', foundValue])
                        : null;
                    validators.push(this.formService.findFromListValidator(this.options[control.id], 'value'));
                    formBuilderControl = this.fb.control(foundOptionValue, validators);
                    this.filteredOptions[control.id] = formBuilderControl.valueChanges.pipe(
                        startWith(''),
                        map((option) => (typeof option === 'string' ? option : option.name)),
                        map(
                            (controlValue) =>
                                controlValue
                                    ? this.formService.filterAutoCompleteList(controlValue, this.options[control.id])
                                    : this.options[control.id].slice()
                        )
                    );
                } else if (control.type === 'date') {
                    const today = new Date();
                    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                    this.dateOptions[control.id] = {
                        dateFormat: control.format,
                        defaultView: 3,
                        disableSince: {
                            year: tomorrow.getFullYear(),
                            month: tomorrow.getMonth() + 1,
                            day: tomorrow.getDate(),
                        },
                    };
                    formBuilderControl = this.fb.control(this.setDate(control), validators);
                } else {
                    const value = this.formService.findValueWithObjectReference(control, this.entityPolicy);
                    formBuilderControl = this.fb.control(value, validators);
                }
                this.fieldMasks[control.id] = this.formService.buildMask(control);
                this.insuredDetailsForm.addControl(control.id, formBuilderControl);
            });
        });
    }

    setDate(formControls: any): IMyDateModel {
        const foundValue = this.formService.findValueWithObjectReference(formControls, this.entityPolicy);
        const value = foundValue
            ? this.formService.findValueWithObjectReference(formControls, this.entityPolicy)
            : formControls.defaultValue;
        const momentValue = value ? moment(value, BACKEND_DATE_FORMAT) : null;
        if (momentValue) {
            const model: IMyDateModel = {
                isRange: false,
                dateRange: null,
            };
            model.singleDate = {
                jsDate: momentValue.toDate(),
            };
            return model;
        } else {
            return null;
        }
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    continue(): void {
        if (this.insuredDetailsForm.valid) {
            let payload = JSON.parse(JSON.stringify(this.entityPolicy));
            payload = this.setFormControlsValue(payload);
            this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
            if (this.offerId) {
                this.postPayload(payload, INSURED_DETAILS, this.offerId);
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        }
    }

    setFormControlsValue(payload: any): any {
        const result = {...payload};
        this.subFlow.form_controls.map((formControl: any) => {
            formControl.controls.map((control: any) => {
                if ('object_reference' in control) {
                    control.object_reference.map((objectReference: any) => {
                        let updatedValue: any;
                        const newPath = this.formService.createNewPathForArrayIndex(objectReference.reference);
                        const newPathArray = newPath.split('.');
                        const existingValue = this.formService.getPathWithReference(objectReference.reference, result);
                        const formValue = this.insuredDetailsForm.get(control.id).value;
                        if (control.type === 'date') {
                            updatedValue = this.formService.updateValueByType(existingValue, {
                                [objectReference.name]: moment(formValue.singleDate.jsDate).format(BACKEND_DATE_FORMAT),
                            });
                        } else if (control.type === 'dropdown' && newPathArray[newPathArray.length - 1] !== 'factor') {
                            updatedValue = this.formService.updateValueByType(existingValue, {
                                [objectReference.name]: formValue.value,
                            });
                        } else {
                            updatedValue = this.formService.getUpdateValue(
                                objectReference,
                                result,
                                this.insuredDetailsForm.get(control.id).value
                            );
                        }
                        _.set(result, newPath, updatedValue);
                    });
                }
            });
        });
        return result;
    }

    private postPayload(payload: any, currentFlow: string, offerId: string | number): void {
        this.flowService
            .postFlow(payload, currentFlow, offerId)
            .then((response) => {
                const data = response.sub_flow;
                // Reset Left Menu & Breadcrumb Flow
                if (response.impacted_flow) {
                    this.store.dispatch(
                        actions.resetLeftMenuFlow({
                            flow: {main_flow: SUBSCRIPTION, sub_flow_name: data.sub_flow_name},
                        })
                    );
                    this.store.dispatch(actions.resetBreadcrumb({main_flow: SUBSCRIPTION}));
                    this.store.dispatch(actions.setEntityPolicy({entity_policy: response.entity_policy}));
                }
                this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: data.sub_flow_name}));
                this.store.dispatch(actions.setSubscriptionValidSubflow({sub_flow: INSURED_DETAILS}));
                this.store.dispatch(actions.setSubscriptionFields({sub_flow: data}));
                this.store
                    .pipe(
                        select(selectors.getSubflowLink, {
                            mainflow: SUBSCRIPTION_LINK,
                            subflow: data.sub_flow_name,
                        })
                    )
                    .subscribe((link) => {
                        this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${link}`);
                    })
                    .unsubscribe();
            })
            .catch((error) => {
                this.uexPopup.error(error.title, error.error_message);
            });
    }

    getNumber(value: string, id: string): void {
        this.insuredDetailsForm.get(id).setValue(value);
    }

    isValidNumber(isValid: boolean, id: string): void {
        if (!isValid) {
            this.insuredDetailsForm.get(id).setErrors({invalidPhone: !isValid});
        } else {
            this.insuredDetailsForm.get(id).setErrors(null);
        }
    }
}
