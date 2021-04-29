import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {UexSidenavService} from '@uex/uex-sidenav';
import {SUBSCRIPTION} from '@uex/uex-constants';
import {PriceDisplay} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {SpinnerService} from '@uex/uex-services';
import {combineLatest} from 'rxjs';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
    public breadcrumbData: Array<any> = [];
    public darkMenuData: any = null;
    public footerConfig: any = null;
    public headerConfig: any = null;
    public intermediaryCode: string;
    public intermediaryName: string;
    public invalidCode = false;
    public leftMenuData: Array<any> = [];
    public poweredByData: any;
    public priceDisplay: PriceDisplay;

    constructor(
        private aRoute: ActivatedRoute,
        private store: Store<State>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexSidenavService: UexSidenavService,
        private uexSpinnerService: SpinnerService
    ) {
        this.store.dispatch(actions.setBreadcrumbActive({main_flow: SUBSCRIPTION}));
        this.store.dispatch(actions.setMainflowIsActive({main_flow: SUBSCRIPTION, is_active: true}));
        this.darkMenuData = this.aRoute.snapshot.data.resolvedData.header.dark_menu;
        this.footerConfig = this.aRoute.snapshot.data.resolvedData.footer;
        this.headerConfig = this.aRoute.snapshot.data.resolvedData.header;
        delete this.headerConfig.dark_menu;
        combineLatest([
            this.store.select(selectors.getIntermediaryCode),
            this.store.select(selectors.getIntermediaryName),
            this.store.select(selectors.selectBreadcrumb),
            this.store.select(selectors.getPriceDisplay),
            this.store.select(selectors.selectLeftMenu),
        ]).subscribe(([intermediaryCode, intermediaryName, breadcrumbData, priceDisplay, leftMenuData]) => {
            this.intermediaryCode = intermediaryCode;
            this.intermediaryName = intermediaryName;
            this.breadcrumbData = breadcrumbData.items;
            this.priceDisplay = priceDisplay;
            this.leftMenuData = leftMenuData.subscription.menu;
            this.poweredByData = leftMenuData.powered_by;
        });
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

    openSideNav(helpTip: any): void {
        this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
        this.uexSidenavService.open();
    }
}
