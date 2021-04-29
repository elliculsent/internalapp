import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
    selector: 'uex-offer-customisation',
    templateUrl: './uex-offer-customisation.component.html',
    styleUrls: ['./uex-offer-customisation.component.scss'],
})
export class UexOfferCustomisationComponent implements OnChanges {
    @Input() offersValue: {[key: string]: number}[];
    @Input() offers: any;
    @Input() customisationRestriction: any;
    @Output() quoteEngineFormChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() openSideNav: EventEmitter<any> = new EventEmitter<any>();

    public invalidOffers: Array<string> = [];
    public quoteEngineForm: FormGroup;
    public showOffers: Array<boolean> = [];

    constructor(private fb: FormBuilder) {}

    ngOnChanges(): void {
        if (this.customisationRestriction) {
            this.customisationRestriction.coverage.map((item) => {
                if (this.invalidOffers.indexOf(item.name) < 0) {
                    this.invalidOffers.push(item.name);
                }
            });
        } else {
            this.invalidOffers = [];
        }
        this.buildForm();
    }

    private buildForm(): void {
        this.quoteEngineForm = this.fb.group({
            offers: this.buildOffersForm(),
        });
    }

    getValue(controlName: string): any {
        if (!this.offersValue) {
            return null;
        }
        let value: any;
        let offerByName: any;
        if (this.quoteEngineForm) {
            const formValues = this.quoteEngineForm.get('offers').value;
            offerByName = formValues.filter((offer: any) => offer[controlName]);
        } else {
            offerByName = this.offersValue.filter((offer: any) => offer[controlName]);
        }
        if (offerByName.length) {
            value = offerByName[0][controlName];
        }
        return value;
    }

    private buildOffersForm(): FormArray {
        const fa = new FormArray([]);
        this.offers.offers.forEach((val) => {
            const fg = new FormGroup({});
            const value = this.getValue(val.control_name);
            let fc = new FormControl(value ? value : val.init_value.value);
            if (!val.toggle_selection) {
                fc = new FormControl(value ? value : val.init_value.value, [
                    Validators.required,
                    this.levelValidator(val.control_name),
                ]);
            }
            fg.addControl(val.control_name, fc);
            fa.push(fg);
            this.showOffers.push(val.show_default);
        });
        return fa;
    }

    selectOffer(control: any, offer: any, val: string): void {
        if (offer.toggle_selection) {
            if (control.value === val) {
                control.setValue(null);
            } else {
                control.setValue(val);
            }
        } else {
            control.setValue(val);
        }
        this.buildPayload();
    }

    private buildPayload(): void {
        const offers = this.quoteEngineForm.get('offers')['controls'];
        let offersPayload = {};
        offers.forEach((item: any) => {
            offersPayload = {...offersPayload, ...item.value};
        });

        const formValue = this.quoteEngineForm.value;
        const payload = {
            offer_reimbursment_level: offersPayload,
            formValue,
        };
        this.quoteEngineFormChange.emit(payload);
    }

    sideNav(helpTips: any): void {
        this.openSideNav.emit(helpTips);
    }

    levelValidator(controlName: string): ValidatorFn {
        return (): {[key: string]: any} | null => {
            const customisationRestriction = this.customisationRestriction;
            if (customisationRestriction) {
                const foundCoverageRestriction = customisationRestriction.coverage.filter(
                    (coverage) => coverage.name === controlName
                );
                if (foundCoverageRestriction.length) {
                    return {invalidLevel: true};
                }
            }

            return null;
        };
    }
}
