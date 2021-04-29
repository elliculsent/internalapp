import {createReducer, on} from '@ngrx/store';

import * as actions from '@uex/uex-store/actions';
import {Misc} from '@uex/uex-models';

const initialState: Misc = {
    intermediary_readonly: false,
    price_display: null,
    familyComposition: null,
};

const reducer: any = createReducer(
    initialState,
    on(actions.resetMisc, (state) => ({
        ...state,
        ...initialState,
    })),
    on(actions.setIntermediaryReadonly, (state, {intermediary_readonly}) => ({
        ...state,
        intermediary_readonly,
    })),
    on(actions.setPriceDisplay, (state, {price_display}) => ({
        ...state,
        price_display,
    })),
    on(actions.setFamilyComposition, (state, {familyComposition}) => ({
        ...state,
        familyComposition,
    }))
);

export function miscReducer(state: Misc, action: any): any {
    return reducer(state, action);
}
