import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

@Injectable()
export class AuthService {
    private baymaxBaseUrl: string;
    public product_code: string;

    constructor(private httpClient: HttpClient) {}

    // need to set first the Product code for this service to work
    set setBaseUrl(val: string) {
        this.baymaxBaseUrl = val;
    }

    set setProductCode(val: string) {
        this.product_code = val;
    }

    get getBaseUrl(): string {
        return this.baymaxBaseUrl;
    }

    get getProductCode(): string {
        return this.product_code;
    }

    postLogin(data: any): Observable<any> {
        return this.httpClient.post(`${this.getBaseUrl}api/v2/account/login/`, data);
    }

    postSignup(data: any, offerId: string | number): Observable<any> {
        // If you want to attach the email to the offer, offerId should be passed
        const bData = {
            email: data['email'],
            password: data['password'],
            confirm_password: data['confirmPassword'],
            product_code: this.product_code,
            offer_id: offerId,
        };

        return this.httpClient.post(`${this.getBaseUrl}api/v2/account/signup/`, bData);
    }

    postForgotPassword(data: any): Observable<any> {
        data['product_code'] = this.product_code;

        return this.httpClient.post(`${this.getBaseUrl}api/v2/account/password/forgots/`, data);
    }

    postResetPassword(data: any): Observable<any> {
        const bData = {
            password: data['newPassword'],
            confirm_password: data['confirmNewPassword'],
            token: data['token'],
        };

        return this.httpClient.post(`${this.getBaseUrl}api/v2/account/password/resets/`, bData);
    }

    postLogout(userToken: string): Observable<any> {
        const token = {token: userToken};
        return this.httpClient.post(`${this.getBaseUrl}api/v2/account/logout/`, token);
    }

    getTokenPasswordValidation(tokenPassword: string): Observable<any> {
        return this.httpClient.get(`${this.getBaseUrl}api/v2/account/token-password/${tokenPassword}/validations`);
    }

    getTokenAccountVerification(userUUid: string, tokenAccount: string, offerId: string | number): Observable<any> {
        if (offerId) {
            return this.httpClient.get(
                `${this.getBaseUrl}api/v2/account/${userUUid}/${tokenAccount}/verifications?offer_id=${offerId}`
            );
        }
        return this.httpClient.get(`${this.getBaseUrl}api/v2/account/${userUUid}/${tokenAccount}/verifications`);
    }
}
