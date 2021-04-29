import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {CUSTOMISATION_LINK, QUOTATION_LINK} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {PriceService} from '@individual-modular/services/price.service';

@Injectable()
export class PriceCustoGuard implements CanActivate {
    private isPriceSet: any;
    private isPriceValid = false;
    private policy: any;
    private selectedLanguageCountry: string;

    constructor(private priceService: PriceService, private router: Router, private store: Store<State>) {
        combineLatest([
            this.store.select(selectors.getPriceDisplay),
            this.store.select(selectors.isPriceValid),
            this.store.select(selectors.getSelectedCountryLanguage),
            this.store.select(selectors.getPolicy),
        ]).subscribe(([isPriceSet, isPriceValid, selectedLanguageCountry, policy]) => {
            this.isPriceSet = isPriceSet;
            this.isPriceValid = isPriceValid;
            this.selectedLanguageCountry = selectedLanguageCountry;
            this.policy = policy;
        });
    }

    canActivate(): Observable<boolean> {
        if (this.isPriceSet) {
            if (this.isPriceValid) {
                return of(true);
            } else {
                this.router.navigateByUrl(`${this.selectedLanguageCountry}/${QUOTATION_LINK}/${CUSTOMISATION_LINK}`);
            }
        } else {
            return this.priceService.postPriceCustomisation(this.policy).pipe(
                map((data) => {
                    this.store.dispatch(actions.setPriceDisplay({price_display: data.price_display}));
                    return true;
                }),
                catchError(() => {
                    this.router.navigateByUrl(
                        `${this.selectedLanguageCountry}/${QUOTATION_LINK}/${CUSTOMISATION_LINK}`
                    );
                    return of(false);
                })
            );
        }
    }
}
