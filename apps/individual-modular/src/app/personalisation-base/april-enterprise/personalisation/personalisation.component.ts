import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';

import * as actions from '@individual-modular/actions';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {MainFlow, PoweredBy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {SpinnerService} from '@uex/uex-services';
import {UtilsService} from '@individual-modular/services/utils.service';

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
    public readonlyCode$: Observable<boolean>;
    public invalidCode = false;

    public leftMenuData$: Observable<MainFlow>;
    public poweredByData$: Observable<PoweredBy>;

    constructor(
        private aRoute: ActivatedRoute,
        private store: Store<State>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexSpinnerService: SpinnerService,
        private utilsService: UtilsService
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
}
