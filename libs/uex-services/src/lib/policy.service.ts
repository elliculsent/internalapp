import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class PolicyService {
    private baymaxBaseUrl: string;

    constructor(private httpClient: HttpClient) {}

    // need to set first the Product code for this service to work
    set setBaseUrl(val: string) {
        this.baymaxBaseUrl = val;
    }

    get getBaseUrl(): string {
        return `${this.baymaxBaseUrl}api/v2/policy/`;
    }

    getUserProductPolicy(productCode: string): Observable<any> {
        // There is no need to add the email as backend is already using the logged account
        return this.httpClient.get(`${this.getBaseUrl}product/${productCode}/`);
    }

    getPolicyStatusCode(offerId: string | number): Observable<any> {
        // There is no need to add the email as backend is already using the logged account
        return this.httpClient.get(`${this.getBaseUrl}${offerId}/status-code/`);
    }
}
