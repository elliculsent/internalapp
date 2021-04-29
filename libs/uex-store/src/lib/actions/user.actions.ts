import {createAction, props} from '@ngrx/store';

import {UserData} from '@uex/uex-models';

const POST_LOGIN = '[USERDATA] Post Login Data to BE';
const POST_USER_PRODUCT_POLICY = '[USERDATA] Post User Product Policy to BE';
const POST_LOGOUT = '[USERDATA] Post Logout Data to BE';
const SET_USERDATA = '[USERDATA] Set User Data State';
const UNSET_USERDATA = '[USERDATA] UnSet User Data State';
const USER_REDIRECTION = '[USERDATA] Redirect user to the correct page after login';
const USER_NEW_SUBSCRIPTION = '[USERDATA] New Subscription';

export const postLogin: any = createAction(POST_LOGIN, props<{login_data: any}>());
export const postUserProductPolicy: any = createAction(POST_USER_PRODUCT_POLICY);
export const postLogout: any = createAction(POST_LOGOUT, props<{user_token: any}>());
export const setUserData: any = createAction(SET_USERDATA, props<{user_data: UserData}>());
export const unsetUserData: any = createAction(UNSET_USERDATA, props<{user_data: null}>());
export const userRedirection: any = createAction(USER_REDIRECTION, props<{flow: any}>());
export const userNewSubscription: any = createAction(USER_NEW_SUBSCRIPTION);
