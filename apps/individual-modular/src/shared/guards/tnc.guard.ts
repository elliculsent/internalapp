import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {PAYMENT_METHOD_AND_FREQUENCY, PAYMENT_METHOD_LINK, SUBSCRIPTION_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class TncGuard implements CanActivate {
    private isValid: boolean;
    private selectedLanguageCountry: string;

    constructor(private router: Router, private store: Store<State>) {
        this.store
            .pipe(select(selectors.isSubscriptionSubFlowValid, PAYMENT_METHOD_AND_FREQUENCY))
            .subscribe((data) => {
                this.isValid = data;
            });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    canActivate(): boolean {
        if (this.isValid) {
            return true;
        } else {
            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${PAYMENT_METHOD_LINK}`);
        }
    }
}
