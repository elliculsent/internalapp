import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {State} from '@individual-modular/reducers';

import * as constants from '@uex/uex-constants';
import * as selectors from '@individual-modular/selectors';

import {AuthService} from '@uex/uex-services';

import {UexPopupService} from '@uex/uex-popup';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    private tokenPassword: string;
    private selectedLanguageCountry: string;

    constructor(
        private authService: AuthService,
        private aRoute: ActivatedRoute,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService
    ) {
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    ngOnInit(): void {
        this.tokenPassword = this.aRoute.snapshot.params.token_password;
        this.validateTokenPassword();
    }

    private validateTokenPassword(): any {
        this.authService.getTokenPasswordValidation(this.tokenPassword).subscribe(
            (token) => {
                // We open popup to change the password of the user
                this.uexPopup.resetPassword().subscribe((data: any) => {
                    data['token'] = token;
                    this.authService.postResetPassword(data).subscribe(
                        () => {
                            this.uexPopup.info(
                                'Changement Mot de passe',
                                'Votre mot de passe a été modifié avec succès'
                            );

                            // TODO redirection user, using router navigate
                            this.router.navigateByUrl(
                                `${this.selectedLanguageCountry}/${constants.PERSONALISATION_LINK}`
                            );
                        },
                        (error) => {
                            this.uexPopup.error(error.error_title, error.error_message).subscribe(() => {
                                this.validateTokenPassword();
                            });
                        }
                    );
                });
            },
            (error) => {
                this.uexPopup.error(error.error_title, error.error_message);
            }
        );
    }
}
