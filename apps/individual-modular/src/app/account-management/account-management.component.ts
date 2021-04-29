import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as actions from '@uex/uex-store/actions';
import {UexDarkMenuService} from '@uex/uex-dark-menu';
import {UexState} from '@uex/uex-store/reducers';
import * as selectors from '@uex/uex-store/selectors';
import {SpinnerService} from '@uex/uex-services';
import {UtilsService} from '../../shared/services/utils.service';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html',
    styleUrls: ['./account-management.component.scss'],
})
export class AccountManagementComponent implements OnInit {
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
        private store: Store<UexState>,
        private uexDarkMenuService: UexDarkMenuService,
        private uexSpinnerService: SpinnerService,
        private utilsService: UtilsService
    ) {
        this.footerConfig = this.aRoute.snapshot.data.resolvedData.footer;
        this.darkMenuData = this.aRoute.snapshot.data.resolvedData.header.dark_menu;
        this.headerConfig = this.aRoute.snapshot.data.resolvedData.header;
        delete this.headerConfig.dark_menu;

        this.intermediaryName$ = this.store.pipe(select(selectors.getIntermediaryName));
        this.store.pipe(select(selectors.selectBreadcrumb)).subscribe((data) => {
            this.breadcrumbData = data.items;
        });
        this.store.pipe(select(selectors.selectLeftMenu)).subscribe((data) => {
            this.leftMenuData = data.personalisation.menu;
            this.poweredByData = data.powered_by;
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
