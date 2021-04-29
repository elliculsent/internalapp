import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';

import * as fromActions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import * as constants from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {AuthService, PolicyService, SpinnerService} from '@uex/uex-services';

@Injectable()
export class UserEffects {
    private initBreadcrumb: any;
    private initEntityPolicy: any;
    private initLeftMenu: any;
    private initFlow: any;
    private selectedLanguageCountry: string;
    private userToken: string;

    constructor(
        private actions: Actions,
        private authService: AuthService,
        private policyService: PolicyService,
        private router: Router,
        private store: Store<State>,
        private uexSpinnerService: SpinnerService,
        private uexPopup: UexPopupService
    ) {
        this.authService.setBaseUrl = environment.baymax_backend_root_url;
        this.policyService.setBaseUrl = environment.baymax_backend_root_url;

        combineLatest([
            this.store.select(selectors.getInitBreadcrumb),
            this.store.select(selectors.getInitEntityPolicy),
            this.store.select(selectors.getInitFlow),
            this.store.select(selectors.getInitLeftMenu),
            this.store.select(selectors.getSelectedCountryLanguage),
        ]).subscribe(([initBreadcrumb, initEntityPolicy, initFlow, initLeftMenu, selectedLanguageCountry]) => {
            this.initBreadcrumb = initBreadcrumb;
            this.initEntityPolicy = initEntityPolicy;
            this.initFlow = initFlow;
            this.initLeftMenu = initLeftMenu;
            this.selectedLanguageCountry = selectedLanguageCountry;
        });
    }

    @Effect()
    postLogin: Observable<Action> = this.actions.pipe(
        ofType(fromActions.postLogin),
        switchMap(({login_data}) =>
            this.authService.postLogin(login_data).pipe(
                map((data) => data),
                catchError((error) => {
                    this.uexPopup.error(error.error_title, error.error_message).subscribe(() => {
                        this.router
                            .navigateByUrl(`${location.pathname}`, {skipLocationChange: true})
                            .then(() => this.router.navigateByUrl(`${location.pathname}#openLogin`));
                    });
                    return of(false);
                })
            )
        ),
        mergeMap((data) => {
            const actions = [];
            if (data) {
                this.userToken = data.token.access_token;
                actions.push(fromActions.setUserData({user_data: data}));
                actions.push(fromActions.postUserProductPolicy());
            }
            return actions;
        })
    );

    @Effect()
    postUserProductPolicy: Observable<Action> = this.actions.pipe(
        ofType(fromActions.postUserProductPolicy),
        switchMap(() =>
            this.policyService.getUserProductPolicy(environment.product.code).pipe(
                map((data) => data),
                catchError((error) => {
                    this.uexPopup.error(error.error_title, error.error_message);
                    this.store.dispatch(fromActions.postLogout({user_token: this.userToken}));
                    return of(false);
                })
            )
        ),
        mergeMap((result) => {
            let actions = [];
            if (result && result['entity_policy']) {
                actions = this.resetStore(result['entity_policy'], result['flow'], result['product_display']);
            } else {
                this.uexSpinnerService.emitSpinner.emit({
                    showSpinner: false,
                    spinnerMessage: null,
                });
            }

            return actions;
        })
    );

    @Effect()
    postLogout: Observable<Action> = this.actions.pipe(
        ofType(fromActions.postLogout),
        switchMap(({user_token}) =>
            this.authService.postLogout(user_token).pipe(
                map(() => of(true)),
                catchError((error) => {
                    this.uexPopup.error(error.error_title, error.error_message);
                    return of(false);
                })
            )
        ),
        mergeMap((response) => {
            if (response) {
                const flow = {
                    main_flow_name: constants.PERSONALISATION,
                    sub_flow_name: constants.PROFILE_DETAILS,
                };
                const productDisplay = {
                    left_menu: this.initLeftMenu,
                    breadcrump: {
                        items: this.initBreadcrumb,
                    },
                };
                const actions = this.resetStore(this.initEntityPolicy, flow, productDisplay);

                this.uexSpinnerService.emitSpinner.emit({
                    showSpinner: false,
                    spinnerMessage: null,
                });

                actions.push(fromActions.setPersonalisationFields({sub_flow: this.initFlow}));
                actions.push(fromActions.unsetUserData({user_data: null}));
                actions.push(fromActions.setFamilyComposition({familyComposition: null}));
                actions.push(fromActions.resetMisc());
                actions.push(fromActions.resetEntityPolicy({entity_policy: this.initEntityPolicy}));
                return actions;
            }
        })
    );

