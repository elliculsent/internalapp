import {Injectable} from '@angular/core';

import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {select, Store} from '@ngrx/store';

import {Observable, throwError} from 'rxjs';

import {catchError, first, flatMap} from 'rxjs/operators';

import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

import {SpinnerService} from '@uex/uex-services';

import {environment} from '@individual-modular/environment/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    private selectedLanguageCountry: string;

    constructor(private store: Store<State>, private uexSpinnerService: SpinnerService) {
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            if (data) {
                this.selectedLanguageCountry = data;
            } else {
                this.selectedLanguageCountry = `${environment.defaults.language}-${environment.defaults.country}`;
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select(selectors.getUserToken).pipe(
            first(),
            flatMap((accessToken) => {
                if (accessToken) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${accessToken}`,
                            'client-id': environment.baymax_client_id,
                            'origin-site': environment.origin_site,
                            'Content-Type': 'application/json',
                            'Accept-Language': this.selectedLanguageCountry,
                        },
                        url: request.url,
                    });
                } else {
                    request = request.clone({
                        setHeaders: {
                            'client-id': environment.baymax_client_id,
                            'origin-site': environment.origin_site,
                            'Content-Type': 'application/json',
                            'Accept-Language': this.selectedLanguageCountry,
                        },
                        url: request.url,
                    });
                }
                return next.handle(request).pipe(
                    catchError((httpError: HttpErrorResponse) => {
                        let errorMessage = '';
                        let errorTitle = 'Error';

                        if (httpError.error instanceof ErrorEvent) {
                            // client-side error
                            errorMessage = `Error: ${httpError.error.message}`;
                        } else {
                            const error = httpError.error;
                            // server-side error
                            // Handle message
                            if (error && typeof error.error_message === 'string') {
                                errorMessage = error.error_message;
                            } else {
                                errorMessage = '<ul>';

                                Object.keys(error.error_message).forEach((key) => {
                                    const errorMessageArray = error.error_message[key];
                                    errorMessageArray.map((message) => {
                                        errorMessage += `<li>${message}</li>`;
                                    });
                                });

                                errorMessage += '</ul>';

                                if (error && error.error_title) {
                                    errorTitle = error.error_title;
                                }
                            }
                        }

                        this.uexSpinnerService.emitSpinner.emit({
                            showSpinner: false,
                            spinnerMessage: null,
                        });

                        return throwError({
                            error_message: errorMessage,
                            error_title: errorTitle,
                        });
                    })
                );
            })
        );
    }
}
