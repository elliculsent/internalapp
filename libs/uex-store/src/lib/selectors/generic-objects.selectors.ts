import {createSelector} from '@ngrx/store';

import {GenericObjects} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectGenericObjects = (state: UexState) => state.generic_objects;

export const getInitBreadcrumb = createSelector(selectGenericObjects, (genericObjects: GenericObjects): any => {
    return genericObjects.breadcrumb;
});

export const getInitEntityPolicy = createSelector(selectGenericObjects, (genericObjects: GenericObjects): any => {
    return genericObjects.entityPolicy;
});

export const getInitForgotPasswordConfig = createSelector(
    selectGenericObjects,
    (genericObjects: GenericObjects): any => {
        return genericObjects.forgotPasswordConfig;
    }
);

export const getInitFlow = createSelector(selectGenericObjects, (genericObjects: GenericObjects): any => {
    return genericObjects.initialFlow;
});

export const getInitLeadAcquisitionConfig = createSelector(
    selectGenericObjects,
    (genericObjects: GenericObjects): any => {
        return genericObjects.leadAcquisitionConfig;
    }
);

export const getInitLeftMenu = createSelector(selectGenericObjects, (genericObjects: GenericObjects): any => {
    return genericObjects.leftMenu;
});

export const getInitLogin = createSelector(selectGenericObjects, (genericObjects: GenericObjects): any => {
    return genericObjects.loginConfig;
});

export const getInitSignup = createSelector(selectGenericObjects, (genericObjects: GenericObjects): any => {
    return genericObjects.signupConfig;
});

export const getIsDataFetched = createSelector(selectGenericObjects, (genericObjects: GenericObjects): boolean => {
    return genericObjects.isDataFetched;
});
