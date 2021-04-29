import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';

import * as fromActions from '@individual-modular/actions';
import {environment} from '@individual-modular/environment/environment';
import {UexPopupService} from '@uex/uex-popup';
import * as constants from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {ProductService} from '@uex/uex-services';

@Injectable()
export class ProductEffects {
    private isSetBreadcrumb: boolean;
    private isSetLeftMenu: boolean;
    private offerId: string | number;

    constructor(
        private actions: Actions,
        private productService: ProductService,
        private store: Store<State>,
        private uexPopup: UexPopupService
    ) {
        this.productService.setBaseUrl = environment.baymax_backend_root_url;
        this.productService.setProductCode = environment.product.code;

        combineLatest([
            this.store.select(selectors.isSetBreadcrumb),
            this.store.select(selectors.isLeftMenuSet),
            this.store.select(selectors.getOfferId),
        ]).subscribe(([isSetBreadcrumb, isSetLeftMenu, offerId]) => {
            this.isSetBreadcrumb = isSetBreadcrumb;
            this.isSetLeftMenu = isSetLeftMenu;
            this.offerId = offerId;
        });
    }

    initProductObject: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.initProductObject),
            switchMap(() =>
                this.productService
                    .postMultiComponentDisplay([
                        constants.GENERAL_COMPONENT,
                        constants.INITIAL_ENTITY_POLICY,
                        constants.INITIAL_FLOW,
                    ])
                    .pipe(
                        map((data) => data),
                        catchError((error) => {
                            this.uexPopup.error(error.error_title, error.error_message);
                            return of(false);
                        })
                    )
            ),
            mergeMap((data) => {
                if (data) {
                    const response = [];
                    // SET GENERIC OBJECTS
                    response.push(
                        fromActions.setInitForgotPasswordConfig({
                            forgotPasswordConfig: data.general_component.forgot_password.fields,
                        })
                    );
                    response.push(
                        fromActions.setInitLeadAcquisitionConfig({
                            leadAcquisitionConfig: data.general_component.lead_acquisition.fields,
                        })
                    );
                    response.push(
                        fromActions.setInitLoginConfig({
                            loginConfig: data.general_component.login_funnel.fields,
                        })
                    );
                    response.push(
                        fromActions.setInitSignupConfig({
                            signupConfig: data.general_component.signup_funnel.fields,
                        })
                    );
                    response.push(
                        fromActions.setInitBreadcrumb({
                            breadcrumb: data.general_component.breadcrump_menu.steps,
                        })
                    );
                    response.push(fromActions.setInitEntityPolicy({entityPolicy: data.entity_policy}));
                    this.productService.setProductVersion = data.entity_policy.policy.product.product_version;

                    response.push(fromActions.setInitFlow({initialFlow: data.initial_flow.sub_flow}));
                    response.push(fromActions.setInitLeftMenu({leftMenu: data.general_component.left_menu}));

                    if (!this.isSetBreadcrumb) {
                        response.push(
                            fromActions.setBreadcrumb({
                                items: data.general_component.breadcrump_menu.steps,
                            })
                        );
                    }

                    if (!this.offerId) {
                        response.push(fromActions.setEntityPolicy({entity_policy: data.entity_policy}));
                    }

                    if (!this.isSetLeftMenu) {
                        response.push(
                            fromActions.setInitialLeftMenu({
                                left_menu: data.general_component.left_menu,
                                sub_flow: data.initial_flow.sub_flow,
                            })
                        );
                    } else {
                        response.push(
                            fromActions.setPersonalisationFields({
                                sub_flow: data.initial_flow.sub_flow,
                            })
                        );
                    }

                    response.push(fromActions.setIsDataFetched({isDataFetched: true}));
                    return response;
                }
            })
        )
    );
}
