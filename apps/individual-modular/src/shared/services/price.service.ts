import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {environment} from '@individual-modular/environment/environment';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class PriceService {
    private baseUrl = `${environment.baymax_backend_root_url}api/v2/pricer/product/${environment.product.code}/`;
    private baseVersionUrl: string = null;
    private selectedInsuredID: string | number = null;

    constructor(private httpClient: HttpClient, private store: Store<State>) {
        this.store.pipe(select(selectors.getProductVersion)).subscribe((data) => {
            this.baseVersionUrl = `${this.baseUrl}${data}/`;
        });
        this.store.pipe(select(selectors.getSelectedInsuredID)).subscribe((data) => {
            this.selectedInsuredID = data;
        });
    }

    postPriceCustomisation(policy: any): Observable<any> {
        const param = {
            policy_params: policy,
        };
        return this.httpClient.post(`${this.baseVersionUrl}customisations/${this.selectedInsuredID}/`, param);
    }

    postPricer(policy: any): Observable<any> {
        const param = {
            policy_params: policy,
            display_only: true,
        };
        return this.httpClient.post(`${this.baseVersionUrl}prices/`, param);
    }
}
