import {createAction, props} from '@ngrx/store';

const SET_INIT_BREADCRUMB = '[GENERIC OBJECTS] Set Breadcrumb initial value';
const SET_INIT_ENTITY_POLICY = '[GENERIC OBJECTS] Set Entity Policy initial value';
const SET_INIT_FORGOT_PASSWORD_CONFIG = '[GENERIC OBJECTS] Set Forgot Password Config value';
const SET_INIT_FLOW = '[GENERIC OBJECTS] Set Initial Flow value';
const SET_INIT_LEAD_ACQUISITION_CONFIG = '[GENERIC OBJECTS] Set Lead Acquisition config value';
const SET_INIT_LEFTMENU = '[GENERIC OBJECTS] Set LeftMenu initial value';
const SET_INIT_LOGIN_CONFIG = '[GENERIC OBJECTS] Set Login config value';
const SET_INIT_SIGNUP_CONFIG = '[GENERIC OBJECTS] Set Signup config value';
const SET_IS_DATA_FETCHED = '[GENERIC OBJECTS] Set after data is fetched';

export const setInitBreadcrumb: any = createAction(SET_INIT_BREADCRUMB, props<{breadcrumb: any}>());

export const setInitEntityPolicy: any = createAction(
    SET_INIT_ENTITY_POLICY,
    props<{entityPolicy: any}>()
);

export const setInitForgotPasswordConfig: any = createAction(
    SET_INIT_FORGOT_PASSWORD_CONFIG,
    props<{forgotPasswordConfig: any}>()
);

export const setInitFlow: any = createAction(SET_INIT_FLOW, props<{initialFlow: any}>());

export const setInitLeadAcquisitionConfig: any = createAction(
    SET_INIT_LEAD_ACQUISITION_CONFIG,
    props<{leadAcquisitionConfig: any}>()
);

export const setInitLeftMenu: any = createAction(SET_INIT_LEFTMENU, props<{leftMenu: any}>());

export const setInitLoginConfig: any = createAction(
    SET_INIT_LOGIN_CONFIG,
    props<{loginConfig: any}>()
);

export const setInitSignupConfig: any = createAction(
    SET_INIT_SIGNUP_CONFIG,
    props<{signupConfig: any}>()
);

export const setIsDataFetched: any = createAction(
    SET_IS_DATA_FETCHED,
    props<{isDataFetched: boolean}>()
);
