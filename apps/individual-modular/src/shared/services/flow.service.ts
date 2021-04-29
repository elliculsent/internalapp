import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {environment} from '@individual-modular/environment/environment';
import {select, Store} from '@ngrx/store';
import {UexState} from '@uex/uex-store/reducers';
import * as selectors from '@uex/uex-store/selectors';

import {Observable} from 'rxjs';

@Injectable()
export class FlowService {
    private flowBaseUrl = `${environment.baymax_backend_root_url}api/v2/flow/`;
    private isLoggedIn: boolean;

    constructor(private httpClient: HttpClient, private store: Store<UexState>) {
        this.store.pipe(select(selectors.isLoggedIn)).subscribe((data) => {
            this.isLoggedIn = data;
        });
    }

    postFlow(payload: any, currentFlow: string, offerId: string | number, baseUrl: string = null): Promise<any> {
        const data = {
            entity_policy: payload,
            base_url: baseUrl,
        };
        if (this.isLoggedIn) {
            return this.httpClient.post(`${this.flowBaseUrl}${currentFlow}/policy/${offerId}/`, data).toPromise();
        } else {
            return this.httpClient.post(`${this.flowBaseUrl}${currentFlow}/offer/${offerId}/`, data).toPromise();
        }
    }

    postFlowObservable(
        payload: any,
        currentFlow: string,
        offerId: string | number,
        baseUrl: string = null
    ): Observable<any> {
        const data = {
            entity_policy: payload,
            base_url: baseUrl,
        };
        if (this.isLoggedIn) {
            return this.httpClient.post(`${this.flowBaseUrl}${currentFlow}/policy/${offerId}/`, data);
        } else {
            return this.httpClient.post(`${this.flowBaseUrl}${currentFlow}/offer/${offerId}/`, data);
        }
    }
}
