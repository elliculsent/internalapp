import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {take} from 'rxjs/operators';

import {IAngularMyDpOptions, IMyDefaultMonth, IMyInputFieldChanged} from 'angular-mydatepicker';
import * as moment from 'moment';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {
    ADULT_SPOUSE,
    BACKEND_DATE_FORMAT,
    DEPENDANT,
    INSURED_DETAILS,
    MYSELF_LINK,
    PERSONALISATION_LINK,
    PROFILE_CUSTOMISATION,
    PROFILE_CUSTOMISATION_LINK,
    SPOUSE,
    SUBSCRIPTION,
} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService, UtilsService} from '@individual-modular/services/index';

@Component({
    selector: 'app-profile-spouse',
    templateUrl: './profile-spouse.component.html',
    styleUrls: ['./profile-spouse.component.scss'],
})
export class ProfileSpouseComponent implements OnInit {
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public defaultMonth: IMyDefaultMonth = {
        defMonth: '01/1990',
    };
    public customisationForm: FormGroup;
    public showChild = false;
    public selectedFamilyComposition: string = null;
    public showSpouse = false;
    public hideAddBtn = false;
    public childFormArray: FormArray;
    public subFlowFields$: Observable<any>;
    public familyCompositionFields$: Observable<any>;
    public policyHolderFields$: Observable<any>;
    public spouseFields$: Observable<any>;
    public childFields$: Observable<any>;
    public locale = 'fr';

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private utilsService: UtilsService,
        private uexPopup: UexPopupService
    ) {}

    ngOnInit(): void {
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: SPOUSE}));
        this.subFlowFields$ = this.store.pipe(selectors.selectPersonalisationFields(PROFILE_CUSTOMISATION));
        this.buildForm();
    }

    buildForm(): void {
        this.customisationForm = this.fb.group({});
        this.store
            .pipe(take(1), selectors.selectPersonalisationFormControls(PROFILE_CUSTOMISATION))
            .subscribe((formControl: any) => {
                switch (formControl.id) {
                    case ADULT_SPOUSE.toLowerCase():
                        this.spouseFields$ = of(formControl);
                        this.buildFormArrayFromInsured(formControl, SPOUSE);
                        break;
                }
            });
    }

    buildFormArrayFromInsured(formControl: any, insuredType: string): void {
        this.store.pipe(take(1), select(selectors.getInsuredByType, insuredType)).subscribe((insured) => {
            if (insured && insured.length) {
                const fbArray = this.fb.array([]);
                insured.map((insuredData) => {
                    const formGroup: FormGroup = this.buildFormGroup(formControl, insuredData);
                    fbArray.push(formGroup);
                });
                this.customisationForm.addControl(formControl.id, fbArray);
            } else {
                this.buildFormArray(formControl);
            }
        });
    }

    buildFormArray(formControl: any): void {
        const formGroup: FormGroup = this.buildFormGroup(formControl);
        this.customisationForm.addControl(formControl.id, this.fb.array([formGroup]));
    }

    buildValue(control: any, value: any = null): any {
        let newValue = value;
        if (control.type === 'dropdown') {
            newValue = newValue ? newValue.toLowerCase() : control.options[0].value;
            return newValue;
        } else if (control.type === 'date') {
            const dateModel = this.formService.getDateModel(newValue);
            return dateModel;
        } else {
            return newValue;
        }
    }

    buildFormGroup(formControl: any, value?: any): FormGroup {
        const formGroup: FormGroup = this.fb.group({});
        formControl.controls.map((control: any) => {
            let newValue = this.buildValue(control);
            if (value) {
                newValue = this.buildValue(control, value[control.id]);
            }
            const validators = this.formService.buildValidators(control);
            const fbControl = this.fb.control(newValue, validators);
            if (control.type === 'date') {
                this.setControlDateOption(formControl.id, control);
            }
            formGroup.addControl(control.id, fbControl);
        });
        return formGroup;
    }

    setControlDateOption(id: string, control: any): void {
        // const format = control.format.toUpperCase();
        const momentEnableSince = control.enableSince ? moment(control.enableSince, 'yyyy-mm-dd') : null;
        const momentEnableUntil = control.enableUntil ? moment(control.enableUntil, 'yyyy-mm-dd') : null;
        const copyOptions = JSON.parse(JSON.stringify(this.dateOptions));
        copyOptions[id] = {
            dateRange: false,
            dateFormat: control.format,
            defaultView: 3,
        };
        if (control.enableSince) {
            copyOptions[id].disableUntil = {
                year: momentEnableSince.get('year'),
                month: momentEnableSince.get('month') + 1,
                day: momentEnableSince.get('date'),
            };
        } else {
            // fallback frontend date validation
            copyOptions[id].disableUntil = {...this.setMaxAdultAge()};
        }

        if (control.enableUntil) {
            copyOptions[id].disableSince = {
                year: momentEnableUntil.get('year'),
                month: momentEnableUntil.get('month') + 1,
                day: momentEnableUntil.get('date'),
            };
        } else {
            // fallback frontend date validation
            copyOptions[id].disableSince = {...this.setMinAdultAge()};
        }
        this.dateOptions = copyOptions;
    }

    // TODO : might need it later
    setMaxAdultAge(): any {
        const today = new Date();
        const maxYear = new Date(today.getFullYear() - 80, 0, 0);
        return {
            year: maxYear.getFullYear(),
            month: maxYear.getMonth() + 1,
            day: maxYear.getDate(),
        };
    }

    setMinAdultAge(): any {
        const today = new Date();
        const maxYear = new Date(today.getFullYear() - 18, 0, 1);
        return {
            year: maxYear.getFullYear(),
            month: maxYear.getMonth() + 1,
            day: maxYear.getDate(),
        };
    }

    onDateChanged($event: IMyInputFieldChanged, controlId: string, index?: number): void {
        if (!$event.valid) {
            return;
        }
        const selectedDate = moment($event.value, $event.dateFormat.toUpperCase());
        const toSend = selectedDate.format(BACKEND_DATE_FORMAT);
        this.utilsService.getInsuredAges(toSend).then((insuredAge) => {
            const control = this.fb.control(insuredAge[0], [Validators.required]);
            const formArray = this.customisationForm.get(controlId) as FormArray;
            const formGroup = formArray.at(index) as FormGroup;
            formGroup.removeControl('insured_age');
            formGroup.addControl('insured_age', control);
        });
    }

    setInsuredSpouse(): void {
        const spouseFormArray = this.customisationForm.get(ADULT_SPOUSE.toLowerCase()) as FormArray;
        if (!spouseFormArray) {
            this.store.dispatch(
                actions.setInsured({
                    insured: [],
                    insuredType: SPOUSE,
                })
            );
            return;
        }
        const spouseControls = spouseFormArray.controls;
        const insuredObject = spouseControls.map((formGroup) => {
            let formValue = {};
            this.spouseFields$.pipe(take(1)).subscribe((spouseFields) => {
                formValue = spouseFields.controls.reduce((acc: any, curr: any) => {
                    const value = this.formService.getValueByControlType(curr.type, formGroup.get(curr.id).value);
                    acc[curr.id] = value;
                    return acc;
                }, formValue);
            });

            if (formGroup.get('insured_gender').value) {
                formValue['insured_gender'] = formGroup.get('insured_gender').value;
            }

            if (formGroup.get('insured_age').value) {
                formValue['insured_age'] = formGroup.get('insured_age').value;
            }
            return this.formService.createInsured(SPOUSE, formValue);
        });

        this.store.pipe(take(1), select(selectors.getInsuredByType, SPOUSE)).subscribe((data) => {
            let newData = insuredObject;
            if (data.length > 0) {
                newData = data.map((val, idx) => {
                    val.insured_gender = insuredObject[idx].insured_gender;
                    val.insured_age = insuredObject[idx].insured_age;
                    val.insured_age_label = insuredObject[idx].insured_age_label;
                    val.insured_birthdate = insuredObject[idx].insured_birthdate;
                    return val;
                });
            } else {
                // this means spouse is newly added in insured array
                // so need to reset insured-details validation
                this.store.dispatch(
                    actions.resetLeftMenuFlow({
                        flow: {
                            main_flow: SUBSCRIPTION,
                            sub_flow_name: INSURED_DETAILS,
                        },
                    })
                );
            }
            this.store.dispatch(
                actions.setInsured({
                    insured: newData,
                    insuredType: SPOUSE,
                })
            );
        });
    }

    getUpdatedEntitiyPolicy(): void {
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectPersonalisationFormControls(PROFILE_CUSTOMISATION)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            if (formControl.id === ADULT_SPOUSE.toLowerCase()) {
                this.setInsuredSpouse();
            }
        });
    }

    continue(): void {
        if (this.customisationForm.invalid) {
            return;
        }
        this.getUpdatedEntitiyPolicy();

        combineLatest([this.store.pipe(take(1), select(selectors.getOfferId))]).subscribe(([offerId]) => {
            if (offerId) {
                this.store.dispatch(
                    actions.setProfileCustomisation({
                        currentFlow: DEPENDANT,
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
            this.router.navigateByUrl(
                `${selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}/${MYSELF_LINK}`
            );
        });
    }
}
