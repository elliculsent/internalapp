import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import * as actions from '@uex/uex-store/actions';
import {UexState} from '@uex/uex-store/reducers';
import * as selectors from '@uex/uex-store/selectors';

@Injectable()
export class LocaleGuard implements CanActivate {
    private environment: any;
    private selectedLanguage: string;
    private selectedCountry: string;
    private selectedCountryLanguageLabel: string;

    constructor(private router: Router, private store: Store<UexState>) {
        this.store.pipe(select(selectors.getSelectedLanguage)).subscribe((data) => {
            this.selectedLanguage = data;
        });
        this.store.pipe(select(selectors.getSelectedCountry)).subscribe((data) => {
            this.selectedCountry = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguageLabel)).subscribe((data) => {
            this.selectedCountryLanguageLabel = data;
        });
    }

    canActivate(aRoute: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.environment = aRoute.data.environment;
        const langNcountryParam = aRoute.paramMap.get('langNcountry');
        const langNcountry = langNcountryParam.split('-');
        const urlSlug = location.pathname.replace(`/${langNcountryParam}`, '');

        if (langNcountry.length === 2) {
            return combineLatest(this.checkLanguage(langNcountry[0]), this.checkCountry(langNcountry[1])).pipe(
                map(([languageLabel, countryLabel]) => {
                    if (languageLabel && countryLabel) {
                        this.dispatchSelectedCountry(langNcountry[1]);
                        this.dispatchSelectedLanguage(langNcountry[0]);
                        this.dispatchSelectedCountryLanguageLabel(`${countryLabel} (${languageLabel})`);
                        return true;
                    } else {
                        // prettier-ignore
                        const language = languageLabel ? langNcountry[0] : this.environment.defaults.language;
                        // prettier-ignore
                        const country = countryLabel ? langNcountry[1] : this.environment.defaults.country;
                        const countryLbl = countryLabel ? countryLabel : this.environment.defaults.countryLabel;
                        this.dispatchSelectedCountry(country);
                        this.dispatchSelectedLanguage(language);
                        this.dispatchSelectedCountryLanguageLabel(`${countryLbl} (${language.toUpperCase()})`);
                        // this will redirect the user to the default language and/or country if either or both are incorrect
                        this.router.navigateByUrl(`${language}-${country}${urlSlug}`);
                        return false;
                    }
                })
            );
        } else {
            if (this.selectedCountry && this.selectedLanguage && this.selectedCountryLanguageLabel) {
                const defLangNCountry = `${this.selectedLanguage}-${this.selectedCountry}`;
                this.router.navigateByUrl(`${defLangNCountry}${urlSlug}`);
                return false;
            } else {
                // prettier-ignore
                const defLangNCountry = `${this.environment.defaults.language}-${this.environment.defaults.country}`;
                const defLangNCountryLabel = `${this.environment.defaults
                    .countryLabel} (${this.environment.defaults.language.toUpperCase()})`;
                this.dispatchSelectedCountry(this.environment.defaults.country);
                this.dispatchSelectedLanguage(this.environment.defaults.language);
                this.dispatchSelectedCountryLanguageLabel(defLangNCountryLabel);
                this.router.navigateByUrl(`${defLangNCountry}${urlSlug}`);
                return false;
            }
        }
    }

    private async checkLanguage(language: string): Promise<any> {
        // TODO: Modify this section once BE had implemented it
        // return this.cmsService.getLanguages(language).then((res): any => {
        //     const data = res.data;
        //     if (data.select_language.length > 0) {
        //         return language.toUpperCase();
        //     } else {
        //         return null;
        //     }
        // });

        // prettier-ignore
        language = language === this.environment.defaults.language ? language : null;
        return language;
    }

    private async checkCountry(country: string): Promise<any> {
        // TODO: Modify this section once BE had implemented it
        // return this.cmsService.getCountries(country).then((res): any => {
        //     const data = res.data;
        //     if (data.select_country.length > 0) {
        //         return data.select_country[0].country;
        //     } else {
        //         return null;
        //     }
        // });

        // prettier-ignore
        country = country === this.environment.defaults.country ? 'France' : null;
        return country;
    }

    private dispatchSelectedCountry(country: string): void {
        this.store.dispatch(actions.setSelectedCountry({selected_country: country}));
    }

    private dispatchSelectedLanguage(language: string): void {
        this.store.dispatch(actions.setSelectedLanguage({selected_language: language}));
    }

    private dispatchSelectedCountryLanguageLabel(label: string): void {
        this.store.dispatch(actions.setSelectedCountryLanguageLabel({selected_country_language_label: label}));
    }
}
