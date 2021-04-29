import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {pluck, take} from 'rxjs/operators';

import {IAngularMyDpOptions, IMyDefaultMonth, IMyInputFieldChanged} from 'angular-mydatepicker';
import * as _ from 'lodash';
import * as moment from 'moment';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {
    BACKEND_DATE_FORMAT,
    MYSELF,
    PERSONALISATION_LINK,
    POLICY_HOLDER,
    PROFILE_CUSTOMISATION,
    PROFILE_CUSTOMISATION_LINK,
} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService, UtilsService} from '@individual-modular/services/index';
@Component({
    selector: 'app-profile-myself',
    templateUrl: './profile-myself.component.html',
    styleUrls: ['./profile-myself.component.scss'],
})
export class ProfileMyselfComponent implements OnInit {
    private entityPolicy: EntityPolicy = null;
    public dateOptions: {[key: string]: IAngularMyDpOptions} = {};
    public defaultMonth: IMyDefaultMonth = {
        defMonth: '01/1990',
    };
    public customisationForm: FormGroup;
    public subFlowFields$: Observable<any>;
    public familyCompositionFields$: Observable<any>;
    public policyHolderFields$: Observable<any>;
    public locale = 'fr';

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private uexSidenavService: UexSidenavService,
        private utilsService: UtilsService,
        private uexPopup: UexPopupService
    ) {}

    ngOnInit(): void {
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: MYSELF}));
        this.subFlowFields$ = this.subFlowFields$ = this.store.pipe(
            selectors.selectPersonalisationFields(PROFILE_CUSTOMISATION)
        );
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((entityPolicy) => {
            this.entityPolicy = entityPolicy;
        });
        this.buildForm();
    }

    buildForm(): void {
        this.customisationForm = this.fb.group({});
        this.store
            .pipe(selectors.selectPersonalisationFormControls(PROFILE_CUSTOMISATION))
            .subscribe((formControl: any) => {
                if (formControl.id === POLICY_HOLDER.toLowerCase()) {
                    this.policyHolderFields$ = of(formControl);
                    this.buildCustomisationControls(formControl);
                }
            });
    }

    buildCustomisationControls(formControl: any): void {
        formControl.controls.map((control: any) => {
            const foundValue = this.formService.findValueWithObjectReference(control, this.entityPolicy);
            const value = this.buildValue(control, foundValue);
            const validators = this.formService.buildValidators(control);
            const fbControl = this.fb.control(value, validators);
            if (control.type === 'date') {
                this.setControlDateOption(formControl.id, control);
            }
            this.customisationForm.addControl(control.id, fbControl);
        });
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
        // this.dateOptions['dayLabels'] = this.dayLabels
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
        const maxYear = new Date(today.getFullYear() - 17, 0, 1);
        return {
            year: maxYear.getFullYear(),
            month: maxYear.getMonth() + 1,
            day: maxYear.getDate(),
        };
    }

    openHelptip(id: string): void {
        this.subFlowFields$.pipe(pluck('help_tips'), take(1)).subscribe((helpTips) => {
            const helpTip = helpTips[id];
            this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
            this.uexSidenavService.open();
        });
    }

    onDateChanged($event: IMyInputFieldChanged, controlId: string, index?: number): void {
        if (!$event.valid) {
            return;
        }
        const selectedDate = moment($event.value, $event.dateFormat.toUpperCase());
        const toSend = selectedDate.format(BACKEND_DATE_FORMAT);
        this.utilsService.getInsuredAges(toSend).then((insuredAge) => {
            const control = this.fb.control(insuredAge[0], [Validators.required]);
            if (controlId === POLICY_HOLDER.toLowerCase()) {
                this.customisationForm.removeControl('insured_age');
                this.customisationForm.addControl('insured_age', control);
            } else {
                const formArray = this.customisationForm.get(controlId) as FormArray;
                const formGroup = formArray.at(index) as FormGroup;
                formGroup.removeControl('insured_age');
                formGroup.addControl('insured_age', control);
            }
        });
    }

    getUpdatedEntitiyPolicy(entitiyPolicy: any): void {
        const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectPersonalisationFormControls(PROFILE_CUSTOMISATION)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            if (formControl.id === POLICY_HOLDER.toLowerCase()) {
                formControl.controls.map((control: any) => {
                    // eslint-disable-next-line no-prototype-builtins
                    if (!control.hasOwnProperty('object_reference')) {
                        return;
                    }
                    control.object_reference.map((objectReference: any) => {
                        const formValue = this.formService.getValueByControlType(
                            control.type,
                            this.customisationForm.get(control.id).value
                        );
                        const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                            objectReference,
                            newEntityPolicy,
                            formValue
                        );
                        _.set(newEntityPolicy, newPath, updatedValue);
                    });
                });
                _.set(
                    newEntityPolicy,
                    'policy.group[0].insured[0].insured_age',
                    this.customisationForm.get('insured_age').value
                );
                _.set(
                    newEntityPolicy,
                    'policy.group[0].insured[0].insured_age_label',
                    `${this.customisationForm.get('insured_age').value.years} years(s) `
                );
                this.store.dispatch(
                    actions.setEntityPolicy({
                        entity_policy: newEntityPolicy,
                    })
                );
            }
        });
    }

    continue(): void {
        if (this.customisationForm.invalid) {
            return;
        }
        this.getUpdatedEntitiyPolicy(this.entityPolicy);

        combineLatest([this.store.pipe(take(1), select(selectors.getOfferId))]).subscribe(([offerId]) => {
            if (offerId) {
                this.store.dispatch(
                    actions.setProfileCustomisation({
                        currentFlow: MYSELF,
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
                `${selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`
            );
        });
    }
}
