import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {CUSTOMISATION, QUOTATION_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class AuthGuard implements CanActivate {
    private isLoggedIn: boolean;
    private selectedLanguageCountry: string;

    constructor(private router: Router, private store: Store<State>) {
        this.store.pipe(select(selectors.isLoggedIn)).subscribe((data) => {
            this.isLoggedIn = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    canActivate(): boolean {
        if (this.isLoggedIn) {
            return true;
        } else {
            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${QUOTATION_LINK}/${CUSTOMISATION}`);
        }
    }
}
