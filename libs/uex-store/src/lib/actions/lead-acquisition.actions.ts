import {createAction, props} from '@ngrx/store';

import {LeadAcquisition} from '@uex/uex-models';

const POST_LEAD_ACQUISITION = '[LEAD ACQUISITION] Post Lead Acquisition to BE';
const SET_LEAD_ACQUISITION = '[LEAD ACQUISITION] Set Lead Acquisition State';

export const postLeadAcquisition: any = createAction(
    POST_LEAD_ACQUISITION,
    props<{lead_acquisition: LeadAcquisition; intermediaryCode: string}>()
);

export const setLeadAcquisition: any = createAction(SET_LEAD_ACQUISITION, props<{lead_acquisition: LeadAcquisition}>());
