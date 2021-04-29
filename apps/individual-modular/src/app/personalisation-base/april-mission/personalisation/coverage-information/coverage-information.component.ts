import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {
    AngularMyDatePickerDirective,
    IAngularMyDpOptions,
    IMyDateModel,
    IMyInputFieldChanged,
} from 'angular-mydatepicker';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {
    ANNUAL_CONTRACT,
    BACKEND_DATE_FORMAT,
    CONTRACT_DURATION_TYPE,
    COVERAGE_INFORMATION,
    COVERAGE_TYPE_LINK,
    ENTITY_TYPE,
    PERSONALISATION_LINK,
    POLICY_END_DATE,
    POLICY_START_DATE,
} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';
import {ProductService} from '@uex/uex-services';

@Component({
    selector: 'app-coverage-information',
    templateUrl: './coverage-information.component.html',
    styleUrls: ['./coverage-information.component.scss'],
})
export class CoverageInformationComponent implements OnInit {
    @ViewChild('endDatePickerRef') endDatePickerRef: ElementRef;
    @ViewChild('startDp') startDp: AngularMyDatePickerDirective;
    @ViewChild('endDp') endDp: AngularMyDatePickerDirective;
    public employeeForm: FormGroup;
    public durationType: string = null;
    public entityType: string = null;
    public subFlow: any = null;
    public filteredOptions: Observable<any[]>;
    public options: any[] = null;
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public entityPolicy: EntityPolicy = null;
    public offerId: string | number;
    private selectedLanguageCountry: string;
    public dateDiff: string;
    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private productService: ProductService,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService
    ) {
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: COVERAGE_INFORMATION}));
        this.store.pipe(select(selectors.selectPersonalisationSubFlow, COVERAGE_INFORMATION)).subscribe((data) => {
            this.subFlow = data.fields;
        });
        this.store
            .pipe(select(selectors.getFactorByName, CONTRACT_DURATION_TYPE))
            .subscribe((data) => {
                this.durationType = data.code;
            })
            .unsubscribe();

        this.store
            .pipe(select(selectors.getFactorByName, ENTITY_TYPE))
            .subscribe((data) => {
                this.entityType = data.code;
            })
            .unsubscribe();

        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    ngOnInit(): void {
        this.buildform();
    }

    private buildform(): void {
        this.employeeForm = this.fb.group({});

        this.subFlow.form_controls.map((formControls: any) => {
            if (formControls.id === 'who_to_cover') {
                this.options = formControls.options;
                const value = this.formService.findValueWithObjectReference(formControls, this.entityPolicy);
                const foundOption = value ? _.find(this.options, ['value', value]) : this.options[0];
                const validators = this.formService.buildValidators(formControls);
                validators.push(this.formService.findFromListValidator(this.options, 'value'));
                const control = this.fb.control(foundOption, validators);
                // prettier-ignore
                this.filteredOptions = control.valueChanges.pipe(
                    startWith(''),
                    map((option) =>  typeof option === 'string' ? option : option.name),
                    map((controlValue) => controlValue ? this.formService.filterAutoCompleteList(controlValue, this.options) : this.options.slice())
                );
                this.employeeForm.addControl(formControls.id, control);
            } else if (formControls.type === 'date') {
                this.dateOptions[formControls.id] = {
                    dateFormat: formControls.format,
                };
                this.setInitialDateOptions(formControls, formControls.enableSince, formControls.enableUntil);
                const validators = this.formService.buildValidators(formControls);
                const control = this.fb.control(null, validators);
                this.employeeForm.addControl(formControls.id, control);
                this.setDate(formControls);
                this.setDisableIfEndDate(formControls.id);
                if (this.durationType !== ANNUAL_CONTRACT) {
                    this.setDateDiff();
                    control.valueChanges.subscribe((v) => {
                        if (v) {
                            this.setDateDiff();
                        }
                    });
                }
            }
        });
    }

    setDate(formControls: any): void {
        const model: IMyDateModel = {
            isRange: false,
            dateRange: null,
        };
        const format = formControls.format.toUpperCase();
        const foundValue = this.formService.findValueWithObjectReference(formControls, this.entityPolicy);
        const value = foundValue
            ? this.formService.findValueWithObjectReference(formControls, this.entityPolicy)
            : formControls.defaultValue;
        const momentValue = value ? moment(value, BACKEND_DATE_FORMAT) : null;
        if (momentValue) {
            model.singleDate = {
                jsDate: momentValue.toDate(),
            };
            this.employeeForm.get(formControls.id).setValue(model);
            if (formControls.id === POLICY_START_DATE) {
                this.getEndDate(momentValue.format(format).toString());
            }
        }
    }

    setDisableIfEndDate(id: string): void {
        if (id === POLICY_END_DATE && this.durationType === ANNUAL_CONTRACT) {
            this.employeeForm.get(id).disable();
        }
    }

    setInitialDateOptions(formControls: any, enableSince: any, enableUntil: any): void {
        const format = formControls.format.toUpperCase();
        const momentEnableSince = enableSince ? moment(formControls.enableSince, format) : null;
        const momentEnableUntil = enableUntil ? moment(formControls.enableUntil, format) : null;
        this.setDisableDate(formControls.id, momentEnableSince, momentEnableUntil);
    }

    setDisableDate(formId: string, enableSince: moment.Moment, enableUntil: moment.Moment): void {
        const copyOptions = JSON.parse(JSON.stringify(this.dateOptions));
        if (enableSince) {
            copyOptions[formId].disableUntil = {
                year: enableSince.get('year'),
                month: enableSince.get('month') + 1,
                day: enableSince.get('date'),
            };
        }

        if (enableUntil) {
            copyOptions[formId].disableSince = {
                year: enableUntil.get('year'),
                month: enableUntil.get('month') + 1,
                day: enableUntil.get('date'),
            };
        }
        this.dateOptions = copyOptions;
    }

    setDateDiff(): void {
        const startDate = this.employeeForm.get(POLICY_START_DATE);
        const endDate = this.employeeForm.get(POLICY_END_DATE);
        if (startDate && endDate && startDate.value && endDate.value) {
            const momentStartDate = moment(startDate.value.singleDate.jsDate);
            const momentEndDate = moment(endDate.value.singleDate.jsDate);
            const dateString: string = this.subFlow.duration_label;
            this.dateDiff = dateString.replace(
                '{{duration}}',
                momentEndDate.add(1, 'day').diff(momentStartDate, 'days').toString()
            );
        } else {
            this.dateDiff = null;
        }
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    openHelptip(id: string): void {
        const healthTips = this.subFlow.help_tips[id];
        this.uexSidenavService.setSidenavData(healthTips.title, healthTips.content);
        this.uexSidenavService.open();
    }

    setFormFieldValue(fieldName: string, value: string): void {
        const control = this.employeeForm.get(fieldName);
        control.setValue(value);
    }

    setEndDate(response: any): void {
        const format = this.dateOptions[POLICY_END_DATE].dateFormat.toUpperCase();
        const momentEnableSince = response.enableSince ? moment(response.enableSince, format) : null;
        const momentEnableUntil = response.enableUntil ? moment(response.enableUntil, format) : null;

        if (response.defaultValue) {
            const momentValue = response.defaultValue ? moment(response.defaultValue, format) : null;
            if (momentValue) {
                const model: IMyDateModel = {
                    isRange: false,
                    singleDate: {
                        jsDate: momentValue.toDate(),
                    },
                    dateRange: null,
                };
                this.employeeForm.get(POLICY_END_DATE).enable();
                this.employeeForm.get(POLICY_END_DATE).setValue(model);
                this.employeeForm.get(POLICY_END_DATE).updateValueAndValidity();
                this.employeeForm.get(POLICY_END_DATE).disable();
            }
        }
        this.setDisableDate(POLICY_END_DATE, momentEnableSince, momentEnableUntil);
        if (momentEnableSince && momentEnableUntil && this.durationType !== ANNUAL_CONTRACT) {
            this.checkEndWithinDateRange(momentEnableSince, momentEnableUntil);
        }
    }

    checkEndWithinDateRange(momentEnableSince: moment.Moment, momentEnableUntil: moment.Moment): void {
        if (this.employeeForm.get(POLICY_END_DATE).value) {
            const endDateValue = this.employeeForm.get(POLICY_END_DATE).value.singleDate.jsDate;
            const format = this.dateOptions[POLICY_END_DATE].dateFormat.toUpperCase();
            const momentEndDate = moment(endDateValue, format);
            if (!momentEndDate.isBetween(momentEnableSince, momentEnableUntil)) {
                this.endDp.clearDate();
                this.setFormFieldValue('policy_end_date', null);
                this.setDateDiff();
            }
        }
    }

    onStartDateFieldChanged(e: IMyInputFieldChanged): void {
        if (!this.endDp) {
            return;
        }
        if (e.valid) {
            this.getEndDate(e.value);
        }
    }

    getEndDate(startDate: string): void {
        this.productService
            .getComputationDurationDate(this.durationType, startDate)
            .then((response) => {
                this.setEndDate(response);
                this.setDateDiff();
            })
            .catch((error) => {
                this.uexPopup.error(error.error_title, error.error_message);
            });
    }

    back(): void {
        this.router.navigateByUrl(`${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${COVERAGE_TYPE_LINK}`);
    }

    continue(): void {
        let payload = JSON.parse(JSON.stringify(this.entityPolicy));
        payload = this.setFormControlsValue(payload);
        this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
        if (this.offerId) {
            this.store.dispatch(
                actions.postPersonalisation({
                    entity_policy: this.entityPolicy,
                    currentFlow: COVERAGE_INFORMATION,
                    offerId: this.offerId,
                })
            );
        } else {
            this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
        }
    }

    setFormControlsValue(payload: any): any {
        const result = {...payload};
        this.subFlow.form_controls.map((formControl: any) => {
            if ('object_reference' in formControl) {
                formControl.object_reference.map((objectReference: any) => {
                    const reference = objectReference.reference;
                    const existingValue = this.formService.getPathWithReference(reference, result);
                    if (reference !== undefined) {
                        const newPath = this.formService.createNewPathForArrayIndex(reference);
                        const newPathArray = newPath.split('.');
                        let updatedValue: any;
                        const formValue = this.employeeForm.get(formControl.id).value;
                        if (formControl.type === 'date') {
                            updatedValue = this.formService.updateValueByType(existingValue, {
                                [objectReference.name]: moment(formValue.singleDate.jsDate).format(BACKEND_DATE_FORMAT),
                            });
                        } else if (newPathArray[newPathArray.length - 1] === 'factor') {
                            const uniqueExisting = _.reject(existingValue, ['name', objectReference.name]);
                            const toUpdate = this.formService.createCodeNameFromAutoCompleteList(
                                this.employeeForm.value[formControl.id],
                                objectReference
                            );
                            updatedValue = this.formService.updateValueByType(uniqueExisting, toUpdate);
                        }
                        _.set(result, newPath, updatedValue);
                    }
                });
            }
        });
        return result;
    }
}
