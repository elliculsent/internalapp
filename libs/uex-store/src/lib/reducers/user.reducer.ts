import {createReducer, on} from '@ngrx/store';

import {setUserData, unsetUserData} from '@uex/uex-store/actions';
import {UserData} from '@uex/uex-models';

const initialState: UserData = null;

const reducer: any = createReducer(
    initialState,
    on(setUserData, (state, {user_data}) => ({...state, ...user_data})),
    on(unsetUserData, () => initialState)
);

export function userDataReducer(state: UserData, action: any): any {
    return reducer(state, action);
}
