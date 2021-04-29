import {createAction, props} from '@ngrx/store';

import {LeftMenu, SubFlow} from '@uex/uex-models';

const SET_LEFT_MENU = '[LEFT MENU] Set Left Menu State';
const SET_INITIAL_MENU = '[LEFT MENU] Set Initial Left Menu State';
const SET_MAINFLOW_IS_ACTIVE = '[LEFT MENU] Set Main Flow Active State';
const SET_MAINFLOW_IS_VALID = '[LEFT MENU] Set Main Flow Valid State';
const SET_PERSONALISATION_ACTIVE_SUBFLOW = '[LEFT MENU] Set Personalisation Current Active Subflow';
const SET_PERSONALISATION_NEXT_SUBFLOW = '[LEFT MENU] Set Personalisation Next Subflow';
const SET_PERSONALISATION_VALID_SUBFLOW = '[LEFT MENU] Set Personalisation Valid Subflow';
const SET_PERSONALISATION_FIELDS = '[LEFT MENU] Set Personalisation Fields';
const SET_QUOTATION_ACTIVE_SUBFLOW = '[LEFT MENU] Set Quotation Current Active Subflow';
const SET_QUOTATION_FIELDS = '[LEFT MENU] Set Quotation Subflow Fields';
const SET_SUBSCRIPTION_ACTIVE_SUBFLOW = '[LEFT MENU] Set Subscription Current Active Subflow';
const SET_SUBSCRIPTION_FIELDS = '[LEFT MENU] Set Subscription Fields';
const RESET_LEFT_MENU_FLOW = '[LEFT MENU] Reset Left Menu Flow';
const SET_SUBSCRIPTION_NEXT_SUBFLOW = '[LEFT MENU] Set Subscription Next Subflow';
const SET_SUBSCRIPTION_VALID_SUBFLOW = '[LEFT MENU] Set Subscription Valid Subflow';
const RESET_PROFILE_CUSTOMISATION_SUBMENU = '[LEFT MENU] Reset Profile Customisation Submenu';
const RESET_LEFT_MENU_FROM_CURRENT_FLOW = '[LEFT MENU] Reset Left Menu from Current Flow';

export const setLeftMenu: any = createAction(SET_LEFT_MENU, props<{left_menu: LeftMenu}>());
export const setInitialLeftMenu = createAction(SET_INITIAL_MENU, props<{left_menu: LeftMenu; sub_flow: SubFlow}>());
export const setPersonalisationActiveSubflow: any = createAction(
    SET_PERSONALISATION_ACTIVE_SUBFLOW,
    props<{sub_flow: string}>()
);
export const setPersonalisationNextSubflow: any = createAction(
    SET_PERSONALISATION_NEXT_SUBFLOW,
    props<{sub_flow: string}>()
);
export const setPersonalisationValidSubflow: any = createAction(
    SET_PERSONALISATION_VALID_SUBFLOW,
    props<{sub_flow: string}>()
);
export const setPersonalisationFields = createAction(SET_PERSONALISATION_FIELDS, props<{sub_flow: SubFlow}>());
export const setMainflowIsActive: any = createAction(
    SET_MAINFLOW_IS_ACTIVE,
    props<{main_flow: string; is_active: boolean}>()
);
export const setMainflowIsValid: any = createAction(
    SET_MAINFLOW_IS_VALID,
    props<{main_flow: string; is_valid: boolean}>()
);
export const setQuotationActiveSubflow: any = createAction(SET_QUOTATION_ACTIVE_SUBFLOW, props<{sub_flow: string}>());
export const setQuotationFields = createAction(SET_QUOTATION_FIELDS, props<{sub_flow: SubFlow}>());
export const setSubscriptionActiveSubFlow: any = createAction(
    SET_SUBSCRIPTION_ACTIVE_SUBFLOW,
    props<{sub_flow: string}>()
);
export const setSubscriptionFields: any = createAction(SET_SUBSCRIPTION_FIELDS, props<{sub_flow: SubFlow}>());
export const resetLeftMenuFlow: any = createAction(RESET_LEFT_MENU_FLOW, props<{flow: any}>());
export const setSubscriptionNextSubflow: any = createAction(SET_SUBSCRIPTION_NEXT_SUBFLOW, props<{sub_flow: string}>());
export const setSubscriptionValidSubflow: any = createAction(
    SET_SUBSCRIPTION_VALID_SUBFLOW,
    props<{sub_flow: string}>()
);

export const resetProfileCustomisationSubmenu = createAction(RESET_PROFILE_CUSTOMISATION_SUBMENU);

export const resetLeftMenuCurrentFlow: any = createAction(RESET_LEFT_MENU_FROM_CURRENT_FLOW, props<{flow: any}>());
