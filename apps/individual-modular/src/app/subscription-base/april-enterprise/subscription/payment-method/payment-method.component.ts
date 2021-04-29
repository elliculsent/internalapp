/* eslint-disable no-prototype-builtins */
/* eslint-disable no-extra-boolean-cast */
import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {conformToMask} from 'angular2-text-mask';
import {combineLatest, Observable, timer} from 'rxjs';
import {map, startWith, switchMap, take} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {
    BANK_IBAN,
    INSURED_DETAILS_LINK,
    MUTUAL_HEALTH,
    MUTUAL_HEALTH_LINK,
    PAYMENT_FREQUENCY,
    PAYMENT_METHOD_AND_FREQUENCY,
    SENDER_ADDRESS_COUNTRY,
    SUBSCRIPTION_LINK,
} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService, PriceService, UtilsService} from '@individual-modular/services/index';

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
    public entityPolicy: any;
    public subFlowFields$: Observable<any>;
    public paymentForm: FormGroup;
    public countryOptions: any = {};
    public filteredCountry: Observable<any> = null;
    public ibanMask: Array<any> = [];
    public ibanRegex: RegExp;
    public ibanValidators: ValidatorFn[] = [];
    public paymentFrequencyId: string = PAYMENT_FREQUENCY;
    public promoCodeValidation: any;
    private selectedCountry: string = null;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private priceService: PriceService,
        private router: Router,
        private store: Store<State>,
        private utilsService: UtilsService,
        private uexPopup: UexPopupService
    ) {
        this.store.pipe(select(selectors.getSelectedCountry)).subscribe((data) => {
            this.selectedCountry = data;
        });
        this.subFlowFields$ = this.store.pipe(selectors.selectSubscriptionFields(PAYMENT_METHOD_AND_FREQUENCY));

        this.promoCodeValidation = {
            is_valid: null,
            message: null,
            promo_code: null,
        };
    }

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((entityPolicy) => {
            this.entityPolicy = entityPolicy;
        });
        this.buildForm();
    }

    buildForm(): void {
        this.paymentForm = this.fb.group({});
        this.store
            .pipe(take(1), selectors.selectSubscriptionFormControls(PAYMENT_METHOD_AND_FREQUENCY))
            .subscribe((formControl: any) => {
                if (formControl.id === SENDER_ADDRESS_COUNTRY) {
                    this.createBankCountryDropdown(formControl);
                } else if (formControl.id === BANK_IBAN) {
                    this.createIbanField(formControl);
                } else {
                    const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                    const validators = this.formService.buildValidators(formControl);
                    const control = this.fb.control(value, validators);
                    if (formControl.id === 'sender_postcode') {
                        control.setAsyncValidators(this.validatePostalViaServer.bind(this));
                    }
                    this.paymentForm.addControl(formControl.id, control);
                }
            });
    }

    createBankCountryDropdown(formControl: any): void {
        if (!!this.countryOptions) {
            this.countryOptions = formControl.options;
        }
        const valueByReference = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
        const value = valueByReference
            ? this.countryOptions.find((c: any) => c.value === valueByReference)
            : this.countryOptions.find((c: any) => c.value === this.selectedCountry.toUpperCase());
        const validators = this.formService.buildValidators(formControl);
        validators.push(this.formService.findFromListValidator(this.countryOptions, 'value'));
        const control = this.fb.control(value, validators);
        this.paymentForm.addControl(formControl.id, control);
        this.filteredCountry = control.valueChanges.pipe(
            startWith(''),
            map((option) => (typeof option === 'string' ? option : option.name)),
            map(
                (controlValue) =>
                    controlValue
                        ? this.formService.filterAutoCompleteList(controlValue, this.countryOptions)
                        : this.countryOptions.slice()
            )
        );
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    onBankCountryOptionSelected(e: any): void {
        this.createIbanMaskRegex(e.value);
        const validators = this.ibanValidators.concat(Validators.pattern(this.ibanRegex));
        this.paymentForm.get(BANK_IBAN).setValidators(validators);
        this.paymentForm.get(BANK_IBAN).setValue(e.value);
        this.paymentForm.get(BANK_IBAN).updateValueAndValidity();
    }

    private createIbanField(formControl: any): void {
        const validators = this.formService.buildValidators(formControl);
        const valueByReference = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
        const value = valueByReference ? valueByReference : this.selectedCountry.toUpperCase();

        if (this.paymentForm.get(SENDER_ADDRESS_COUNTRY) && this.paymentForm.get(SENDER_ADDRESS_COUNTRY).value) {
            this.createIbanMaskRegex(this.selectedCountry, this.paymentForm.get(SENDER_ADDRESS_COUNTRY).value.iban);
        } else {
            this.createIbanMaskRegex(this.selectedCountry);
        }
        this.ibanValidators = [...validators];
        // validators.push(Validators.pattern(this.ibanRegex));
        const control = this.fb.control(value, validators);
        this.paymentForm.addControl(formControl.id, control);

        const conformedValue = conformToMask(value, this.ibanMask, {guide: true});
        this.paymentForm.controls[formControl.id].setValue(conformedValue.conformedValue);
    }

    private createIbanMaskRegex(country: string, iban?: string): void {
        let mask: string;
        let ibanString = '^';
        if (iban) {
            mask = iban;
        } else {
            const defaultOption = this.countryOptions.find((c: any) => c.value === country.toUpperCase());
            mask = defaultOption.iban;
        }
        this.ibanMask = [];
        mask.split('').map((char: string) => {
            if (char.match(/[#]/)) {
                ibanString += '[^W_]';
                this.ibanMask.push(/[^\W_]/);
            } else if (char.match(/\s/)) {
                ibanString += '[\\s]';
                this.ibanMask.push(' ');
            } else if (char.match(/[a-zA-Z]/)) {
                ibanString += char;
                this.ibanMask.push(/[^\W_]/);
            }
        });
        ibanString += '$';
        this.ibanRegex = new RegExp(ibanString, 'i');
    }

    selectPaymentFrequency(id: string, value: string): void {
        const control = this.paymentForm.get(id);
        control.setValue(value);
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

    getUpdatedEntitiyPolicy(entitiyPolicy: any, updatePrice = false): void {
        const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        this.store
            .pipe(take(1), selectors.selectSubscriptionFields(PAYMENT_METHOD_AND_FREQUENCY))
            .subscribe((fields: any) => {
                fields.form_controls.map((control: any) => {
                    if (!control.hasOwnProperty('object_reference')) {
                        return;
                    }
                    control.object_reference.map((objectReference: any) => {
                        let formValue = this.formService.getValueByControlType(
                            control.type,
                            this.paymentForm.get(control.id).value
                        );
                        if (objectReference.name === 'promotion_code_key' && !this.promoCodeValidation.is_valid) {
                            formValue = null;
                        } else if (
                            objectReference.name === 'promotion_code_key' &&
                            this.promoCodeValidation.is_valid &&
                            this.promoCodeValidation.promo_code !== formValue
                        ) {
                            formValue = this.promoCodeValidation.promo_code;
                        }

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

                if (updatePrice) {
                    this.updatePriceDisplay();
                }
            });
    }

    validatePromoCode(value: string): void {
        if (value) {
            this.utilsService.validatePromoCode(value, this.entityPolicy.policy.policy_number).subscribe(
                (data) => {
                    this.promoCodeValidation = {
                        is_valid: true,
                        message: data.message,
                        promo_code: value,
                    };
                    this.getUpdatedEntitiyPolicy(this.entityPolicy, true);
                },
                (err) => {
                    this.promoCodeValidation = {
                        is_valid: false,
                        message: err.error_message,
                        promo_code: null,
                    };
                    this.getUpdatedEntitiyPolicy(this.entityPolicy, true);
                }
            );
        } else {
            if (this.promoCodeValidation.is_valid !== null) {
                this.promoCodeValidation = {
                    is_valid: null,
                    message: null,
                    promo_code: null,
                };
                this.getUpdatedEntitiyPolicy(this.entityPolicy, true);
            }
        }
    }

    private updatePriceDisplay(): void {
        this.priceService.postPriceCustomisation(this.entityPolicy.policy).subscribe((priceData) => {
            this.store.dispatch(
                actions.setPriceDisplay({
                    price_display: priceData.price_display,
                })
            );
        });
    }

    continue(): void {
        if (this.paymentForm.invalid) {
            return;
        }
        this.getUpdatedEntitiyPolicy(this.entityPolicy);

        combineLatest([
            this.store.pipe(take(1), select(selectors.getOfferId)),
            this.store.pipe(take(1), select(selectors.selectEntityPolicy)),
        ]).subscribe(([offerId, entityPolicy]) => {
            if (offerId) {
                this.store.dispatch(
                    actions.postSubscription({
                        entity_policy: entityPolicy,
                        currentFlow: PAYMENT_METHOD_AND_FREQUENCY,
                        offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        });
    }
    back(): void {
        combineLatest([
            this.store.pipe(take(1), select(selectors.getSelectedCountryLanguage)),
            this.store.pipe(take(1), select(selectors.isSubscriptionSubFlowShown, MUTUAL_HEALTH)),
        ]).subscribe(([selectedLanguageCountry, isShownMutualHealth]) => {
            if (!isShownMutualHealth) {
                this.router.navigateByUrl(`${selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${INSURED_DETAILS_LINK}`);
            } else {
                this.router.navigateByUrl(`${selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${MUTUAL_HEALTH_LINK}`);
            }
        });
    }
}
