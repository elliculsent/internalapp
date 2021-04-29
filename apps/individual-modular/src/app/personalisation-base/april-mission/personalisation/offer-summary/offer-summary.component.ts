import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {
    COUNTRY_COVERAGE_LINK,
    COVERAGE_CARD_LINK,
    OFFER_SUMMARY,
    PERSONALISATION,
    PERSONALISATION_LINK,
    QUOTATION_LINK,
} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService} from '@individual-modular/services/flow.service';

@Component({
    selector: 'app-offer-summary',
    templateUrl: './offer-summary.component.html',
    styleUrls: ['./offer-summary.component.scss'],
})
export class OfferSummaryComponent {
    public entityPolicy: EntityPolicy = null;
    public subFlow: any = null;
    private offerId: string | number;
    private selectedLanguageCountry: string;

    constructor(
        private flowService: FlowService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService
    ) {
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: OFFER_SUMMARY}));
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.pipe(select(selectors.selectPersonalisationSubFlow, OFFER_SUMMARY)).subscribe((data) => {
            this.subFlow = data.fields;
        });

        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    openHelptip(): void {
        this.uexSidenavService.setSidenavData('test', 'testtest');
        this.uexSidenavService.open();
    }

    back(): void {
        this.router.navigateByUrl(`${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${COUNTRY_COVERAGE_LINK}`);
    }

    continue(): void {
        this.flowService
            .postFlow(this.entityPolicy, OFFER_SUMMARY, this.offerId)
            .then(() => {
                this.store.dispatch(actions.setMainflowIsValid({main_flow: PERSONALISATION, is_valid: true}));
                this.store.dispatch(actions.setPersonalisationValidSubflow({sub_flow: OFFER_SUMMARY}));
                this.router.navigateByUrl(`${this.selectedLanguageCountry}/${QUOTATION_LINK}/${COVERAGE_CARD_LINK}`);
            })
            .catch((error) => {
                this.uexPopup.error(error.error_title, error.error_message);
            });
    }
}
