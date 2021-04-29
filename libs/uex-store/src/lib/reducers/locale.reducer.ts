import {createReducer, on} from '@ngrx/store';

import * as actions from '@uex/uex-store/actions';
import {Locale} from '@uex/uex-models';

const initialState: Locale = {
    selected_country: null,
    selected_language: null,
    selected_country_language_label: null,
};

const reducer: any = createReducer(
    initialState,
    on(actions.setSelectedCountry, (state, {selected_country}) => ({
        ...state,
        selected_country,
    })),
    on(actions.setSelectedLanguage, (state, {selected_language}) => ({
        ...state,
        selected_language,
    })),
    on(actions.setSelectedCountryLanguageLabel, (state, {selected_country_language_label}) => ({
        ...state,
        selected_country_language_label,
    }))
);

export function localeReducer(state: Locale, action: any): any {
    return reducer(state, action);
}
