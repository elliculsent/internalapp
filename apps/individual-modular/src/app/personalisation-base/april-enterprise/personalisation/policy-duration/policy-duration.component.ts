import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {select, Store} from '@ngrx/store';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Observable, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {PERSONALISATION_LINK, POLICY_DURATION, PROFILE_DETAILS_LINK} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';

@Component({
    selector: 'app-policy-duration',
    templateUrl: './policy-duration.component.html',
    styleUrls: ['./policy-duration.component.scss'],
})
export class PolicyDurationComponent implements OnInit, OnDestroy {
    public entityPolicy: EntityPolicy = null;
    public myDp: IMyDateModel = null;
    public dateOptions: IAngularMyDpOptions = {};
    public policyDurationForm: FormGroup;
    public subFlowFields$: Observable<any>;
    private subscription: Subscription;
    public locale = 'fr';

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private uexPopup: UexPopupService
    ) {}

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: POLICY_DURATION}));
        this.subFlowFields$ = this.store.pipe(selectors.selectPersonalisationFields(POLICY_DURATION));
        this.buildForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    buildForm(): void {
        this.subscription = this.subFlowFields$.subscribe((fields) => {
            this.policyDurationForm = this.fb.group({});
            fields.form_controls.map((formControl: any) => {
                const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                const validators = this.formService.buildValidators(formControl);
                const control = this.fb.control(value, validators);
                this.policyDurationForm.addControl(formControl.id, control);
                if (formControl.type === 'date') {
                    this.setDateOptions(formControl);
                    this.setDate(formControl, value);
                }
            });
        });
    }

    setDateOptions(formControl: any): void {
        if (formControl.enableSince && formControl.enableUntil) {
            this.setInitialDateOptions(formControl, formControl.enableSince, formControl.enableUntil);
        } else {
            const copyOptions = JSON.parse(JSON.stringify(this.dateOptions));
            const today = new Date();
            const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
            copyOptions.dateFormat = formControl.format;
            copyOptions.disableUntil = {
                year: lastDay.getFullYear(),
                month: lastDay.getMonth() + 1,
                day: lastDay.getDate(),
            };
            this.dateOptions = copyOptions;
        }
    }

    setInitialDateOptions(formControls: any, enableSince: any, enableUntil: any): void {
        const format = formControls.format.toUpperCase();
        const momentEnableSince = enableSince ? moment(formControls.enableSince, format) : null;
        const momentEnableUntil = enableUntil ? moment(formControls.enableUntil, format) : null;
        this.setDisableDate(momentEnableSince, momentEnableUntil);
    }

    setDate(formControls: any, foundValue: string): void {
        const value = foundValue ? foundValue : formControls.defaultValue;
        const dateModel = this.formService.getDateModel(value);
        if (dateModel) {
            this.policyDurationForm.get(formControls.id).setValue(dateModel);
        }
    }

    setDisableDate(enableSince: moment.Moment, enableUntil: moment.Moment): void {
        const copyOptions = JSON.parse(JSON.stringify(this.dateOptions));
        if (enableSince) {
            copyOptions.disableUntil = {
                year: enableSince.get('year'),
                month: enableSince.get('month') + 1,
                day: enableSince.get('date'),
            };
        }

        if (enableUntil) {
            copyOptions.disableSince = {
                year: enableUntil.get('year'),
                month: enableUntil.get('month') + 1,
                day: enableUntil.get('date'),
            };
        }
        this.dateOptions = copyOptions;
    }

    getUpdatedEntitiyPolicy(entityPolicy: any): any {
        const newEntityPolicy = JSON.parse(JSON.stringify(entityPolicy));
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectPersonalisationFormControls(POLICY_DURATION)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            formControl.object_reference.map((objectReference: any) => {
                const formControlValue = this.policyDurationForm.get(formControl.id).value;
                const formValue = this.formService.getValueByControlType(formControl.type, formControlValue);
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
        return newEntityPolicy;
    }

    continue(): void {
        if (this.policyDurationForm.invalid) {
            return;
        }
        const entityPolicyPayload = this.getUpdatedEntitiyPolicy(this.entityPolicy);
        this.store.pipe(take(1), select(selectors.getOfferId)).subscribe((offerId) => {
            if (offerId) {
                this.store.dispatch(
                    actions.postPersonalisation({
                        entity_policy: entityPolicyPayload,
                        currentFlow: POLICY_DURATION,
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
            this.router.navigateByUrl(`${selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_DETAILS_LINK}`);
        });
    }
}
