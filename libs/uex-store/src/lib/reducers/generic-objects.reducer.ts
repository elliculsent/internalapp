import {createReducer, on} from '@ngrx/store';

import * as actions from '@uex/uex-store/actions';
import {GenericObjects} from '@uex/uex-models';

const initialState: GenericObjects = {
    breadcrumb: null,
    entityPolicy: null,
    forgotPasswordConfig: null,
    initialFlow: null,
    leadAcquisitionConfig: null,
    leftMenu: null,
    loginConfig: null,
    signupConfig: null,
    isDataFetched: false,
};

const reducer: any = createReducer(
    initialState,
    on(actions.setInitBreadcrumb, (state, {breadcrumb}) => ({...state, breadcrumb})),
    on(actions.setInitEntityPolicy, (state, {entityPolicy}) => ({...state, entityPolicy})),
    on(actions.setInitForgotPasswordConfig, (state, {forgotPasswordConfig}) => ({
        ...state,
        forgotPasswordConfig,
    })),
    on(actions.setInitFlow, (state, {initialFlow}) => ({...state, initialFlow})),
    on(actions.setInitLeadAcquisitionConfig, (state, {leadAcquisitionConfig}) => ({
        ...state,
        leadAcquisitionConfig,
    })),
    on(actions.setInitLeftMenu, (state, {leftMenu}) => ({...state, leftMenu})),
    on(actions.setInitLoginConfig, (state, {loginConfig}) => ({...state, loginConfig})),
    on(actions.setInitSignupConfig, (state, {signupConfig}) => ({...state, signupConfig})),
    on(actions.setIsDataFetched, (state, {isDataFetched}) => ({...state, isDataFetched}))
);

export function genericObjectsReducer(state: GenericObjects, action: any): any {
    return reducer(state, action);
}
