import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {
    CHILD_LINK,
    COUPLE,
    DEPENDANT,
    DEPENDANT_LINK,
    FAMILY,
    MYSELF,
    MYSELF_LINK,
    PERSONALISATION_LINK,
    POLICY_HOLDER_AND_CHILD,
    PROFILE_CUSTOMISATION_LINK,
} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class SubProfileCustomisationGuard implements CanActivateChild {
    private selectedLanguageCountry: string;
    private familyComposition: string;
    private isProfileMyselfValid: boolean;
    private isProfileSpouseValid: boolean;

    constructor(private router: Router, private store: Store<State>) {
        this.store.pipe(select(selectors.getFamilyComposition)).subscribe((data) => {
            this.familyComposition = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
        this.store.pipe(select(selectors.isPersonalisationSubFlowValid, MYSELF)).subscribe((data) => {
            this.isProfileMyselfValid = data;
        });
        this.store.pipe(select(selectors.isPersonalisationSubFlowValid, DEPENDANT)).subscribe((data) => {
            this.isProfileSpouseValid = data;
        });
    }

    checkUrl(path: string): boolean {
        if (path === DEPENDANT_LINK) {
            return this.handleSpouseLink();
        } else if (path === CHILD_LINK) {
            return this.handleChildLink();
        } else if (path === MYSELF_LINK) {
            return this.handleMyselfLink();
        } else {
            return true;
        }
    }

    handleMyselfLink(): boolean {
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!this.familyComposition) {
            return true;
        } else {
            this.router.navigateByUrl(
                `${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`
            );
        }
    }

    handleSpouseLink(): boolean {
        if (
            !!this.familyComposition &&
            (this.familyComposition === COUPLE || this.familyComposition === FAMILY) &&
            this.isProfileMyselfValid
        ) {
            return true;
        } else {
            this.router.navigateByUrl(
                `${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`
            );
        }
    }

    handleChildLink(): boolean {
        if (
            (!!this.familyComposition &&
                this.familyComposition === POLICY_HOLDER_AND_CHILD &&
                this.isProfileMyselfValid) ||
            (this.familyComposition === FAMILY && this.isProfileMyselfValid && this.isProfileSpouseValid)
        ) {
            return true;
        } else {
            this.router.navigateByUrl(
                `${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`
            );
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot): boolean {
        return this.checkUrl(route.routeConfig.path);
    }
}
