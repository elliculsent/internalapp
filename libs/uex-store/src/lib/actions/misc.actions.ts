import {createAction, props} from '@ngrx/store';

import {PriceDisplay} from '@uex/uex-models';

const SET_INTERMEDIARY_READONLY = '[MISC] Set Intermediary Readonly Value';
const SET_PRICE_DISPLAY = '[MISC] Set Price Display Value';
const SET_FAMILY_COMPOSITION = '[MISC] Set family composition';
const RESET_MISC = '[MISC] Reset Misc state value';

export const setIntermediaryReadonly: any = createAction(
    SET_INTERMEDIARY_READONLY,
    props<{intermediary_readonly: boolean}>()
);

export const setPriceDisplay: any = createAction(SET_PRICE_DISPLAY, props<{price_display: PriceDisplay}>());

export const setFamilyComposition: any = createAction(SET_FAMILY_COMPOSITION, props<{familyComposition: string}>());

export const resetMisc: any = createAction(RESET_MISC);
