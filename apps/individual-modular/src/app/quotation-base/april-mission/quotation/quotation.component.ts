import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';

import {ClipboardService} from 'ngx-clipboard';

import * as actions from '@individual-modular/actions';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {UexPopupService} from '@uex/uex-popup';
import * as constants from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService, UtilsService} from '@individual-modular/services/index';
import {AcquisitionService, AuthService, SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'app-quotation',
    templateUrl: './quotation.component.html',
    styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {
    public breadcrumbData: Array<any> = [];
    public darkMenuData: any = null;
    public footerConfig: any = null;
    public headerConfig: any = null;
    public isLogged = false;
    public isLoggedIn = false;
    public intermediaryCode: string;
    public intermediaryName: string;
    public invalidCode = false;
    public leftMenuData: Array<any> = [];
    public poweredByData: any;
    public price: any;
    public showSave = false;
    private data: any;
    private forgotPasswordConfig: any;
    private loginConfig: any = null;
    private selectedLanguageCountry: string;
    private signupConfig: any;
    private offerId: string | number;

    private sharedLeftMenu: any;
    private sharedBreadcrump: any;
    private activeSubflowName: string;
    private entityPolicy: EntityPolicy = null;
    public readonlyCode$: Observable<boolean>;

    constructor(
        private acqService: AcquisitionService,
        private aRoute: ActivatedRoute,
        private authService: AuthService,
        private clipboardService: ClipboardService,
        private flowService: FlowService,
        private router: Router,
        private store: Store<State>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexPopup: UexPopupService,
        private uexSpinnerService: SpinnerService,
        private utilsService: UtilsService
    ) {
        this.acqService.setBaseUrl = environment.baymax_backend_root_url;

        this.store.dispatch(actions.setBreadcrumbActive({main_flow: constants.QUOTATION}));
        this.readonlyCode$ = this.store.pipe(select(selectors.isIntermediaryReadonly));

        combineLatest([
            this.store.select(selectors.getOfferId),
            this.store.select(selectors.getSelectedCountryLanguage),
            this.store.select(selectors.isLoggedIn),
            this.store.select(selectors.getIntermediaryName),
            this.store.select(selectors.getIntermediaryCode),
            this.store.select(selectors.selectLeftMenu),
            this.store.select(selectors.selectBreadcrumb),
            this.store.select(selectors.getInitForgotPasswordConfig),
            this.store.select(selectors.selectEntityPolicy),
            this.store.select(selectors.getInitLogin),
            this.store.select(selectors.getInitSignup),
            this.store.select(selectors.getActiveSubFlow, {mainflow: constants.QUOTATION_LINK}),
            this.store.select(selectors.hasIntermediaryToken),
        ]).subscribe(
            (
                [
                    offerId,
                    selectedLanguageCountry,
                    isLoggedIn,
                    intermediaryName,
                    intermediaryCode,
                    sharedLeftMenu,
                    breadcrumbData,
                    forgotPasswordConfig,
                    entityPolicy,
                    loginConfig,
                    signupConfig,
                    activeSubflowName,
                    hasIntermediaryToken,
                ]
            ) => {
                this.offerId = offerId;
                this.selectedLanguageCountry = selectedLanguageCountry;
                this.isLogged = JSON.parse(JSON.stringify(isLoggedIn));
                this.isLoggedIn = isLoggedIn;
                this.intermediaryName = intermediaryName;
                this.intermediaryCode = intermediaryCode;
                this.sharedLeftMenu = sharedLeftMenu;
                this.leftMenuData = sharedLeftMenu.quotation.menu;
                this.poweredByData = sharedLeftMenu.powered_by;
                this.breadcrumbData = breadcrumbData.items;
                this.sharedBreadcrump = breadcrumbData;
                this.forgotPasswordConfig = forgotPasswordConfig;
                this.entityPolicy = entityPolicy;
                this.loginConfig = loginConfig;
                this.signupConfig = signupConfig;
                this.activeSubflowName = activeSubflowName;
                this.showSave = hasIntermediaryToken;
            }
        );

        if (!this.isLogged) {
            this.store.select(selectors.isLoggedIn).subscribe((data) => {
                if (data) {
                    this.getNextFlow();
                }
            });
        }

        this.data = this.aRoute.snapshot.data;
        this.price = this.data.price;
        this.darkMenuData = this.data.resolvedData.header.dark_menu;
        this.headerConfig = this.data.resolvedData.header;
        this.footerConfig = this.data.resolvedData.footer;
        delete this.headerConfig.dark_menu;
    }

    ngOnInit(): void {
        this.uexDarkMenuService.setDarkMenuData(this.darkMenuData);
        setTimeout(() => {
            this.uexSpinnerService.emitSpinner.emit({
                showSpinner: false,
                spinnerMessage: null,
            });
        });
    }

    eShowDarkMenu(): void {
        this.openDarkMenu();
    }

    openDarkMenu(): void {
        this.uexDarkMenuService.open();
    }

    join(): void {
        if (!this.isLoggedIn) {
            this.login();
        } else {
            this.getNextFlow();
        }
    }

    login(): void {
        this.uexPopup.login(this.loginConfig).subscribe((data) => {
            if (data === 'signup') {
                this.signup();
            } else if (data && data.dialog === 'forgotpassword') {
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

    shareOffer(type: string): void {
        this.store
            .pipe(select(selectors.selectEntityPolicy))
            .subscribe((entityPolicy) => {
                if (entityPolicy) {
                    const data = {
                        offer: entityPolicy,
                        product_display: {
                            left_menu: this.sharedLeftMenu,
                            breadcrump: this.sharedBreadcrump,
                        },
                    };
                    const baseUrl = document.location.origin;
                    const redirectionUrl = this.router.url.substr(1);

                    if (type === 'save') {
                        // const offerId = entityPolicy['policy']['offer_id'];
                        this.acqService.postNewShareOffer('partner', baseUrl, redirectionUrl, data).subscribe(
                            (response) => {
                                this.uexPopup.alert(response['success_title'], response['success_message']);
                            },
                            (error) => {
                                this.uexPopup.error(error.error_title, error.error_message);
                            },
                            () => {
                                this.uexSpinnerService.emitSpinner.emit({
                                    showSpinner: false,
                                    spinnerMessage: null,
                                });
                            }
                        );
                    } else if (type === 'copy') {
                        this.acqService.postNewShareOffer(type, baseUrl, redirectionUrl, data).subscribe(
                            (response) => {
                                this.clipboardService.copyFromContent(response['link']);
                                this.uexPopup.alert(response['success_title'], response['success_message']);
                            },
                            (error) => {
                                this.uexPopup.error(error.error_title, error.error_message);
                            },
                            () => {
                                this.uexSpinnerService.emitSpinner.emit({
                                    showSpinner: false,
                                    spinnerMessage: null,
                                });
                            }
                        );
                    } else if (type === 'email') {
                        this.acqService.postNewShareOffer('email', baseUrl, redirectionUrl, data).subscribe(
                            (response) => {
                                const link = response['link'];
                                const bodyContent = `Bonjour,\n\nPour faire suite à votre demande de couverture, vous trouverez ci-dessous votre proposition de couverture : \n\n     ${link}.\n\nAvec MyBusiness Travel, bénéficiez d’une solution 100% digitale pour vos déplacements pros : \n\n-Un pack tout en 1 (santé, assistance, décès, prévention pays) pour répondre à votre devoir de protection\n-Une couverture spécifique en cas de crise et de pandémie \n-Un accès à l’outil Travel Smart pour aider vos collaborateurs à l’étranger, \n-Une assistance H24 dans le monde entier, y compris dans les pays «à risque»\n\nPour souscrire, c’est très simple! \n\n-Vous créez votre compte, \n-Vous signez et payez en ligne \n-Vous recevez votre contrat et votre guide \n-Vos collaborateurs sont immédiatement couverts.\n\nSi vous avez des questions, nous serions ravis de vous renseigner.\n\nA très vite,`;
                                const body = encodeURIComponent(bodyContent);
                                const subject = encodeURIComponent('Votre projet MyBusiness Travel');
                                const email = this.entityPolicy['contact']['contact_email'];
                                window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
                            },
                            (error) => {
                                this.uexPopup.error(error.error_title, error.error_message);
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
            })
            .unsubscribe();
    }

    validateCodeDistributor(code: string): void {
        if (code) {
            this.utilsService
                .validateIntermediaryCode(code, null)
                .then((data) => {
                    this.invalidCode = false;
                    this.store.dispatch(actions.setIntermediaryHasUser({intermediary_has_user: data}));
                })
                .catch(() => {
                    this.invalidCode = true;
                    this.store.dispatch(actions.setIntermediaryHasUser({intermediary_has_user: null}));
                });
        } else {
            this.invalidCode = false;
            this.store.dispatch(actions.setIntermediaryHasUser({intermediary_has_user: null}));
        }
    }

    getNextFlow(): void {
        if (this.entityPolicy && this.entityPolicy.policy.offer_id) {
            const offerId = this.entityPolicy.policy.offer_id;
            this.flowService
                .postFlow(this.entityPolicy, this.activeSubflowName, offerId)
                .then((response) => {
                    this.store.dispatch(
                        actions.setSubscriptionNextSubflow({
                            sub_flow: response.sub_flow.sub_flow_name,
                        })
                    );
                    this.store.dispatch(
                        actions.setSubscriptionFields({
                            sub_flow: response.sub_flow,
                        })
                    );
                    this.store
                        .pipe(
                            select(selectors.getSubflowLink, {
                                mainflow: constants.SUBSCRIPTION_LINK,
                                subflow: response.sub_flow.sub_flow_name,
                            })
                        )
                        .subscribe((link) => {
                            this.router.navigateByUrl(
                                `${this.selectedLanguageCountry}/${constants.SUBSCRIPTION_LINK}/${link}`
                            );
                        })
                        .unsubscribe();
                })
                .catch((error) => {
                    this.uexPopup.error(error.error_title, error.error_message);
                });
        }
    }
}
