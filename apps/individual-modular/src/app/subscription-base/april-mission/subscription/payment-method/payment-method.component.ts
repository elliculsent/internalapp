import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import * as constants from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService, FormService} from '@individual-modular/services/index';

@Component({
    selector: 'app-payment-method',
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
    public durationType: string = null;
    public entityPolicy: EntityPolicy = null;
    public paymentForm: FormGroup;
    public offerId: string | number;
    public subFlow: any = null;
    public paymentMethodFields: any = null;
    public paymentFrequencyFields: any = null;
    public bankDetailsFields: any = null;
    public ibanMask: Array<any> = [];
    public ibanRegex: RegExp;
    public ibanValidators: ValidatorFn[] = [];
    public postalMask: Array<any> = environment.postal.mask;
    public postalRegex: string = environment.postal.regex;
    public annualContract: string = constants.ANNUAL_CONTRACT;
    public bankTransfer: string = constants.BANK_TRANSFER;
    public paymentMethod: {[key: string]: string[]} = null;
    public paymentMethodId: string = constants.PAYMENT_METHOD;
    public paymentFrequency: {[key: string]: string[]} = null;
    public paymentFrequencyId: string = constants.PAYMENT_FREQUENCY;
    private selectedLanguageCountry: string;
    private selectedCountry: string;
    public filteredOptions: Observable<any[]>;
    public options: any;
    public optionControl: FormControl = new FormControl();

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private flowService: FlowService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService
    ) {
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.dispatch(actions.setSubscriptionActiveSubFlow({sub_flow: constants.PAYMENT_METHOD_AND_FREQUENCY}));
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store
            .pipe(select(selectors.selectSubscriptionSubFlow, constants.PAYMENT_METHOD_AND_FREQUENCY))
            .subscribe((data) => {
                if (data.fields) {
                    this.subFlow = data.fields;
                    this.paymentMethodFields = _.find(this.subFlow.form_controls, {
                        id: constants.PAYMENT_METHOD,
                    });
                    this.paymentFrequencyFields = _.find(this.subFlow.form_controls, {
                        id: constants.PAYMENT_FREQUENCY,
                    });
                    this.bankDetailsFields = _.reject(this.subFlow.form_controls, (o) => {
                        return o.id === constants.PAYMENT_METHOD || o.id === constants.PAYMENT_FREQUENCY;
                    });
                }
            });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
        this.store.pipe(select(selectors.getSelectedCountry)).subscribe((data) => {
            this.selectedCountry = data;
        });
        this.store.pipe(select(selectors.getFactorByName, constants.CONTRACT_DURATION_TYPE)).subscribe((data) => {
            if (data) {
                this.durationType = data.code;
                this.paymentMethod = {
                    [constants.ANNUAL_CONTRACT]: [
                        constants.BANK_TRANSFER,
                        constants.CREDIT_CARD,
                        constants.PAYPAL,
                        constants.BANK_WITHDRAWAL,
                    ],
                    [constants.TEMPORARY_CONTRACT]: [constants.CREDIT_CARD, constants.PAYPAL],
                };
                this.paymentFrequency = {
                    [constants.BANK_TRANSFER]: [constants.QUATERLY, constants.SEMI_ANNUAL, constants.ANNUAL],
                    [constants.CREDIT_CARD]: [constants.ANNUAL],
                    [constants.PAYPAL]: [constants.ANNUAL],
                    [constants.BANK_WITHDRAWAL]: [constants.ANNUAL],
                };
            }
        });
    }

    ngOnInit(): void {
        this.buildForm();
        if (
            this.paymentForm.get(this.paymentMethodId).value === this.bankTransfer &&
            this.paymentForm.get(this.paymentFrequencyId) &&
            this.paymentForm.get(this.paymentFrequencyId).valid
        ) {
            this.buildBankDetails();
        }
    }

    buildForm(): void {
        this.paymentForm = this.fb.group({});
        [this.paymentMethodFields, this.paymentFrequencyFields].map((formControl: any) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.paymentForm.addControl(formControl.id, control);
        });
    }

    buildBankDetails(): void {
        this.bankDetailsFields.map((formControl: any) => {
            const validators = this.formService.buildValidators(formControl);
            const valueByReference = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
            let value: any = valueByReference;
            if (formControl.id === constants.SENDER_ADDRESS_COUNTRY) {
                this.createBankCountryDropdown(formControl.options);
                const foundValue = _.find(this.options, ['value', valueByReference]);
                value = valueByReference ? foundValue.value : null;
                this.optionControl.setValue(foundValue);
            } else if (formControl.id === constants.BANK_IBAN) {
                const foundValue = this.optionControl.value;
                if (foundValue) {
                    this.createIbanMaskRegex(foundValue.value);
                } else {
                    this.createIbanMaskRegex(this.selectedCountry);
                }
                this.ibanValidators = [...validators];
                validators.push(Validators.pattern(this.ibanRegex));
                value = valueByReference;
            }
            const control = this.fb.control(value, validators);
            this.paymentForm.addControl(formControl.id, control);
        });
    }

    removeBankDetails(): void {
        this.bankDetailsFields.map((formControl: any) => {
            this.paymentForm.removeControl(formControl.id);
        });
    }

    createBankCountryDropdown(options: any[]): void {
        if (!this.options) {
            this.options = options;
        }

        this.filteredOptions = this.optionControl.valueChanges.pipe(
            startWith(''),
            map((option) => (typeof option === 'string' ? option : option.name)),
            map(
                (controlValue) =>
                    controlValue
                        ? this.formService.filterAutoCompleteList(controlValue, this.options)
                        : this.options.slice()
            )
        );
        this.optionControl.valueChanges.subscribe((value) => {
            if (typeof value === 'string') {
                this.paymentForm.get(constants.SENDER_ADDRESS_COUNTRY).setValue(null);
            }
        });
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    onBankCountryOptionSelected(e: any, id: string): void {
        const control = this.paymentForm.get(id);
        control.setValue(e.value);
        this.createIbanMaskRegex(e.value);
        const validators = this.ibanValidators.concat(Validators.pattern(this.ibanRegex));
        this.paymentForm.get(constants.BANK_IBAN).setValidators(validators);
        this.paymentForm.get(constants.BANK_IBAN).setValue(e.value);
        this.paymentForm.get(constants.BANK_IBAN).updateValueAndValidity();
    }

    selectRadioButton(value: string, id: string): void {
        const control = this.paymentForm.get(id);
        control.setValue(value);
    }

    selectPaymentMethod(value: string, id: string): void {
        if (this.durationType === constants.ANNUAL_CONTRACT) {
            if (value !== this.bankTransfer) {
                this.removeBankDetails();
            } else {
                this.buildBankDetails();
            }
            if (this.paymentForm.get(this.paymentFrequencyId)) {
                this.paymentForm.get(this.paymentFrequencyId).reset();
            }
        } else {
            // set to default payment freq to annual for temp contract, is a factor, cannot be null
            this.selectPaymentFrequency(constants.ANNUAL, this.paymentFrequencyId);
        }
        this.selectRadioButton(value, id);
    }

    selectPaymentFrequency(value: string, id: string): void {
        this.selectRadioButton(value, id);
    }

    continue(): void {
        if (this.paymentForm.valid) {
            let payload = JSON.parse(JSON.stringify(this.entityPolicy));
            payload = this.setFormControlsValue(payload);
            this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
            if (this.offerId) {
                this.postPayload(payload, constants.PAYMENT_METHOD_AND_FREQUENCY, this.offerId);
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
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
                        const formValue = this.paymentForm.get(formControl.id)
                            ? this.paymentForm.get(formControl.id).value
                            : null;
                        let updatedValue: any;
                        if (newPathArray[newPathArray.length - 1] === 'factor') {
                            const uniqueExisting = _.reject(existingValue, ['name', objectReference.name]);
                            updatedValue = this.formService.updateValueByType(uniqueExisting, {
                                code: formValue,
                                name: objectReference.name,
                            });
                        } else if (objectReference.name === null) {
                            updatedValue = this.formService.updateValueByType(existingValue, formValue);
                        } else {
                            updatedValue = this.formService.updateValueByType(existingValue, {
                                [objectReference.name]: formValue,
                            });
                        }
                        _.set(result, newPath, updatedValue);
                    }
                });
            }
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
                            flow: {
                                main_flow: constants.SUBSCRIPTION,
                                sub_flow_name: data.sub_flow_name,
                            },
                        })
                    );
                    this.store.dispatch(actions.resetBreadcrumb({main_flow: constants.SUBSCRIPTION}));
                    this.store.dispatch(actions.setEntityPolicy({entity_policy: response.entity_policy}));
                }
                this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: data.sub_flow_name}));
                this.store.dispatch(
                    actions.setSubscriptionValidSubflow({
                        sub_flow: constants.PAYMENT_METHOD_AND_FREQUENCY,
                    })
                );
                this.store.dispatch(actions.setSubscriptionFields({sub_flow: data}));
                this.store
                    .pipe(
                        select(selectors.getSubflowLink, {
                            mainflow: constants.SUBSCRIPTION_LINK,
                            subflow: data.sub_flow_name,
                        })
                    )
                    .subscribe((link) => {
                        this.router.navigateByUrl(
                            `${this.selectedLanguageCountry}/${constants.SUBSCRIPTION_LINK}/${link}`
                        );
                    })
                    .unsubscribe();
            })
            .catch((error) => {
                this.uexPopup.error(error.title, error.error_message);
            });
    }

    back(): void {
        this.router.navigateByUrl(
            `${this.selectedLanguageCountry}/${constants.SUBSCRIPTION_LINK}/${constants.PROFILE_DATA_DETAILS_LINK}`
        );
    }

    private createIbanMaskRegex(country: string, iban?: string): void {
        let mask: string;
        let ibanString = '^';

        if (iban) {
            mask = iban;
        } else {
            const defaultOption = this.options.find((c: any) => c.value === country.toUpperCase());
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

    openHelptip(id: string): void {
        const helpTip = this.subFlow.help_tips[id];
        this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
        this.uexSidenavService.open();
    }
}
