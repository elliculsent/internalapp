import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {PAYMENT_METHOD_LINK, SUBSCRIPTION, SUBSCRIPTION_LINK, TNC} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService, FormService} from '@individual-modular/services/index';
import {SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'app-tnc',
    templateUrl: './tnc.component.html',
    styleUrls: ['./tnc.component.scss'],
})
export class TncComponent implements OnInit {
    public entityPolicy: EntityPolicy = null;
    public offerId: string | number;
    public subFlow: any;
    public selectedLanguageCountry: string;
    public tncForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private flowService: FlowService,
        private formService: FormService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSpinnerService: SpinnerService
    ) {
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.dispatch(actions.setSubscriptionActiveSubFlow({sub_flow: TNC}));
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.pipe(select(selectors.selectSubscriptionSubFlow, TNC)).subscribe((data) => {
            this.subFlow = data.fields;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.tncForm = this.fb.group({});
        this.subFlow.form_controls.map((formControl: any) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.tncForm.addControl(formControl.id, control);
        });
    }

    continue(): void {
        if (this.tncForm.valid) {
            let payload = JSON.parse(JSON.stringify(this.entityPolicy));
            payload = this.setFormControlsValue(payload);
            this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
            if (this.offerId) {
                this.postPayload(payload, TNC, this.offerId);
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
                    const newPath = this.formService.createNewPathForArrayIndex(objectReference.reference);
                    const toUpdate = this.formService.getUpdateValue(
                        objectReference,
                        result,
                        this.tncForm.get(formControl.id).value
                    );
                    _.set(result, newPath, toUpdate);
                });
            }
        });
        return result;
    }

    private postPayload(payload: any, currentFlow: string, offerId: string | number): void {
        this.uexSpinnerService.emitSpinner.emit({
            showSpinner: true,
            spinnerMessage: 'Nous préparons vos documents',
        });

        this.flowService
            .postFlow(payload, currentFlow, offerId, window.location.origin)
            .then((response) => {
                // Reset Left Menu & Breadcrumb Flow
                if (response.impacted_flow) {
                    const data = response.sub_flow;
                    this.store.dispatch(
                        actions.resetLeftMenuFlow({
                            flow: {main_flow: SUBSCRIPTION, sub_flow_name: data.sub_flow_name},
                        })
                    );
                    this.store.dispatch(actions.resetBreadcrumb({main_flow: SUBSCRIPTION}));
                    this.store.dispatch(actions.setEntityPolicy({entity_policy: response.entity_policy}));
                }

                this.store.dispatch(
                    actions.setSubscriptionValidSubflow({
                        sub_flow: TNC,
                    })
                );

                if (response && response.action && response.action.action_data) {
                    // UNIVERSIGN CASE
                    window.location.href = response.action['action_data']['url'];

                    // BAYMAX CASE, router navigation, using sub flow
                } else {
                    const data = response.sub_flow;
                    this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: data.sub_flow_name}));
                    this.store.dispatch(
                        actions.setEntityPolicy({
                            entity_policy: data.entity_policy,
                        })
                    );
                    this.store
                        .pipe(
                            select(selectors.getSubflowLink, {
                                mainflow: SUBSCRIPTION_LINK,
                                subflow: data.sub_flow_name,
                            })
                        )
                        .subscribe((link) => {
                            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${link}`);
                        })
                        .unsubscribe();
                }
            })
            .catch((error) => {
                if (error && 'error_message' in error) {
                    this.uexPopup.error(error.title, error.error_message);
                }
            });
    }

    back(): void {
        this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${PAYMENT_METHOD_LINK}`);
    }
}
