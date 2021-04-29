import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import * as fromActions from '@uex/uex-store/actions';
import {UexPopupService} from '@uex/uex-popup';
import {PERSONALISATION, PERSONALISATION_LINK, QUOTATION_LINK} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';
import * as selectors from '@uex/uex-store/selectors';
import {FlowService} from '@individual-modular/services/flow.service';

@Injectable()
export class PersonalisationEffects {
    private entityPolicy: EntityPolicy;

    constructor(
        private actions: Actions,
        private flowService: FlowService,
        private store: Store<UexState>,
        private router: Router,
        private uexPopup: UexPopupService
    ) {
        this.store.select(selectors.selectEntityPolicy).subscribe((data) => {
            this.entityPolicy = data;
        });
    }

    postPersonalisation$: Observable<Actions> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.postPersonalisation),
            switchMap(({currentFlow, offerId}) => {
                return this.flowService.postFlowObservable(this.entityPolicy, currentFlow, offerId).pipe(
                    map((response) => {
                        return [response, currentFlow];
                    }),
                    catchError((error) => {
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
                            let isQuotation = false;
                            let mainLink = `${selectedLanguageCountry}/${mainFlowLink}/`;
                            if (mainFlowLink === PERSONALISATION_LINK) {
                                mainLink = `${mainLink}/${subFlowlink}`;
                            }
                            if (mainFlowLink === QUOTATION_LINK) {
                                isQuotation = true;
                            }
                            return [mainLink, response, currentFlow, isQuotation];
                        })
                    );
                }
            }),
            switchMap(([link, response, currentFlow, isQuotation]) => {
                const actions = [];
                actions.push(fromActions.setPersonalisationValidSubflow({sub_flow: currentFlow}));

                if (isQuotation) {
                    actions.push(fromActions.setMainflowIsValid({main_flow: PERSONALISATION, is_valid: true}));
                    actions.push(fromActions.setQuotationFields({sub_flow: response.sub_flow}));
                } else {
                    actions.push(
                        fromActions.setPersonalisationNextSubflow({
                            sub_flow: response.sub_flow.sub_flow_name,
                        })
                    );
                    actions.push(fromActions.setPersonalisationFields({sub_flow: response.sub_flow}));
                }

                if (response.impacted_flow) {
                    actions.push(
                        fromActions.resetLeftMenuFlow({
                            flow: {
                                main_flow: PERSONALISATION,
                                sub_flow_name: response.sub_flow.sub_flow_name,
                            },
                        })
                    );
                    actions.push(fromActions.resetBreadcrumb({main_flow: PERSONALISATION}));
                    actions.push(fromActions.setEntityPolicy({entity_policy: response.entity_policy}));
                }

                this.router.navigate([link]);
                return actions;
            })
        )
    );
}
