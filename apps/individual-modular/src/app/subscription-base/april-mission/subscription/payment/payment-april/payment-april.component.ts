import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {select, Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {PAYMENT, SUBSCRIPTION, SUBSCRIPTION_LINK} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService} from '@individual-modular/services/flow.service';

@Component({
    selector: 'app-payment-april',
    templateUrl: './payment-april.component.html',
    styleUrls: ['./payment-april.component.scss'],
})
export class PaymentAprilComponent {
    public entityPolicy: EntityPolicy = null;
    public offerId: string | number;
    public selectedLanguageCountry: string;
    public subFlow: any;
    constructor(
        private flowService: FlowService,
        private store: Store<State>,
        private router: Router,
        private uexPopup: UexPopupService
    ) {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store
            .pipe(select(selectors.selectSubscriptionSubFlow, PAYMENT))
            .subscribe((data) => {
                this.subFlow = data.fields;
            })
            .unsubscribe();
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    continue(): void {
        this.flowService
            .postFlow(this.entityPolicy, PAYMENT, this.offerId, window.location.origin)
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
                        sub_flow: PAYMENT,
                    })
                );
                if (
                    response.action &&
                    response.action.action_data &&
                    response.action.action_data.method &&
                    response.action['action_data']['method'] === 'POST'
                ) {
                    this.submitPaymentForm(response);
                } else {
                    this.redirectToConfirmation(response);
                }
            })
            .catch((error) => {
                if (error && 'error_message' in error) {
                    this.uexPopup.error(error.title, error.error_message);
                }
            });
    }

    private submitPaymentForm(response: any): void {
        const paymentForm = response.action['action_data']['payment_form'];
        const url = response.action['action_data']['url'];
        const form = document.createElement('form');

        form.method = 'POST';
        form.action = url;
        for (const formEl of paymentForm) {
            const element = document.createElement('input');
            element.type = 'hidden';
            element.value = formEl.value;
            element.name = formEl.name;
            form.appendChild(element);
        }
        document.body.appendChild(form);
        form.submit();
    }

    private redirectToConfirmation(response: any): void {
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
}