    @Effect({dispatch: false})
    userRedirection: Observable<void> = this.actions.pipe(
        ofType(fromActions.userRedirection),
        map(({flow}) => {
            const mainFlowName = this._getMainFlowConstantValue(flow['main_flow_name']);
            const subFlowName = this._getSubFlowConstantValue(flow['sub_flow_name']);
            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${mainFlowName}/${subFlowName}`);

            // if redirection is on the same link destroy the spinner
            if (location.pathname.includes(mainFlowName)) {
                this.uexSpinnerService.emitSpinner.emit({
                    showSpinner: false,
                    spinnerMessage: null,
                });
            }
        })
    );

    @Effect()
    userNewSubscription: Observable<Action> = this.actions.pipe(
        ofType(fromActions.userNewSubscription),
        switchMap(() => {
            const flow = {
                main_flow_name: constants.PERSONALISATION,
                sub_flow_name: constants.PROFILE_DETAILS,
            };
            const productDisplay = {
                left_menu: this.initLeftMenu,
                breadcrump: {
                    items: this.initBreadcrumb,
                },
            };
            const actions = this.resetStore(this.initEntityPolicy, flow, productDisplay);

            actions.push(fromActions.setPersonalisationFields({sub_flow: this.initFlow}));
            actions.push(fromActions.setFamilyComposition({familyComposition: null}));
            actions.push(fromActions.resetMisc());
            return actions;
        })
    );

    private resetStore(entityPolicy: any, flow: any, productDisplay: any): Array<Action> {
        const actions = [];

        actions.push(fromActions.setEntityPolicy({entity_policy: entityPolicy}));
        actions.push(fromActions.setLeftMenu({left_menu: productDisplay.left_menu}));
        actions.push(fromActions.setBreadcrumb({items: productDisplay.breadcrump.items}));
        actions.push(fromActions.userRedirection({flow}));

        return actions;
    }

    private _getMainFlowConstantValue(mainFlowName: string): string {
        switch (mainFlowName) {
            case constants.PERSONALISATION:
                return constants.PERSONALISATION_LINK;

            case constants.QUOTATION:
                return constants.QUOTATION_LINK;

            case constants.SUBSCRIPTION:
                return constants.SUBSCRIPTION_LINK;

            default:
                return constants.PERSONALISATION_LINK;
        }
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private _getSubFlowConstantValue(subFlowName: string): string {
        switch (subFlowName) {
            case constants.PROFILE_DETAILS:
                return constants.PROFILE_DETAILS_LINK;
            case constants.POLICY_DURATION:
                return constants.POLICY_DURATION_LINK;
            case constants.PROFILE_CUSTOMISATION:
                return constants.PROFILE_CUSTOMISATION_LINK;
            case constants.PROFILE_ADDRESS:
                return constants.PROFILE_ADDRESS_LINK;
            case constants.CUSTOMISATION:
                return constants.CUSTOMISATION_LINK;
            case constants.INSURED_DETAILS:
                return constants.INSURED_DETAILS_LINK;
            case constants.MUTUAL_HEALTH:
                return constants.MUTUAL_HEALTH_LINK;
            case constants.PAYMENT_METHOD_AND_FREQUENCY:
                return constants.PAYMENT_METHOD_LINK;
            case constants.TNC:
                return constants.TNC_LINK;
            case constants.SIGNATURE:
                return constants.SIGNATURE_LINK;
            case constants.CONFIRMATION:
                return constants.CONFIRMATION_LINK;
            case constants.PROFILE_DATA_DETAILS:
                return constants.PROFILE_DATA_DETAILS_LINK;
            case constants.COVERAGE_TYPE:
                return constants.COVERAGE_TYPE_LINK;
            case constants.COVERAGE_INFORMATION:
                return constants.COVERAGE_INFORMATION_LINK;
            case constants.COUNTRY_COVERAGE:
                return constants.COUNTRY_COVERAGE_LINK;
            case constants.OFFER_SUMMARY:
                return constants.OFFER_SUMMARY_LINK;
            case constants.CUSTOMISATION_COVERAGE_CARD:
                return constants.COVERAGE_CARD_LINK;
            case constants.PAYMENT:
                return constants.PAYMENT_LINK;
            default:
                return constants.PERSONALISATION_LINK;
        }
    }
}
