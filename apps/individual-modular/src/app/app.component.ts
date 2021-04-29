/* eslint-disable no-prototype-builtins */
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Intercom} from 'ng-intercom';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {DeviceDetectorService} from 'ngx-device-detector';
import {NgxSpinnerService} from 'ngx-spinner';
import {combineLatest} from 'rxjs';

import * as actions from '@individual-modular/actions';
import {environment} from '@individual-modular/environment/environment';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {UtilsService} from '@individual-modular/services/index';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {AuthService, GoogleTagManagerService, SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'uex-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
    private forgotPasswordConfig: any;
    private leadAcquisitionConfig: any;
    private loginConfig: any;
    private intermediaryCode: string;
    private offerId: string | number;
    private selectedCountry: string;
    private signupConfig: any;
    private userToken: string;
    public isLoggedIn: boolean;
    public isDataFetched: boolean;
    public isIE: boolean;
    public spinnerMessage: string;

    @ViewChild('leftsidenav') public leftsidenav: MatSidenav;
    @ViewChild('rightsidenav') public rightsidenav: MatSidenav;

    constructor(
        private aRoute: ActivatedRoute,
        private authService: AuthService,
        private deviceService: DeviceDetectorService,
        private gtmService: GoogleTagManagerService,
        private ccService: NgcCookieConsentService,
        private intercom: Intercom,
        private router: Router,
        private spinner: NgxSpinnerService,
        private store: Store<State>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService,
        private uexSpinnerService: SpinnerService,
        private utilsService: UtilsService
    ) {
        const deviceInfo = this.deviceService.getDeviceInfo();
        if (
            deviceInfo.browser === 'IE' ||
            deviceInfo.userAgent.indexOf('MSIE') > 0 ||
            deviceInfo.userAgent.indexOf('Trident') > 0
        ) {
            this.isIE = true;
            this.router.navigateByUrl('browser-not-supported');
        } else {
            this.authService.setBaseUrl = environment.baymax_backend_root_url;
            this.authService.setProductCode = environment.product.code;
            this.spinnerMessage = environment.defaults.spinnerMessage;

            combineLatest([
                this.store.select(selectors.getOfferId),
                this.store.select(selectors.isLoggedIn),
                this.store.select(selectors.getSelectedCountry),
                this.store.select(selectors.getIntermediaryCode),
                this.store.select(selectors.getUserToken),
                this.store.select(selectors.getIsDataFetched),
                this.store.select(selectors.getInitForgotPasswordConfig),
                this.store.select(selectors.getInitLeadAcquisitionConfig),
                this.store.select(selectors.getInitLogin),
                this.store.select(selectors.getInitSignup),
            ]).subscribe(
                (
                    [
                        offerId,
                        isLoggedIn,
                        selectedCountry,
                        intermediaryCode,
                        userToken,
                        isDataFetched,
                        forgotPasswordConfig,
                        leadAcquisitionConfig,
                        loginConfig,
                        signupConfig,
                    ]
                ) => {
                    this.offerId = offerId;
                    this.isLoggedIn = isLoggedIn;
                    this.selectedCountry = selectedCountry;
                    this.intermediaryCode = intermediaryCode;
                    this.userToken = userToken;
                    this.isDataFetched = isDataFetched;
                    this.forgotPasswordConfig = forgotPasswordConfig;
                    this.leadAcquisitionConfig = leadAcquisitionConfig;
                    this.loginConfig = loginConfig;
                    this.signupConfig = signupConfig;
                }
            );

            this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    if (document.getElementsByClassName('fixed-content').length) {
                        document.getElementsByClassName('fixed-content')[0].scrollTop = 0;
                    }
                    this.gtmService.addPageTag(
                        'qeInfo',
                        environment.product.code,
                        'b2c',
                        this.intermediaryCode,
                        this.offerId ? this.offerId.toString() : ''
                    );
                    this.gtmService.pushEventOnce('projectUpdate', 'projectId', this.offerId);
                }
            });

            this.store.dispatch(actions.initProductObject());
            this.initSpinner();
        }
    }

    ngOnInit(): void {
        this.uexSpinnerService.emitSpinner.emit({
            showSpinner: true,
            spinnerMessage: this.spinnerMessage,
        });


        if(environment.cookie.cookie_lib === 'cookieconsent'){
            this.utilsService.getCookiePolicyData(environment.product.code).then((data) => {
                console.log(data)
                this.ccService.getConfig().cookie = data.cookie;
                this.ccService.getConfig().cookie.domain = window.location.hostname;
                this.ccService.getConfig().position = data.position;
                this.ccService.getConfig().theme = data.theme;
                this.ccService.getConfig().palette = data.palette;
                this.ccService.getConfig().type = data.type;
                this.ccService.getConfig().content = data.content;

                if (data.layout) {
                    this.ccService.getConfig().layout = data.layout;
                }

                if (data.layouts) {
                    this.ccService.getConfig().layouts = data.layouts;
                }

                if (data.elements) {
                    this.ccService.getConfig().elements = data.elements;
                }

                this.ccService.destroy();
                this.ccService.init(this.ccService.getConfig());
            });
        }


        this.aRoute.fragment.subscribe((fragment: string) => {
            if (fragment === 'openLogin' && !this.isLoggedIn) {
                this.login();
            }
        });
    }

    ngAfterViewInit(): void {
        if (environment.showInterCom) {
            this.intercom.boot({
                app_id: environment.intercom.appId,
                // Supports all optional configuration.
                widget: {
                    activator: '#intercom',
                },
            });
        }
        this.uexSidenavService.setSidenav(this.rightsidenav);
        this.uexDarkMenuService.setDarkSidenav(this.leftsidenav);

        if (environment.google_tag_manager && environment.google_tag_manager.id) {
            this.gtmService.createGTMScript(environment.google_tag_manager.id);
        }
    }

    initSpinner(): void {
        this.uexSpinnerService.emitSpinner.subscribe((data: any) => {
            this.spinnerMessage = data.spinnerMessage;
            if (data.showSpinner) {
                this.spinner.show();
            } else {
                this.spinner.hide();
            }
        });
    }

    openLeadAcquisition(open: boolean): void {
        if (open) {
            this.uexPopup.leadAcquisition(this.leadAcquisitionConfig, this.selectedCountry).subscribe((data: any) => {
                if (data) {
                    if (data === 'skip') {
                        // do something if Skip is clicked
                        console.log('skip');
                    } else {
                        // do something with data
                        this.store.dispatch(
                            actions.postLeadAcquisition({
                                lead_acquisition: data,
                                intermediaryCode: this.intermediaryCode,
                            })
                        );
                    }
                }
            });
        }
    }

    login(): void {
        this.uexPopup.login(this.loginConfig).subscribe((data) => {
            if (data === 'signup') {
                this.signup();
            } else if (data && data.hasOwnProperty('dialog') && data.dialog === 'forgotpassword') {
                this.forgotPassword(data.email);
            } else {
                if (data) {
                    this.uexSpinnerService.emitSpinner.emit({
                        showSpinner: true,
                        spinnerMessage: 'Authentification...',
                    });

                    data['product_code'] = environment.product.code;
                    this.store.dispatch(actions.postLogin({login_data: data}));
                }
            }
        });
    }

    signup(): void {
        this.uexPopup.signUp(this.signupConfig).subscribe((data: any) => {
            if (data === 'login') {
                this.login();
            } else {
                if (data) {
                    this.uexSpinnerService.emitSpinner.emit({
                        showSpinner: true,
                        spinnerMessage: 'Création du compte.',
                    });

                    // CALL BACKEND AND PASS data object AS PARAMETERS
                    this.authService.postSignup(data, this.offerId).subscribe(
                        (response) => {
                            this.uexPopup.alert(response.success_title, response.success_message);
                        },
                        (error) => {
                            this.uexPopup.error(error.error_title, error.error_message).subscribe(() => {
                                this.signup();
                            });
                        },
                        () => {
                            this.uexSpinnerService.emitSpinner.emit({
                                showSpinner: false,
                                spinnerMessage: null,
                            });
                        }
                    );
                }
            }
        });
    }

    forgotPassword(email: string): void {
        this.uexPopup.forgotPassword(this.forgotPasswordConfig, email).subscribe((data: any) => {
            if (data) {
                this.uexSpinnerService.emitSpinner.emit({
                    showSpinner: true,
                    spinnerMessage: `Envoie de l'email...`,
                });

                // CALL BACKEND AND PASS data object AS PARAMETERS
                this.authService.postForgotPassword(data).subscribe(
                    (response) => {
                        this.uexPopup.alert(response.success_title, response.success_message);
                    },
                    (error) => {
                        this.uexPopup.error(error.error_title, error.error_message).subscribe(() => {
                            this.forgotPassword(email);
                        });
                    },
                    () => {
                        this.uexSpinnerService.emitSpinner.emit({
                            showSpinner: false,
                            spinnerMessage: null,
                        });
                    }
                );
            }
        });
    }

    logout(): void {
        this.uexSpinnerService.emitSpinner.emit({
            showSpinner: true,
            spinnerMessage: null,
        });
        if (this.userToken) {
            this.store.dispatch(actions.postLogout({user_token: this.userToken}));
        }
    }
}
