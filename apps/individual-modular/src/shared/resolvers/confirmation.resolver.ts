import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {select, Store} from '@ngrx/store';

import * as actions from '@individual-modular/actions';
import {PAYMENT, SIGNATURE} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FlowService} from '@individual-modular/services/flow.service';

@Injectable()
export class ConfirmationResolver implements Resolve<any> {
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
        return this.flowService.postFlow(this.entityPolicy, PAYMENT, this.offerId).then((data) => {
            this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: SIGNATURE}));
            this.store.dispatch(
                actions.setSubscriptionValidSubflow({
                    sub_flow: SIGNATURE,
                })
            );
            this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: PAYMENT}));
            this.store.dispatch(
                actions.setSubscriptionValidSubflow({
                    sub_flow: PAYMENT,
                })
            );
            this.store.dispatch(actions.setSubscriptionNextSubflow({sub_flow: data.sub_flow.sub_flow_name}));
            this.store.dispatch(actions.setSubscriptionActiveSubFlow({sub_flow: data.sub_flow.sub_flow_name}));
            this.store.dispatch(
                actions.setSubscriptionValidSubflow({
                    sub_flow: data.sub_flow.sub_flow_name,
                })
            );
            this.store.dispatch(actions.setSubscriptionFields({sub_flow: data.sub_flow}));
            this.store.dispatch(
                actions.setEntityPolicy({
                    entity_policy: data.entity_policy,
                })
            );
            return data;
        });
    }
}
