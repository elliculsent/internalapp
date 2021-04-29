import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {environment} from '@individual-modular/environment/environment';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@uex/uex-store/selectors';

@Injectable()
export class UtilsService {
    private productCode: string;
    constructor(private httpClient: HttpClient, private store: Store<State>) {
        this.store.pipe(select(selectors.getProductCode)).subscribe((data) => {
            this.productCode = data;
        });
    }

    postLeadAcquisition(params: any, intermediaryCode: string): Observable<any> {
        const data = {
            email: params['email'],
            contact_phone_number: params['contactNumber'],
            name: params['name'],
            lead_details: params['my_need'],
            intermediary_code: intermediaryCode,
        };
        const baymaxAcquisitionUrl = `${environment.baymax_backend_root_url}api/v2/acquisition/`;
        return this.httpClient.post(`${baymaxAcquisitionUrl}leads/product/${environment.product.code}`, data);
    }

    validateIntermediaryCode(code: string, token: string): Promise<any> {
        let url = `${environment.baymax_backend_root_url}api/v2/intermediary/${code}/product/${this
            .productCode}/informations/`;
        if (token) {
            url = `${environment.baymax_backend_root_url}api/v2/intermediary/${code}/product/${this
                .productCode}/informations/?token=${token}`;
        }
        return this.httpClient.get<any>(url).toPromise();
    }

    getCookiePolicyData(productCode: string): Promise<any> {
        // TODO: pass hostname to BE, need backend implementation
        return this.httpClient.get<any>(`./assets/mocks/${productCode}/policy-cookie.mock.json`).toPromise();
    }

    getQuoteEngine(entityPolicy: any): Observable<any> {
        return this.httpClient.post(
            `${environment.baymax_backend_root_url}api/v2/flow/QUOTATION/CUSTOMISATION/computations/`,
            entityPolicy
        );
    }

    getInsuredAges(date: string): Promise<any> {
        const params = {
            birthdate: [date],
        };
        return this.httpClient.post(`${environment.baymax_backend_root_url}api/v2/insured/ages/`, params).toPromise();
    }

    isPostalExist(postalCode: string): Observable<any> {
        const params = new HttpParams({
            fromObject: {
                field: 'name',
                startswith: postalCode,
                limit: '1',
            },
        });
        return this.httpClient.get(`${environment.baymax_backend_root_url}api/v2/misc/postal/filter/`, {params});
    }

    updateOfferCustomisation(entityPolicy: EntityPolicy): Observable<any> {
        return this.httpClient.post(
            `${environment.baymax_backend_root_url}api/v2/acquisition/customisation-offer/${entityPolicy['policy'][
                'offer_id'
            ]}/`,
            entityPolicy
        );
    }

    validatePromoCode(promoCode: string, policyNumber: string): Observable<any> {
        const params = {
            policy_number: policyNumber,
        };
        return this.httpClient.post(
            `${environment.baymax_backend_root_url}api/v2/promotion/${promoCode}/validations/`,
            params
        );
    }
}
