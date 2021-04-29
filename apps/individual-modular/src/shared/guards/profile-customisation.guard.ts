import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {PERSONALISATION_LINK, POLICY_DURATION, POLICY_DURATION_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class ProfileCustomisationGuard implements CanActivate {
    private isValid: boolean;
    private selectedLanguageCountry: string;

    constructor(private router: Router, private store: Store<State>) {
        this.store.pipe(select(selectors.isPersonalisationSubFlowValid, POLICY_DURATION)).subscribe((data) => {
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
            this.router.navigateByUrl(
                `${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${POLICY_DURATION_LINK}`
            );
        }
    }
}
