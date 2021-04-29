import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_DEATH_AND_INVALIDITY} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';

@Component({
    selector: 'app-death-invalidity',
    templateUrl: './death-invalidity.component.html',
    styleUrls: ['./death-invalidity.component.scss'],
})
export class DeathInvalidityComponent {
    public content: any;

    constructor(private aRoute: ActivatedRoute, private store: Store<State>) {
        this.content = this.aRoute.snapshot.data.content.fields;
        this.store.dispatch(actions.setQuotationActiveSubflow({sub_flow: CUSTOMISATION_DEATH_AND_INVALIDITY}));
    }
}
