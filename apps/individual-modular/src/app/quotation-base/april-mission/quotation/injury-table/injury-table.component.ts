import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_INJURY_TABLE} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

@Component({
    selector: 'app-injury-table',
    templateUrl: './injury-table.component.html',
    styleUrls: ['./injury-table.component.scss'],
})
export class InjuryTableComponent {
    public content: any;

    constructor(private aRoute: ActivatedRoute, private store: Store<State>) {
        this.content = this.aRoute.snapshot.data.content.fields;
        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION_INJURY_TABLE}));
    }
}
