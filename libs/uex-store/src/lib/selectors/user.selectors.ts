import {createSelector} from '@ngrx/store';

import {User, UserData} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectUserData = (state: UexState) => state.user_data;

export const isLoggedIn = createSelector(selectUserData, (userData: UserData): boolean => {
    if (userData) {
        return true;
    } else {
        return false;
    }
});

export const getUserToken = createSelector(selectUserData, (userData: UserData): string => {
    if (userData && userData.token) {
        return userData.token.access_token;
    } else {
        return null;
    }
});

export const getUserInfo = createSelector(selectUserData, (userData: UserData): User => {
    if (userData) {
        return userData.user;
    } else {
        return null;
    }
});
