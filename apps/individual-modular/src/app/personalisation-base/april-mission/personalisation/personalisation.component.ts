import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';

import * as actions from '@individual-modular/actions';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {MainFlow, PoweredBy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {UtilsService} from '@individual-modular/services/utils.service';
import {SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'app-personalisation',
    templateUrl: './personalisation.component.html',
    styleUrls: ['./personalisation.component.scss'],
})
export class PersonalisationComponent implements OnInit {
    public breadcrumbData: Array<any> = [];
    public darkMenuData: any = null;
    public footerConfig: any = null;
    public headerConfig: any = null;
    public intermediaryName$: Observable<string> = of('');
    public intermediaryCode$: Observable<string> = of('');
    public intermediaryToken: string;
    public invalidCode = false;
    public leftMenuData$: Observable<MainFlow>;
    public poweredByData$: Observable<PoweredBy>;
    public readonlyCode$: Observable<boolean>;

    constructor(
        private aRoute: ActivatedRoute,
        private store: Store<State>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexSpinnerService: SpinnerService,
        private utilsService: UtilsService,
        private sanitizer: DomSanitizer
    ) {
        this.footerConfig = this.aRoute.snapshot.data.resolvedData.footer;
        this.darkMenuData = this.aRoute.snapshot.data.resolvedData.header.dark_menu;
        this.headerConfig = this.aRoute.snapshot.data.resolvedData.header;
        delete this.headerConfig.dark_menu;

        this.intermediaryName$ = this.store.pipe(select(selectors.getIntermediaryName));
        this.intermediaryCode$ = this.store.pipe(select(selectors.getIntermediaryCode));
        this.readonlyCode$ = this.store.pipe(select(selectors.isIntermediaryReadonly));

        this.store.pipe(select(selectors.selectBreadcrumb)).subscribe((data) => {
            if (data) {
                this.breadcrumbData = data.items;
            }
        });

        this.leftMenuData$ = this.store.pipe(select(selectors.selectPersonalisation));
        this.poweredByData$ = this.store.pipe(select(selectors.selectPoweredBy));

        this.aRoute.queryParams
            .subscribe((params) => {
                if (params && params['intermediary_reference']) {
                    this.intermediaryCode$ = params['intermediary_reference'];
                    this.intermediaryToken = params['partner_token'];
                    this.validateCodeDistributor(params['intermediary_reference'], this.intermediaryToken);
                }
            })
            .unsubscribe();
    }

    ngOnInit(): void {
        this.uexDarkMenuService.setDarkMenuData(this.darkMenuData);
        if (!this.intermediaryToken) {
            setTimeout(() => {
                this.uexSpinnerService.emitSpinner.emit({
                    showSpinner: false,
                    spinnerMessage: null,
                });
            });
        }
    }

    eShowDarkMenu(): void {
        this.openDarkMenu();
    }

    openDarkMenu(): void {
        this.uexDarkMenuService.open();
    }

    validateCodeDistributor(code: string, token: string): void {
        if (code) {
            this.utilsService
                .validateIntermediaryCode(code, token)
                .then((data) => {
                    this.invalidCode = false;
                    this.store.dispatch(actions.setIntermediaryHasUser({intermediary_has_user: data}));

                    if (token) {
                        this.store.dispatch(
                            actions.setIntermediaryToken({
                                intermediary_token: token,
                            })
                        );

                        setTimeout(() => {
                            this.uexSpinnerService.emitSpinner.emit({
                                showSpinner: false,
                                spinnerMessage: null,
                            });
                        });
                    }
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

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
