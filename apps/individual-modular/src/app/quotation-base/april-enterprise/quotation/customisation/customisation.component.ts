import {AfterContentInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {heartBeatAnimation} from 'angular-animations';
import {combineLatest, timer} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {UexSnackbarComponent} from '@uex/uex-snackbar';
import {CUSTOMISATION, PERSONALISATION_LINK, PROFILE_CUSTOMISATION_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {PriceService} from '@individual-modular/services/price.service';
import {SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'app-customisation',
    templateUrl: './customisation.component.html',
    styleUrls: ['./customisation.component.scss'],
    // tslint:disable-next-line:use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    animations: [heartBeatAnimation()],
})
export class CustomisationComponent implements AfterContentInit, OnInit {
    public coverageDetails: any;
    public effectState = false;
    public helpTips: any;
    public offersConfig: any;
    public priceConfig: any;
    public quoteSummary: any;
    public selectedLanguage: string;
    public offers: any;
    public offersValue: {[key: string]: number}[];
    public customisationRestriction: any;
    public isPriceValid = true;
    public summary: any;

    private policy: any;
    private selectedCountryLanguage: string;

    constructor(
        private aRoute: ActivatedRoute,
        private priceService: PriceService,
        private router: Router,
        private snackBar: MatSnackBar,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService,
        private uexSpinnerService: SpinnerService
    ) {
        this.offersConfig = this.aRoute.snapshot.data.priceCusto.customisation_offer_scoring;
        this.priceConfig = this.aRoute.snapshot.data.priceCusto.price_display;
        this.coverageDetails = this.aRoute.snapshot.data.priceCusto.coverage_details;
        this.customisationRestriction = this.aRoute.snapshot.data.priceCusto.customisation_restriction;
        this.summary = this.aRoute.snapshot.data.summary;

        this.store.dispatch(actions.setPriceDisplay({price_display: this.priceConfig}));
        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION}));

        combineLatest([
            this.store.select(selectors.getSelectedLanguage),
            this.store.select(selectors.getPolicy),
            this.store.select(selectors.isPriceValid),
            this.store.pipe(selectors.selectQuotationFields(CUSTOMISATION)),
            this.store.select(selectors.getSelectedCountryLanguage),
        ]).subscribe(([selectedLanguage, policy, isPriceValid, fields, selectedCountryLanguage]) => {
            this.selectedLanguage = selectedLanguage;
            this.policy = policy;
            this.isPriceValid = isPriceValid;
            this.helpTips = fields.help_tips;
            this.offers = fields.offer_customisation;
            this.quoteSummary = fields.profile_summary;
            this.selectedCountryLanguage = selectedCountryLanguage;
        });
        this.store.pipe(take(1), select(selectors.getFirstInsuredCoverage)).subscribe((data) => {
            this.offersValue = data;
        });
    }

    ngAfterContentInit(): void {
        setTimeout(() => {
            this.effectState = true;
        }, 1);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.uexSpinnerService.emitSpinner.emit({
                showSpinner: false,
                spinnerMessage: null,
            });
        });
    }

    quoteEngineFormChange(payload: any): void {
        const formValue = payload.formValue;

        this.store.dispatch(actions.setCustomisationCoverage({coverages: formValue.offers}));
        timer(400)
            .pipe(
                switchMap(() => {
                    return this.priceService
                        .postPriceCustomisation(this.policy)
                        .pipe(
                            map((data) => data),
                            catchError((error) => this.uexPopup.error(error.error_title, error.error_message))
                        );
                }),
                map((response) => {
                    if (response) {
                        this.priceConfig = response.price_display;
                        this.coverageDetails = response.coverage_details;
                        this.offersConfig = response.customisation_offer_scoring;
                        this.customisationRestriction = response.customisation_restriction;
                        this.openSnackBar(this.customisationRestriction);
                        this.store.dispatch(actions.setPriceDisplay({price_display: this.priceConfig}));
                        setTimeout(() => {
                            this.effectState = !this.effectState;
                        });
                    }
                })
            )
            .subscribe();
    }

    openSideNav(helpTip: any): void {
        this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
        this.uexSidenavService.open();
    }

    openSnackBar(msg: any): void {
        if (msg && msg.coverage) {
            let message = '<ul>';
            msg.coverage.forEach((val) => {
                message += `<li>${val.message}</li>`;
            });
            message += '</ul>';
            this.snackBar.openFromComponent(UexSnackbarComponent, {
                data: {
                    html: message,
                },
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        }
    }

    modify(edit: boolean): void {
        if (edit) {
            this.router.navigateByUrl(
                `${this.selectedCountryLanguage}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`
            );
        }
    }
}
