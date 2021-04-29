import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

@Injectable()
export class ProductService {
    private baymaxBaseUrl: string;
    private productCode: string;
    private productVersion: string;

    constructor(private httpClient: HttpClient) {}

    // need to set first the Product code for this service to work
    set setBaseUrl(val: string) {
        this.baymaxBaseUrl = val;
    }

    set setProductCode(val: string) {
        this.productCode = val;
    }

    set setProductVersion(val: string) {
        this.productVersion = val;
    }

    get getProductBaseUrl(): string {
        return `${this.baymaxBaseUrl}api/v2/product/${this.productCode}/`;
    }

    get getproductVersionBaseUrl(): string {
        return `${this.getProductBaseUrl}${this.productVersion}/`;
    }

    postMultiComponentDisplay(component: Array<string>): Observable<any> {
        const requestBody = {
            component,
        };
        return this.httpClient.post(`${this.getProductBaseUrl}displays/`, requestBody);
    }

    getOfferId(): Promise<any> {
        return this.httpClient.post(`${this.getproductVersionBaseUrl}offers/`, null).toPromise();
    }

    getComputationDurationDate(durationType: string, startDate: string): Promise<any> {
        const params = new HttpParams({
            fromObject: {
                duration_type: durationType,
                start_date: startDate,
            },
        });
        return this.httpClient.get(`${this.getproductVersionBaseUrl}computation/duration-date/`, {params}).toPromise();
    }

    getSubflowContent(mainFlow: string, subFlow: string): Promise<any> {
        return this.httpClient
            .get(`${this.getProductBaseUrl}flow/${mainFlow}/sub-flow/${subFlow}/displays/`)
            .toPromise();
    }
}
