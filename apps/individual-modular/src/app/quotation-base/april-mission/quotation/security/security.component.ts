import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_SECURITY_TABLE} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss'],
})
export class SecurityComponent {
    public content: any;

    constructor(private aRoute: ActivatedRoute, private store: Store<State>) {
        this.content = this.aRoute.snapshot.data.content.fields;
        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION_SECURITY_TABLE}));
    }
}
