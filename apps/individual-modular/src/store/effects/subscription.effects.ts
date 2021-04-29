import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import * as fromActions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {SUBSCRIPTION} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService} from '@individual-modular/services/flow.service';
import {SpinnerService} from '@uex/uex-services';

@Injectable()
export class SubscriptionEffects {
    constructor(
        private actions: Actions,
        private flowService: FlowService,
        private store: Store<State>,
        private router: Router,
        private uexPopup: UexPopupService,
        private uexSpinnerService: SpinnerService
    ) {}

    postSubscription$: Observable<Actions> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.postSubscription),
            switchMap(({entity_policy, currentFlow, offerId}) => {
                return this.flowService
                    .postFlowObservable(entity_policy, currentFlow, offerId, window.location.origin)
                    .pipe(
                        map((response) => {
                            return [response, currentFlow];
                        }),
                        catchError((error) => {
                            this.uexSpinnerService.emitSpinner.emit({
                                showSpinner: false,
                                spinnerMessage: null,
                            });
                            this.uexPopup.error(error.error_title, error.error_message);
                            return of(false);
                        })
                    );
            }),
            switchMap((data) => {
                if (data) {
                    const response = data[0];
                    const currentFlow = data[1];
                    return combineLatest([
                        this.store.select(selectors.getMainflowLink, response.main_flow_name.toLowerCase()),
                        this.store.select(selectors.getSubflowLink, {
                            mainflow: response.main_flow_name.toLowerCase(),
                            subflow: response.sub_flow.sub_flow_name,
                        }),
                        this.store.select(selectors.getSelectedCountryLanguage),
                    ]).pipe(
                        map(([mainFlowLink, subFlowlink, selectedLanguageCountry]) => {
                            const link = `${selectedLanguageCountry}/${mainFlowLink}/${subFlowlink}`;
                            return [link, response, currentFlow];
                        })
                    );
                }
            }),
            switchMap(([link, response, currentFlow]) => {
                const actions = [];

                if (response.action && response.action.action_data) {
                    this.uexSpinnerService.emitSpinner.emit({
                        showSpinner: true,
                        spinnerMessage: null,
                    });
                    actions.push(fromActions.setSubscriptionValidSubflow({sub_flow: currentFlow}));
                    actions.push(fromActions.setSubscriptionFields({sub_flow: response.sub_flow}));

                    window.location.href = response.action.action_data.url;
                    return actions;
                } else {
                    if (response.impacted_flow) {
                        actions.push(
                            fromActions.resetLeftMenuCurrentFlow({
                                flow: {
                                    main_flow: SUBSCRIPTION,
                                    sub_flow_name: currentFlow,
                                },
                            })
                        );
                        actions.push(fromActions.resetBreadcrumb({main_flow: SUBSCRIPTION}));
                        actions.push(fromActions.setEntityPolicy({entity_policy: response.entity_policy}));
                    }

                    actions.push(
                        fromActions.setSubscriptionNextSubflow({
                            sub_flow: response.sub_flow.sub_flow_name,
                        })
                    );
                    actions.push(fromActions.setSubscriptionValidSubflow({sub_flow: currentFlow}));
                    actions.push(fromActions.setSubscriptionFields({sub_flow: response.sub_flow}));

                    this.router.navigate([link]);
                    return actions;
                }
            })
        )
    );
}
