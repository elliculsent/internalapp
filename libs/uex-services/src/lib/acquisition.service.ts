import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AcquisitionService {
    private baymaxBaseUrl: string;

    constructor(private httpClient: HttpClient) {}

    // need to set first the Product code for this service to work
    set setBaseUrl(val: string) {
        this.baymaxBaseUrl = val;
    }

    get getBaseUrl(): string {
        return `${this.baymaxBaseUrl}api/v2/acquisition/`;
    }

    postNewShareOffer(channel: string, baseUrl: string, redirectionUrl: string, payload: any): Observable<any> {
        const data = {
            channel,
            payload,
            base_url: baseUrl,
            redirection_url: redirectionUrl,
        };

        return this.httpClient.post(`${this.getBaseUrl}share-offers/NEW_SHARING/${channel}/`, data);
    }

    postOverrideShareOffer(
        channel: string,
        redirectionUrl: string,
        payload: any,
        offerId: string | number
    ): Observable<any> {
        const data = {
            channel,
            offer_uuid: offerId,
            payload,
            redirection_url: redirectionUrl,
        };
        return this.httpClient.post(`${this.getBaseUrl}share-offers/OVERRIDE_SHARING/${channel}/`, data);
    }

    getSharedOffer(offerId: string | number): Promise<any> {
        return this.httpClient.get(`${this.getBaseUrl}share-offers/${offerId}`).toPromise();
    }
}
