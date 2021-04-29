import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as actions from '@individual-modular/actions';
import {CONFIRMATION, SUBSCRIPTION} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
    public subFlowFields$: Observable<any>;

    constructor(private store: Store<State>) {
        this.store.dispatch(actions.setMainflowIsValid({main_flow: SUBSCRIPTION, is_valid: true}));
        this.subFlowFields$ = this.store.pipe(selectors.selectSubscriptionFields(CONFIRMATION));
    }
}
