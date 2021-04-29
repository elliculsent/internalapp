import {createAction, props} from '@ngrx/store';

const SET_INTERMEDIARY_TOKEN = '[INTERMEDIARY_TOKEN] Set Intermediary Token';
const SET_READONLY_CODE = '[INTERMEDIARY_TOKEN] Set Code Read Only';

export const setIntermediaryToken: any = createAction(
    SET_INTERMEDIARY_TOKEN,
    props<{intermediary_token: string}>()
);

export const setReadonlyCode: any = createAction(SET_READONLY_CODE, props<{read_only: boolean}>());
