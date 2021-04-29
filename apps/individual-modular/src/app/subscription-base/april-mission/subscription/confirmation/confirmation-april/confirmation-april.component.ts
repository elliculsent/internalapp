import {Component} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as actions from '@individual-modular/actions';
import {CONFIRMATION} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'app-confirmation-april',
    templateUrl: './confirmation-april.component.html',
    styleUrls: ['./confirmation-april.component.scss'],
})
export class ConfirmationAprilComponent {
    public subFlow$: Observable<any>;
    public subFlow: any;

    constructor(private store: Store<State>, private uexSpinnerService: SpinnerService) {
        this.store
            .pipe(select(selectors.selectSubscriptionSubFlow, CONFIRMATION))
            .subscribe((data) => {
                this.subFlow = data.fields;
            })
            .unsubscribe();
    }

    newSubscription(): void {
        this.uexSpinnerService.emitSpinner.emit({
            showSpinner: true,
            spinnerMessage: 'Loading...',
        });
        this.store.dispatch(actions.userNewSubscription());
    }
}
