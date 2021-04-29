import {createReducer, on} from '@ngrx/store';

import {setLeadAcquisition} from '@uex/uex-store/actions';
import {LeadAcquisition} from '@uex/uex-models';

const initialState: LeadAcquisition = {
    name: null,
    email: null,
    contactNumber: null,
};

const reducer: any = createReducer(
    initialState,
    on(setLeadAcquisition, (state, {lead_acquisition}) => ({...state, ...lead_acquisition}))
);

export function leadAcquisitionReducer(state: LeadAcquisition, action: any): any {
    return reducer(state, action);
}
