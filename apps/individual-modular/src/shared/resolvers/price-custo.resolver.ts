import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {UexPopupService} from '@uex/uex-popup';
import {Policy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {PriceService} from '@individual-modular/services/price.service';

@Injectable()
export class PriceCustoResolver implements Resolve<any> {
    private policy: Policy;

    constructor(private uexPopup: UexPopupService, private priceService: PriceService, private store: Store<State>) {
        this.store.pipe(select(selectors.getPolicy)).subscribe((data) => {
            this.policy = data;
        });
    }

    resolve(): Observable<any> {
        return this.priceService
            .postPriceCustomisation(this.policy)
            .pipe(
                map((data) => data),
                catchError((error) => this.uexPopup.error(error.error_title, error.error_message))
            );
    }
}
