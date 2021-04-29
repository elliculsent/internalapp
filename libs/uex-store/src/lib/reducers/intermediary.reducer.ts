import {createReducer, on} from '@ngrx/store';

import {setIntermediaryToken, setReadonlyCode} from '@uex/uex-store/actions';
import {Intermediary} from '@uex/uex-models';

const initialState: Intermediary = null;

const reducer: any = createReducer(
    initialState,
    on(setIntermediaryToken, (state, {intermediary_token}) => ({...state, intermediary_token})),
    on(setReadonlyCode, (state, {read_only}) => ({...state, read_only}))
);

export function intermediaryReducer(state: Intermediary, action: any): any {
    return reducer(state, action);
}
