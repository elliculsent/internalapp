import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_CIVIC_RESPONSABILITY} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

@Component({
    selector: 'app-civic-responsability',
    templateUrl: './civic-responsability.component.html',
    styleUrls: ['./civic-responsability.component.scss'],
})
export class CivicResponsabilityComponent {
    public content: any;

    constructor(private aRoute: ActivatedRoute, private store: Store<State>) {
        this.content = this.aRoute.snapshot.data.content.fields;
        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION_CIVIC_RESPONSABILITY}));
    }
}
