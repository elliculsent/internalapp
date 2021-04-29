import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {PAYMENT_STATUS} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class PaymentStatusGuard implements CanActivate {
    private policyStatus: string;
    private selectedLanguageCountry: string;
    constructor(private router: Router, private store: Store<State>) {
        this.store.pipe(select(selectors.getPolicyStatusCode)).subscribe((data) => {
            this.policyStatus = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    canActivate(): boolean {
        if (this.policyStatus in PAYMENT_STATUS) {
            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${PAYMENT_STATUS[this.policyStatus].url}`);
        } else {
            return true;
        }
    }
}
