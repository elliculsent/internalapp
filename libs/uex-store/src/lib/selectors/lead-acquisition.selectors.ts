import {createSelector} from '@ngrx/store';

import {LeadAcquisition} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectLeadAcquisition = (state: UexState) => state.lead_acquisition;

export const isLeadAcquisitionValid = createSelector(
    selectLeadAcquisition,
    (leadAcquisition: LeadAcquisition): boolean => {
        if (leadAcquisition.contactNumber && leadAcquisition.email && leadAcquisition.name) {
            return true;
        } else {
            return false;
        }
    }
);
