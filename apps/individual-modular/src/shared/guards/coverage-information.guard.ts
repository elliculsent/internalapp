import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {COVERAGE_TYPE, COVERAGE_TYPE_LINK, PERSONALISATION_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class CoverageInformationGuard implements CanActivate {
    private isValid: boolean;
    private selectedLanguageCountry: string;

    constructor(private router: Router, private store: Store<State>) {
        this.store.pipe(select(selectors.isPersonalisationSubFlowValid, COVERAGE_TYPE)).subscribe((data) => {
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
            this.router.navigateByUrl(`${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${COVERAGE_TYPE_LINK}`);
        }
    }
}
