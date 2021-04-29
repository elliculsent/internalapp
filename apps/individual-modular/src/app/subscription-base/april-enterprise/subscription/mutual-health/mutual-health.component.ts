/* eslint-disable no-prototype-builtins */
import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {combineLatest, Observable, of, timer} from 'rxjs';
import {map, startWith, switchMap, take} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {
    ADDRESS_POSTCODE,
    EMPLOYEE,
    HEALTH_BENEFIT,
    INSURED_DETAILS_LINK,
    MUTUAL_HEALTH,
    TNS_LIQUIDATION,
    SUBSCRIPTION_LINK,
    TNS,
} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService, UtilsService} from '@individual-modular/services/index';

@Component({
    selector: 'app-mutual-health',
    templateUrl: './mutual-health.component.html',
    styleUrls: ['./mutual-health.component.scss'],
})
export class MutualHealthComponent implements OnInit {
    public subFlowFields$: Observable<any>;
    public healthBenefitFields$: Observable<any> = of(null);
    public tncLiquidationFields$: Observable<any> = of(null);
    public tnsFields$: Observable<any> = of(null);
    public mutualHealthForm: FormGroup;
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public options: {[key: string]: any} = {};
    public fieldMasks: {[key: string]: string[]} = {};
    public filteredOptions: {[key: string]: Observable<any[]>} = {};
    public entityPolicy: any;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private utilsService: UtilsService,
        private uexPopup: UexPopupService
    ) {
        this.subFlowFields$ = this.store.pipe(selectors.selectSubscriptionFields(MUTUAL_HEALTH));
    }

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.buildForm();
    }

    buildForm(): void {
        this.mutualHealthForm = this.fb.group({});
        combineLatest([
            this.subFlowFields$.pipe(take(1)),
            this.store.pipe(take(1), select(selectors.getPolicyHolderOccupation)),
        ]).subscribe(([fields, occupation]) => {
            if (occupation === EMPLOYEE) {
                this.buildHealthBenefit(fields.form_controls);
            } else if (occupation === TNS) {
                this.buildHealthBenefit(fields.form_controls);
                this.buildTNS(fields.form_controls);
                this.buildTnsLiquidation(fields.form_controls);
            }
        });
    }

    private buildHealthBenefit(fields: any): void {
        fields.filter((field: any) => field.id === HEALTH_BENEFIT.toLowerCase()).map((field: any) => {
            this.healthBenefitFields$ = of(field);
            field.controls.map((formControl: any) => {
                const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                const validators = this.formService.buildValidators(formControl);
                const control = this.fb.control(value, validators);
                this.mutualHealthForm.addControl(formControl.id, control);
            });
        });
    }

    private buildTnsLiquidation(fields: any): void {
        fields.filter((field: any) => field.id === TNS_LIQUIDATION.toLowerCase()).map((field: any) => {
            this.tncLiquidationFields$ = of(field);
            field.controls.map((formControl: any) => {
                const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                const validators = this.formService.buildValidators(formControl);
                const control = this.fb.control(value, validators);
                this.mutualHealthForm.addControl(formControl.id, control);
            });
        });
    }

    private buildTNS(fields: any): void {
        fields.filter((field: any) => field.id === TNS.toLowerCase()).map((field: any) => {
            this.tnsFields$ = of(field);
            field.controls.map((formControl: any) => {
                switch (formControl.type) {
                    case 'dropdown':
                        this.buildDropdown(formControl);
                        break;
                    case 'date':
                        this.buildDate(formControl);
                        break;
                    default:
                        this.buildText(formControl);
                        break;
                }

                const mask = this.formService.buildMask(formControl);
                if (mask.length) {
                    this.fieldMasks[formControl.id] = mask;
                }
            });
        });
    }

    validatePostalViaServer({value}: AbstractControl): Observable<ValidationErrors | null> {
        return timer(400).pipe(
            switchMap(() => this.utilsService.isPostalExist(value)),
            map((response: any) => {
                const foundPostalCode = response.data.filter(
                    (postalCodeData: {[key: string]: any}) => postalCodeData.name === value
                );
                if (foundPostalCode.length) {
                    return null;
                }
                return {
                    isExists: false,
                };
            })
        );
    }

    private buildText(formControl: any): void {
        const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
        const validators = this.formService.buildValidators(formControl);
        const control = this.fb.control(value, validators);
        if (formControl.id === ADDRESS_POSTCODE) {
            control.setAsyncValidators(this.validatePostalViaServer.bind(this));
        }
        this.mutualHealthForm.addControl(formControl.id, control);
    }

    private buildDropdown(formControl: any): void {
        this.options[formControl.id] = formControl.options;
        const validators = this.formService.buildValidators(formControl);
        const foundValue = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
        const value = foundValue ? _.find(this.options[formControl.id], ['value', foundValue]) : null;
        validators.push(this.formService.findFromListValidator(this.options[formControl.id], 'value'));
        const formBuilderControl = this.fb.control(value, validators);
        this.filteredOptions[formControl.id] = formBuilderControl.valueChanges.pipe(
            startWith(''),
            map((option) => (typeof option === 'string' ? option : option.name)),
            map(
                (controlValue) =>
                    controlValue
                        ? this.formService.filterAutoCompleteList(controlValue, this.options[formControl.id])
                        : this.options[formControl.id].slice()
            )
        );
        this.mutualHealthForm.addControl(formControl.id, formBuilderControl);
    }

    private buildDate(formControl: any): void {
        this.dateOptions[formControl.id] = {
            dateFormat: formControl.format,
        };
        const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
        const validators = this.formService.buildValidators(formControl);
        const dateControl = this.fb.control(this.formService.getDateModel(value), validators);
        this.mutualHealthForm.addControl(formControl.id, dateControl);
    }

    selectRadioButton(id: string, value: string): void {
        this.mutualHealthForm.get(id).patchValue(value);
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    setUpdatedEntityPolicy(entitiyPolicy: any, formControl: any): void {
        const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        formControl.controls.map((control: any) => {
            if (!control.hasOwnProperty('object_reference')) {
                return;
            }

            control.object_reference.map((objectReference: any) => {
                const formValue = this.formService.getValueByControlType(
                    control.type,
                    this.mutualHealthForm.get(control.id).value
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
        this.store.dispatch(actions.updateInsuredCustomisation());
    }

    continue(): void {
        if (this.mutualHealthForm.invalid) {
            return;
        }
        combineLatest([
            this.healthBenefitFields$,
            this.tnsFields$,
            this.tncLiquidationFields$,
        ]).subscribe(([healthBenefit, tns, tncLiquidationFields]) => {
            if (healthBenefit) {
                this.setUpdatedEntityPolicy(this.entityPolicy, healthBenefit);
            }
            if (tns) {
                this.setUpdatedEntityPolicy(this.entityPolicy, tns);
            }

            if (tncLiquidationFields) {
                this.setUpdatedEntityPolicy(this.entityPolicy, tncLiquidationFields);
            }
        });
        combineLatest([
            this.store.pipe(take(1), select(selectors.getOfferId)),
            this.store.pipe(take(1), select(selectors.selectEntityPolicy)),
        ]).subscribe(([offerId, entityPolicy]) => {
            if (offerId) {
                this.store.dispatch(
                    actions.postSubscription({
                        entity_policy: entityPolicy,
                        currentFlow: MUTUAL_HEALTH,
                        offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        });
    }

    back(): void {
        this.store.select(selectors.getSelectedCountryLanguage).pipe(take(1)).subscribe((selectedLanguageCountry) => {
            this.router.navigateByUrl(`${selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${INSURED_DETAILS_LINK}`);
        });
    }
}
