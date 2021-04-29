import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import * as fromActions from '@uex/uex-store/actions';

@Injectable()
export class LeftMenuEffects {
    constructor(private actions: Actions) {}

    setInitialLeftMenu: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.setInitialLeftMenu),
            map(({sub_flow}) => fromActions.setPersonalisationFields({sub_flow}))
        )
    );
}
