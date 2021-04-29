import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {UtilsService} from '@individual-modular/services/utils.service';

@Injectable()
export class SummaryResolver implements Resolve<any> {
    private entityPolicy: any;

    constructor(private utilsService: UtilsService, private store: Store<State>) {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
    }

    resolve(): Observable<any> {
        return this.utilsService.getQuoteEngine(this.entityPolicy);
    }
}
