import {createAction, props} from '@ngrx/store';

const SET_SELECTED_COUNTRY = '[LOCALE] Set Selected Country';
const SET_SELECTED_LANGUAGE = '[LOCALE] Set Selected Language';
const SET_SELECTED_COUNTRY_LANGUAGE_LABEL = '[LOCALE] Set Selected Country and Language Label';

export const setSelectedCountry: any = createAction(
    SET_SELECTED_COUNTRY,
    props<{selected_country: string}>()
);
export const setSelectedLanguage: any = createAction(
    SET_SELECTED_LANGUAGE,
    props<{selected_language: string}>()
);
export const setSelectedCountryLanguageLabel: any = createAction(
    SET_SELECTED_COUNTRY_LANGUAGE_LABEL,
    props<{selected_country_language_label: string}>()
);
