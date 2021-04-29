import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_COVERAGE_CARD} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

@Component({
    selector: 'app-coverage-card',
    templateUrl: './coverage-card.component.html',
    styleUrls: ['./coverage-card.component.scss'],
})
export class CoverageCardComponent {
    public content: any;

    constructor(private aRoute: ActivatedRoute, private store: Store<State>) {
        this.content = this.aRoute.snapshot.data.content.fields;

        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION_COVERAGE_CARD}));
    }
}
