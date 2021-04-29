import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {select, Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {CONFIRMATION} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService} from '@individual-modular/services/flow.service';

@Injectable()
export class ConfirmationEnterpriseResolver implements Resolve<any> {
    private entityPolicy: EntityPolicy;
    private offerId: string | number;

    constructor(private flowService: FlowService, private store: Store<State>) {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
    }

    resolve(): Promise<any> {
        return this.flowService.postFlow(this.entityPolicy, CONFIRMATION, this.offerId).then((data) => {
            this.store.dispatch(actions.setSubscriptionFields({sub_flow: data.sub_flow}));
            return data;
        });
    }
}
