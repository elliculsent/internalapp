import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as actions from '@individual-modular/actions';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {SUBSCRIPTION} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {SpinnerService} from '@uex/uex-services';

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
    public intermediaryName$: Observable<string>;
    public invalidCode = false;
    public leftMenuData: Array<any> = [];
    public poweredByData: any;

    constructor(
        private aRoute: ActivatedRoute,
        private store: Store<State>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexSpinnerService: SpinnerService
    ) {
        this.store.dispatch(actions.setBreadcrumbActive({main_flow: SUBSCRIPTION}));
        this.darkMenuData = this.aRoute.snapshot.data.resolvedData.header.dark_menu;
        this.footerConfig = this.aRoute.snapshot.data.resolvedData.footer;
        this.headerConfig = this.aRoute.snapshot.data.resolvedData.header;
        delete this.headerConfig.dark_menu;

        this.intermediaryName$ = this.store.pipe(select(selectors.getIntermediaryName));
        this.store.pipe(select(selectors.selectSubscription)).subscribe((data) => {
            this.leftMenuData = data.menu;
        });
        this.store.pipe(select(selectors.selectPoweredBy)).subscribe((data) => {
            this.poweredByData = data;
        });
        this.store.pipe(select(selectors.selectBreadcrumb)).subscribe((data) => {
            this.breadcrumbData = data.items;
        });
        this.store
            .pipe(select(selectors.getIntermediaryCode))
            .subscribe((data) => {
                this.intermediaryCode = data;
            })
            .unsubscribe();
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
}
