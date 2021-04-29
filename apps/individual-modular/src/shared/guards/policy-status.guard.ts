import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {from, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {
    APRIL_ENTERPRISE,
    APRIL_MISSION,
    CONFIRMATION,
    CONFIRMATION_LINK,
    CONFIRM_STATUS,
    PAYMENT,
    PAYMENT_LINK,
    PAYMENT_STATUS,
    SIGNATURE,
    SUBSCRIPTION_LINK,
    TNC_LINK,
} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {PolicyService} from '@uex/uex-services';

@Injectable()
export class PolicyStatusGuard implements CanActivate {
    private offerId: string | number;
    private selectedLanguageCountry: string;
    private policyStatus: string;
    constructor(private policyService: PolicyService, private router: Router, private store: Store<State>) {
        this.policyService.setBaseUrl = environment.baymax_backend_root_url;

        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
        this.store.pipe(select(selectors.getPolicyStatusCode)).subscribe((data) => {
            this.policyStatus = data;
        });
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.checkUrl(route.routeConfig.path);
    }

    checkUrl(path: string): Observable<boolean> {
        if (path === PAYMENT_LINK) {
            return this.handPaymentLink();
        } else if (path === CONFIRMATION_LINK) {
            return this.handleConfirmation();
        } else {
            return this.handleOtherLinks();
        }
    }

    handPaymentLink(): Observable<boolean> {
        if (this.policyStatus in PAYMENT_STATUS) {
            return of(true);
        } else {
            return this.getPolicyStatusCode().pipe(
                map((response: any) => {
                    const policyStatus = response.policy_status_code;
                    if (policyStatus && policyStatus in PAYMENT_STATUS) {
                        this.store.dispatch(actions.updatePolicyStatus({policy_status_code: policyStatus}));

                        this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: SIGNATURE}));
                        this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: PAYMENT}));
                        this.store.dispatch(actions.setSubscriptionValidSubflow({sub_flow: SIGNATURE}));
                        return true;
                    } else if (policyStatus && policyStatus in CONFIRM_STATUS) {
                        this.router.navigateByUrl(
                            `${this.selectedLanguageCountry}/${CONFIRM_STATUS[policyStatus].url}`
                        );
                    } else {
                        this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${TNC_LINK}`);
                    }
                }),
                catchError(() => {
                    return of(false);
                })
            );
        }
    }

    handleConfirmation(): Observable<boolean> {
        if (this.policyStatus in CONFIRM_STATUS) {
            return of(true);
        } else {
            return this.getPolicyStatusCode().pipe(
                map((response: any) => {
                    const policyStatus = response.policy_status_code;
                    if (policyStatus && policyStatus in CONFIRM_STATUS) {
                        this.store.dispatch(actions.updatePolicyStatus({policy_status_code: policyStatus}));

                        this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: SIGNATURE}));
                        this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: PAYMENT}));
                        this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: CONFIRMATION}));
                        this.store.dispatch(actions.setSubscriptionValidSubflow({sub_flow: SIGNATURE}));
                        this.store.dispatch(actions.setSubscriptionValidSubflow({sub_flow: PAYMENT}));
                        this.store.dispatch(actions.setSubscriptionValidSubflow({sub_flow: CONFIRMATION}));
                        return true;
                    } else {
                        if (environment.product.code === APRIL_ENTERPRISE) {
                            this.router.navigateByUrl(
                                `${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${TNC_LINK}`
                            );
                        } else if (environment.product.code === APRIL_MISSION) {
                            this.router.navigateByUrl(
                                `${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${PAYMENT_LINK}`
                            );
                        }
                    }
                }),
                catchError(() => {
                    return of(false);
                })
            );
        }
    }

    handleOtherLinks(): Observable<boolean> {
        if (this.policyStatus in CONFIRM_STATUS) {
            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${CONFIRM_STATUS[this.policyStatus].url}`);
        } else if (this.policyStatus in PAYMENT_STATUS) {
            if (environment.product.code === APRIL_ENTERPRISE) {
                this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${CONFIRMATION_LINK}`);
            } else if (environment.product.code === APRIL_MISSION) {
                this.router.navigateByUrl(`${this.selectedLanguageCountry}/${PAYMENT_STATUS[this.policyStatus].url}`);
            }
        } else {
            return of(true);
        }
    }

    getPolicyStatusCode(): Observable<any> {
        if (!this.offerId) {
            return of(false);
        }
        return from(this.policyService.getPolicyStatusCode(this.offerId));
    }
}
