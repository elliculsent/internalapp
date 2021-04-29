import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {State} from '@individual-modular/reducers';

import * as constants from '@uex/uex-constants';
import * as selectors from '@individual-modular/selectors';

import {AuthService, SpinnerService} from '@uex/uex-services';

import {UexPopupService} from '@uex/uex-popup';

@Component({
    selector: 'app-account-validation',
    templateUrl: './account-validation.component.html',
    styleUrls: ['./account-validation.component.scss'],
})
export class AccountValidationComponent implements OnInit {
    private tokenAccount: string;
    private userUuid: string;
    private offerId: string | number;
    private selectedLanguageCountry: string;

    constructor(
        private authService: AuthService,
        private aRoute: ActivatedRoute,
        private router: Router,
        private store: Store<State>,
        private uexSpinnerService: SpinnerService,
        private uexPopup: UexPopupService
    ) {
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    ngOnInit(): void {
        this.tokenAccount = this.aRoute.snapshot.params.token_account;
        this.userUuid = this.aRoute.snapshot.params.user_uuid;

        if (this.aRoute.snapshot.queryParamMap.get('link_offer_id')) {
            this.offerId = this.aRoute.snapshot.queryParamMap.get('link_offer_id');
        }
        this.validateTokenAccount();
    }

    private validateTokenAccount(): any {
        this.authService.getTokenAccountVerification(this.userUuid, this.tokenAccount, this.offerId).subscribe(
            (response) => {
                // We open popup to change the password of the user
                this.uexPopup.alert(response.success_title, response.success_message).subscribe(() => {
                    // Show spinner
                    this.uexSpinnerService.emitSpinner.emit({
                        showSpinner: true,
                        spinnerMessage: 'Loading...',
                    });

                    this.router.navigateByUrl(
                        `${this.selectedLanguageCountry}/${constants.PERSONALISATION_LINK}#openLogin`
                    );
                });

                // Call backend to attach the offer to the policy
            },
            (error) => {
                this.uexPopup.error(null, error).subscribe(() => {
                    this.router.navigateByUrl(`${this.selectedLanguageCountry}/${constants.PERSONALISATION_LINK}`);
                });
            }
        );
    }
}
