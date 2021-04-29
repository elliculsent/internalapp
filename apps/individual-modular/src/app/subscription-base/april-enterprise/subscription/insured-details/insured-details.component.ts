/* eslint-disable no-prototype-builtins */
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {environment} from '@individual-modular/environment/environment';
import {select, Store} from '@ngrx/store';

import {IAngularMyDpOptions} from 'angular-mydatepicker';
import * as _ from 'lodash';
import {combineLatest, Observable, of} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {ADDRESS_POSTCODE, ADULT_SPOUSE, CHILD, INSURED_DETAILS, POLICY_HOLDER, SPOUSE} from '@uex/uex-constants';
import {EntityPolicy, Insured} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';

@Component({
    selector: 'app-insured-details',
    templateUrl: './insured-details.component.html',
    styleUrls: ['./insured-details.component.scss'],
})
export class InsuredDetailsComponent implements OnInit {
    public filteredOptions: {[key: string]: Observable<any[]>} = {};
    public insuredDetailsForm: FormGroup;
    public subFlow$: Observable<any>;
    public subFlowFields$: Observable<any>;
    public policyHolderFields$: Observable<any>;
    public spouseFields$: Observable<any>;
    public childFields$: Observable<any>;
    public entityPolicy: EntityPolicy = null;
    public options: {[key: string]: any[]} = {};
    public mask: Array<any> = environment.phone.mask;
    public offerId: string | number;
    public selectedCountry$: Observable<string>;
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public fieldMasks: {[key: string]: string[]} = {};
    public insuredCount$: Observable<any>;
    public spouse: string = SPOUSE;
    public child: string = CHILD;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private uexPopup: UexPopupService
    ) {
        this.selectedCountry$ = this.store.pipe(select(selectors.getSelectedCountry));
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((entityPolicy) => {
            this.entityPolicy = entityPolicy;
        });
        this.subFlowFields$ = this.store.pipe(selectors.selectSubscriptionFields(INSURED_DETAILS));
        this.insuredCount$ = this.store.pipe(select(selectors.getInsuredCount));
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.subFlowFields$.pipe(take(1)).subscribe((fields) => {
            this.insuredDetailsForm = this.fb.group({});
            fields.form_controls.map((formControl: any) => {
                if (formControl.id === POLICY_HOLDER.toLowerCase()) {
                    this.policyHolderFields$ = of(formControl);
                    this.buildPolicyHolderGroup(formControl);
                } else if (formControl.id === ADULT_SPOUSE.toLowerCase()) {
                    this.spouseFields$ = of(formControl);
                    this.buildFormArrayFromInsured(formControl, SPOUSE);
                } else if (formControl.id === CHILD.toLowerCase()) {
                    this.childFields$ = of(formControl);
                    this.buildFormArrayFromInsured(formControl, CHILD);
                }
            });
        });
    }

    buildPolicyHolderGroup(formControl: any): void {
        formControl.controls.map((control: any) => {
            const validators = this.formService.buildValidators(control);
            const formBuilderControl: FormControl = this.buildFormControl(control, validators);
            if (control.id === ADDRESS_POSTCODE) {
                formBuilderControl.disable();
            }
            this.insuredDetailsForm.addControl(control.id, formBuilderControl);
        });
    }

    buildFormArrayFromInsured(formControl: any, insuredType: string): void {
        this.store.pipe(take(1), select(selectors.getInsuredByType, insuredType)).subscribe((insured) => {
            if (insured && insured.length) {
                const fbArray = this.fb.array([]);
                insured.map((insuredData) => {
                    const formGroup: FormGroup = this.buildFormGroup(formControl, insuredData);
                    formGroup.addControl('id', this.fb.control(insuredData.id));
                    fbArray.push(formGroup);
                });
                this.insuredDetailsForm.addControl(formControl.id, fbArray);
            } else {
                this.insuredDetailsForm.addControl(formControl.id, this.fb.array([]));
            }
        });
    }

    buildFormGroup(formControl: any, insuredData?: any): FormGroup {
        const formGroup = this.fb.group({});
        formControl.controls.map((control: any) => {
            const validators = this.formService.buildValidators(control);
            const formBuilderControl: FormControl = this.buildFormControl(control, validators, insuredData);
            formGroup.addControl(control.id, formBuilderControl);
        });
        return formGroup;
    }

    private buildFormControl(control: any, validators: ValidatorFn[], insuredData?: any): FormControl {
        let formBuilderControl: FormControl;
        if (control.type === 'dropdown') {
            formBuilderControl = this.buildDropdown(control, validators, insuredData);
        } else if (control.type === 'date') {
            formBuilderControl = this.buildDate(control, validators, insuredData);
        } else {
            formBuilderControl = this.buildText(control, validators, insuredData);
        }
        const mask = this.formService.buildMask(control);
        if (mask.length) {
            this.fieldMasks[control.id] = mask;
        }
        return formBuilderControl;
    }

    private buildText(control: any, validators: ValidatorFn[], insuredData?: any): FormControl {
        let value = null;
        if (insuredData) {
            const insuredCopy = this.entityPolicy.policy.group[0].insured.slice(0);
            const insuredIndex = insuredCopy.findIndex((insured: Insured) => insured.id === insuredData.id);
            value = this.formService.findValueWithObjectReference(control, this.entityPolicy, insuredIndex);
        } else {
            value = this.formService.findValueWithObjectReference(control, this.entityPolicy);
        }

        return this.fb.control(value, validators);
    }

    private buildDropdown(control: any, validators: ValidatorFn[], insuredData?: any): FormControl {
        this.options[control.id] = control.options;
        let value = null;
        let foundValue = null;
        if (insuredData) {
            const insuredCopy = this.entityPolicy.policy.group[0].insured.slice(0);
            const insuredIndex = insuredCopy.findIndex((insured: Insured) => insured.id === insuredData.id);
            foundValue = this.formService.findValueWithObjectReference(control, this.entityPolicy, insuredIndex);
        } else {
            foundValue = this.formService.findValueWithObjectReference(control, this.entityPolicy);
        }
        value = foundValue ? _.find(this.options[control.id], ['value', foundValue]) : null;
        validators.push(this.formService.findFromListValidator(this.options[control.id], 'value'));
        const formBuilderControl = this.fb.control(value, validators);
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
        return formBuilderControl;
    }

    private buildDate(control: any, validators: ValidatorFn[], insuredData?: any): FormControl {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        let value = null;
        this.dateOptions[control.id] = {
            dateFormat: control.format,
            defaultView: 3,
            disableSince: {
                year: tomorrow.getFullYear(),
                month: tomorrow.getMonth() + 1,
                day: tomorrow.getDate(),
            },
        };
        if (insuredData) {
            value = insuredData[control.id];
        } else {
            value = this.formService.findValueWithObjectReference(control, this.entityPolicy);
        }
        const dateControl = this.fb.control(this.formService.getDateModel(value), validators);
        dateControl.disable();
        return dateControl;
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    setPolicyHolderEntity(entitiyPolicy: any): any {
        const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectSubscriptionFormControls(INSURED_DETAILS)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            if (formControl.id === POLICY_HOLDER.toLowerCase()) {
                formControl.controls.map((control: any) => {
                    if (!control.hasOwnProperty('object_reference')) {
                        return;
                    }
                    control.object_reference.map((objectReference: any) => {
                        const formValue = this.formService.getValueByControlType(
                            control.type,
                            this.insuredDetailsForm.get(control.id).value
                        );
                        const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                            objectReference,
                            newEntityPolicy,
                            formValue
                        );
                        _.set(newEntityPolicy, newPath, updatedValue);
                    });
                });
                this.store.dispatch(
                    actions.setEntityPolicy({
                        entity_policy: newEntityPolicy,
                    })
                );
            }
        });
        return newEntityPolicy;
    }

    setInsuredByType(insuredType: string, entitiyPolicy: any): void {
        let formArray: FormArray;
        let fields$: Observable<any>;
        if (insuredType === SPOUSE) {
            formArray = this.insuredDetailsForm.get(ADULT_SPOUSE.toLowerCase()) as FormArray;
            fields$ = this.spouseFields$;
        } else if (insuredType === CHILD) {
            formArray = this.insuredDetailsForm.get(CHILD.toLowerCase()) as FormArray;
            fields$ = this.childFields$;
        }

        if (formArray) {
            const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
            const insuredCopy: any[] = newEntityPolicy.policy.group[0].insured.slice(0);

            const formArrayControls = formArray.controls;
            formArrayControls.map((formGroup) => {
                const insuredId = formGroup.get('id').value;
                fields$.pipe(take(1)).subscribe((fields) => {
                    fields.controls.map((control: any) => {
                        if (!control.hasOwnProperty('object_reference')) {
                            return;
                        }
                        control.object_reference.map((objectReference: any) => {
                            const insuredIndex = insuredCopy.findIndex(
                                (insuredData: Insured) => insuredData.id === insuredId
                            );
                            const formValue = this.formService.getValueByControlType(
                                control.type,
                                formGroup.get(control.id).value
                            );
                            const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                                objectReference,
                                newEntityPolicy,
                                formValue,
                                insuredIndex
                            );
                            _.set(newEntityPolicy, newPath, updatedValue);
                        });
                    });
                    this.store.dispatch(
                        actions.setEntityPolicy({
                            entity_policy: newEntityPolicy,
                        })
                    );
                });
            });
        }
    }

    continue(): void {
        if (this.insuredDetailsForm.invalid) {
            return;
        }
        this.setPolicyHolderEntity(this.entityPolicy);
        this.setInsuredByType(SPOUSE, this.entityPolicy);
        this.setInsuredByType(CHILD, this.entityPolicy);
        combineLatest([
            this.store.pipe(take(1), select(selectors.getOfferId)),
            this.store.pipe(take(1), select(selectors.selectEntityPolicy)),
        ]).subscribe(([offerId, entityPolicy]) => {
            if (offerId) {
                this.store.dispatch(
                    actions.postSubscription({
                        entity_policy: entityPolicy,
                        currentFlow: INSURED_DETAILS,
                        offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        });
    }
}
