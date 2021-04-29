import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {storageSync} from '@larscom/ngrx-store-storagesync';

// all imported shared store should be added here to sync with sessionStorage
import {BreadcrumbList, EntityPolicy, GenericObjects, LeftMenu, Locale, Misc, UserData} from '@uex/uex-models';
import * as fromUexReducer from '@uex/uex-store/reducers';

export interface State {
    breadcrumb: BreadcrumbList;
    entity_policy: EntityPolicy;
    genericObjects: GenericObjects;
    left_menu: LeftMenu;
    locale: Locale;
    misc: Misc;
    user_data: UserData;
}

export const reducers: ActionReducerMap<State> = {
    breadcrumb: fromUexReducer.breadcrumbReducer,
    entity_policy: fromUexReducer.entityPolicyReducer,
    genericObjects: fromUexReducer.genericObjectsReducer,
    left_menu: fromUexReducer.leftMenuReducer,
    locale: fromUexReducer.localeReducer,
    misc: fromUexReducer.miscReducer,
    user_data: fromUexReducer.userDataReducer,
};

export function storageSyncReducer(reducer: ActionReducer<State>): ActionReducer<any> {
    // provide all feature states within the features array
    // features which are not provided, do not get synced
    const sync = storageSync<State>({
        features: [
            // save only router state to sessionStorage
            {stateKey: 'breadcrumb', storageForFeature: window.sessionStorage},
            {stateKey: 'entity_policy', storageForFeature: window.sessionStorage},
            {stateKey: 'genericObjects', storageForFeature: window.sessionStorage},
            {stateKey: 'left_menu', storageForFeature: window.sessionStorage},
            {stateKey: 'locale', storageForFeature: window.sessionStorage},
            {stateKey: 'misc', storageForFeature: window.sessionStorage},
            {stateKey: 'user_data', storageForFeature: window.sessionStorage},
        ],
        // defaults to localStorage
        storage: window.sessionStorage,
    });

    return sync(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [storageSyncReducer];
