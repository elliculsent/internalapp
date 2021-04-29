import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_TRAVEL_SERVICES} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

@Component({
    selector: 'app-travel-services',
    templateUrl: './travel-services.component.html',
    styleUrls: ['./travel-services.component.scss'],
})
export class TravelServicesComponent {
    public content: any;

    constructor(private aRoute: ActivatedRoute, private store: Store<State>) {
        this.content = this.aRoute.snapshot.data.content.fields;
        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION_TRAVEL_SERVICES}));
    }
}
