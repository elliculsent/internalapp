import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';

import {
    APRIL_ENTERPRISE,
    APRIL_MISSION,
    INSURED_DETAILS,
    INSURED_DETAILS_LINK,
    PROFILE_DATA_DETAILS,
    PROFILE_DATA_DETAILS_LINK,
    MUTUAL_HEALTH,
    MUTUAL_HEALTH_LINK,
    SUBSCRIPTION_LINK,
} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class PaymentMethodGuard implements CanActivate {
    private isValidInsuredDetails: boolean;
    private isValidProfileDataDetails: boolean;
    private isValidMutualHealth: boolean;
    private isShownMutualHealth: boolean;
    private selectedLanguageCountry: string;

    constructor(private router: Router, private store: Store<State>) {
        combineLatest([
            this.store.select(selectors.isSubscriptionSubFlowValid, INSURED_DETAILS),
            this.store.select(selectors.isSubscriptionSubFlowValid, PROFILE_DATA_DETAILS),
            this.store.select(selectors.isSubscriptionSubFlowValid, MUTUAL_HEALTH),
            this.store.select(selectors.isSubscriptionSubFlowShown, MUTUAL_HEALTH),
            this.store.select(selectors.getSelectedCountryLanguage),
        ]).subscribe(
            (
                [
                    isValidInsuredDetails,
                    isValidProfileDataDetails,
                    isValidMutualHealth,
                    isShownMutualHealth,
                    selectedCountryLanguage,
                ]
            ) => {
                this.isValidInsuredDetails = isValidInsuredDetails;
                this.isValidProfileDataDetails = isValidProfileDataDetails;
                this.isValidMutualHealth = isValidMutualHealth;
                this.isShownMutualHealth = isShownMutualHealth;
                this.selectedLanguageCountry = selectedCountryLanguage;
            }
        );
    }

    canActivate(): boolean {
        switch (environment.product.code) {
            case APRIL_ENTERPRISE:
                if (!this.isShownMutualHealth) {
                    if (this.isValidInsuredDetails) {
                        return true;
                    } else {
                        this.router.navigateByUrl(
                            `${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${INSURED_DETAILS_LINK}`
                        );
                    }
                } else {
                    if (this.isValidInsuredDetails && this.isValidMutualHealth) {
                        return true;
                    } else {
                        this.router.navigateByUrl(
                            `${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${MUTUAL_HEALTH_LINK}`
                        );
                    }
                }
                break;
            case APRIL_MISSION:
                if (this.isValidProfileDataDetails) {
                    return true;
                } else {
                    this.router.navigateByUrl(
                        `${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${PROFILE_DATA_DETAILS_LINK}`
                    );
                }
                break;
        }
    }
}
