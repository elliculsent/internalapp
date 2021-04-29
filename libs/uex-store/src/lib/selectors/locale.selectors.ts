import {createSelector} from '@ngrx/store';

import {Locale} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectLocale = (state: UexState) => state.locale;

export const getSelectedLanguage = createSelector(selectLocale, (locale: Locale): string => {
    return locale.selected_language;
});

export const getSelectedCountry = createSelector(selectLocale, (locale: Locale): string => {
    return locale.selected_country;
});

export const getSelectedCountryLanguageLabel = createSelector(selectLocale, (locale: Locale): string => {
    return locale.selected_country_language_label;
});

export const getSelectedCountryLanguage = createSelector(
    getSelectedLanguage,
    getSelectedCountry,
    (language: string, country: string): string => {
        if (language && country) {
            return `${language}-${country}`;
        } else {
            return null;
        }
    }
);
