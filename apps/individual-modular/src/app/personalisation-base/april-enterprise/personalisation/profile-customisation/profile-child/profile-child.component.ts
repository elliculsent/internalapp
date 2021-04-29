import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {pluck, take} from 'rxjs/operators';

import {IAngularMyDpOptions, IMyInputFieldChanged} from 'angular-mydatepicker';
import * as moment from 'moment';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {
    BACKEND_DATE_FORMAT,
    CHILD,
    DEPENDANT_LINK,
    FAMILY,
    INSURED_DETAILS,
    MYSELF_LINK,
    PERSONALISATION_LINK,
    PROFILE_CUSTOMISATION,
    PROFILE_CUSTOMISATION_LINK,
    SUBSCRIPTION,
} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService, UtilsService} from '@individual-modular/services/index';
@Component({
    selector: 'app-profile-child',
    templateUrl: './profile-child.component.html',
    styleUrls: ['./profile-child.component.scss'],
})
export class ProfileChildComponent implements OnInit {
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public customisationForm: FormGroup;
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
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: CHILD}));
        this.subFlowFields$ = this.store.pipe(selectors.selectPersonalisationFields(PROFILE_CUSTOMISATION));
        this.buildForm();
    }

    buildForm(): void {
        this.customisationForm = this.fb.group({});
        this.store
            .pipe(take(1), selectors.selectPersonalisationFormControls(PROFILE_CUSTOMISATION))
            .subscribe((formControl: any) => {
                switch (formControl.id) {
                    case CHILD.toLowerCase():
                        this.childFields$ = of(formControl);
                        this.buildFormArrayFromInsured(formControl, CHILD);
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
            copyOptions[id].disableUntil = {...this.setMaxChildAge()};
        }

        if (control.enableUntil) {
            copyOptions[id].disableSince = {
                year: momentEnableUntil.get('year'),
                month: momentEnableUntil.get('month') + 1,
                day: momentEnableUntil.get('date'),
            };
        } else {
            // fallback frontend date validation
            copyOptions[id].disableSince = {...this.setMinChildAge()};
        }
        this.dateOptions = copyOptions;
    }

    setMaxChildAge(): any {
        const today = new Date();
        const maxYear = new Date(today.getFullYear() - 27, 0, 1);
        return {
            year: maxYear.getFullYear(),
            month: maxYear.getMonth() + 1,
            day: maxYear.getDate(),
        };
    }

    setMinChildAge(): any {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return {
            year: tomorrow.getFullYear(),
            month: tomorrow.getMonth() + 1,
            day: tomorrow.getDate(),
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

    addChild(id: string): void {
        combineLatest([
            this.subFlowFields$.pipe(take(1), pluck('max_leaf_count', CHILD)),
            this.childFields$.pipe(take(1)),
        ]).subscribe(([childMax, formControl]) => {
            const formGroup = this.buildFormGroup(formControl);
            this.childFormArray = this.customisationForm.get(id) as FormArray;
            this.childFormArray.push(formGroup);
            // tslint:disable-next-line: restrict-plus-operands
            if (this.childFormArray.value.length + 1 > childMax.max_leaf_count) {
                this.hideAddBtn = true;
            } else {
                this.hideAddBtn = false;
            }
        });
    }

    removeChild(idx: number, id: string): void {
        this.subFlowFields$.pipe(take(1), pluck('max_leaf_count', CHILD)).subscribe((maxChild) => {
            this.childFormArray = this.customisationForm.get(id) as FormArray;
            this.childFormArray.removeAt(idx);
            // tslint:disable-next-line: restrict-plus-operands
            if (this.childFormArray.value.length + 1 > maxChild.max_leaf_count) {
                this.hideAddBtn = true;
            } else {
                this.hideAddBtn = false;
            }
        });
    }

    setInsuredChild(): void {
        const childFormArray = this.customisationForm.get(CHILD.toLowerCase()) as FormArray;
        if (!childFormArray) {
            this.store.dispatch(
                actions.setInsured({
                    insured: [],
                    insuredType: CHILD,
                })
            );
            return;
        }
        const childControls = childFormArray.controls;
        const insuredObject = childControls.map((formGroup) => {
            let formValue = {};
            this.childFields$.pipe(take(1)).subscribe((childFields) => {
                formValue = childFields.controls.reduce((acc: any, curr: any) => {
                    const value = this.formService.getValueByControlType(curr.type, formGroup.get(curr.id).value);
                    acc[curr.id] = value;
                    return acc;
                }, formValue);
            });
            if (formGroup.get('insured_age').value) {
                formValue['insured_age'] = formGroup.get('insured_age').value;
            }
            return this.formService.createInsured(CHILD, formValue);
        });

        this.store.pipe(take(1), select(selectors.getInsuredByType, CHILD)).subscribe((data) => {
            let newData = insuredObject;
            if (data.length > 0) {
                // update birthdate & gender without removing the existing values on other properties
                newData = data
                    .map((val, idx) => {
                        if (insuredObject[idx]) {
                            val.insured_gender = insuredObject[idx].insured_gender;
                            val.insured_age = insuredObject[idx].insured_age;
                            val.insured_age_label = insuredObject[idx].insured_age_label;
                            val.insured_birthdate = insuredObject[idx].insured_birthdate;
                            return val;
                        } else {
                            return;
                        }
                    })
                    .filter((val) => val);

                // update insureObject with the old & new values
                newData = insuredObject.map((val, idx) => {
                    return {...val, ...newData[idx]};
                });

                if (insuredObject.length > data.length) {
                    this.store.dispatch(
                        actions.resetLeftMenuFlow({
                            flow: {
                                main_flow: SUBSCRIPTION,
                                sub_flow_name: INSURED_DETAILS,
                            },
                        })
                    );
                }
            }
            this.store.dispatch(
                actions.setInsured({
                    insured: newData,
                    insuredType: CHILD,
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
            if (formControl.id === CHILD.toLowerCase()) {
                this.setInsuredChild();
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
                        currentFlow: CHILD,
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
            this.store.pipe(take(1), select(selectors.getFamilyComposition)),
        ]).subscribe(([selectedLanguageCountry, familyComposition]) => {
            const customisationLink = `${selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`;
            if (familyComposition === FAMILY) {
                this.router.navigateByUrl(`${customisationLink}/${DEPENDANT_LINK}`);
            } else {
                this.router.navigateByUrl(`${customisationLink}/${MYSELF_LINK}`);
            }
        });
    }
}
