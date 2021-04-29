/* eslint-disable no-prototype-builtins */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';

import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {PAYMENT_METHOD_LINK, SUBSCRIPTION_LINK, TNC} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/index';
import {SpinnerService} from '@uex/uex-services';
import {pluck, take} from 'rxjs/operators';

@Component({
    selector: 'app-tnc',
    templateUrl: './tnc.component.html',
    styleUrls: ['./tnc.component.scss'],
})
export class TncComponent implements OnInit {
    public entityPolicy: any;
    public subFlowFields$: Observable<any>;
    public tncForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService,
        private uexSpinnerService: SpinnerService
    ) {
        this.subFlowFields$ = this.store.pipe(selectors.selectSubscriptionFields(TNC));
    }

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.buildForm();
    }

    buildForm(): void {
        this.tncForm = this.fb.group({});
        this.store.pipe(take(1), selectors.selectSubscriptionFormControls(TNC)).subscribe((formControl: any) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.tncForm.addControl(formControl.id, control);
        });
    }

    openHelptip(id?: string): void {
        this.subFlowFields$.pipe(pluck('help_tips'), take(1)).subscribe((helpTips) => {
            const helpTip = helpTips[id];
            this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
            this.uexSidenavService.open();
        });
    }

    setUpdatedEntityPolicy(entitiyPolicy: any): void {
        const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        this.subFlowFields$.pipe(take(1)).subscribe((fields: any) => {
            fields.form_controls.map((control: any) => {
                if (!control.hasOwnProperty('object_reference')) {
                    return;
                }
                control.object_reference.map((objectReference: any) => {
                    const formValue = this.formService.getValueByControlType(
                        control.type,
                        this.tncForm.get(control.id).value
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
        });
    }

    continue(): void {
        if (this.tncForm.invalid) {
            return;
        }
        this.setUpdatedEntityPolicy(this.entityPolicy);
        combineLatest([
            this.store.pipe(take(1), select(selectors.getOfferId)),
            this.store.pipe(take(1), select(selectors.selectEntityPolicy)),
        ]).subscribe(([offerId, entityPolicy]) => {
            if (offerId) {
                this.uexSpinnerService.emitSpinner.emit({
                    showSpinner: true,
                    spinnerMessage: 'Préparation des documents...',
                });

                this.store.dispatch(
                    actions.postSubscription({
                        entity_policy: entityPolicy,
                        currentFlow: TNC,
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
            this.router.navigateByUrl(`${selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${PAYMENT_METHOD_LINK}`);
        });
    }
}
