import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {PERSONALISATION_LINK, PROFILE_DETAILS_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

import * as actions from '@individual-modular/actions';
import * as selectors from '@individual-modular/selectors';

import {environment} from '@individual-modular/environment/environment';
import {AcquisitionService} from '@uex/uex-services';

import {UexPopupService} from '@uex/uex-popup';

@Injectable()
export class SharedOfferGuard implements CanActivate {
    private selectedLanguageCountry: string;

    constructor(
        private acquisitionService: AcquisitionService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService
    ) {
        this.acquisitionService.setBaseUrl = environment.baymax_backend_root_url;

        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    canActivate(aRoute: ActivatedRouteSnapshot): Promise<boolean> {
        const offerId = aRoute.queryParams['offer_id'];

        const readOnlyCode = aRoute.queryParams['read_only_code'];
        if (readOnlyCode) {
            this.store.dispatch(actions.setIntermediaryReadonly({intermediary_readonly: true}));
        }

        if (offerId) {
            return this.acquisitionService
                .getSharedOffer(offerId)
                .then((response) => {
                    if (response && response['offer'] && response['product_display']) {
                        const productDisplay = response['product_display'];
                        this.store.dispatch(actions.setEntityPolicy({entity_policy: response['offer']}));

                        this.store.dispatch(actions.setBreadcrumb({items: productDisplay.breadcrump.items}));

                        this.store.dispatch(actions.setLeftMenu({left_menu: productDisplay.left_menu}));
                        this.router.navigateByUrl(response['redirection_url']);
                        return false;
                    }
                })
                .catch((error) => {
                    this.uexPopup.error(error.title, error.error_message).subscribe(() => {
                        this.router.navigateByUrl(
                            `${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_DETAILS_LINK}`
                        );
                    });
                    return false;
                });
        } else {
            // By pass guard as no offer
            return new Promise((resolve) => {
                resolve(true);
            });
        }
    }
}
