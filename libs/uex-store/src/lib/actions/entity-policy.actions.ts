import {createAction, props} from '@ngrx/store';

import {EntityPolicy, Insured} from '@uex/uex-models';

const SET_ENTITY_POLICY = '[ENTITY POLICY] Set Entity Policy State';
const RESET_ENTITY_POLICY = '[ENTITY POLICY] Reset Entity Policy State';
const SET_OFFER_ID = '[ENTITY POLICY] Set Offer ID Value';
const SET_INTERMEDIARY_HAS_USER = '[ENTITY POLICY] Set Intermediary Has User Value';
const POST_PERSONALISATION_FLOW = '[POST PERSONALISATION] Post Personalisation Flow to BE';
const SET_INSURED = '[ENTITY POLICY] Set Insured Value';
const UPDATE_INSURED = '[ENTITY POLICY] Update Insured Value';
const REMOVE_INSURED = '[ENTITY POLICY] Remove Insured Value';
const SET_PROFILE_CUSTOMISATION = '[ENTITY POLICY] Set Profile Customisation';
const SET_NEXT_PROFILE_CUSTOMISATION = '[ENTITY POLICY] Set Next Profile Customisation';
const UPDATE_INSURED_CUSTOMISATION = '[ENTITY POLICY] Update Insured Customisation';
const SET_CUSTOMISATION_COVERAGE = '[ENTITY POLICY] Set Customisation Coverage';
const POST_SUBSCRIPTION_FLOW = '[POST SUBSCRIPTION] Post Subscription Flow to BE';
const UPDATE_POLICY_STATUS = '[ENTITY POLICY] Update Policy Status';

export const setEntityPolicy: any = createAction(SET_ENTITY_POLICY, props<{entity_policy: EntityPolicy}>());
export const resetEntityPolicy: any = createAction(RESET_ENTITY_POLICY, props<{entity_policy: EntityPolicy}>());
export const setOfferId: any = createAction(SET_OFFER_ID, props<{offer_id: string}>());
export const setIntermediaryHasUser: any = createAction(
    SET_INTERMEDIARY_HAS_USER,
    props<{intermediary_has_user: any}>()
);

export const postPersonalisation: any = createAction(
    POST_PERSONALISATION_FLOW,
    props<{currentFlow: string; offerId: string | number}>()
);

export const setInsured: any = createAction(SET_INSURED, props<{insured: Insured[]; insuredType: string}>());

export const updateInsured = createAction(UPDATE_INSURED, props<{insured: Partial<Insured>; insuredId: string}>());

export const removeInsured = createAction(REMOVE_INSURED, props<{insured_type: Array<string>}>());

export const setProfileCustomisation: any = createAction(
    SET_PROFILE_CUSTOMISATION,
    props<{entity_policy: EntityPolicy; currentFlow: string; offerId: string | number}>()
);

export const setNextProfileCustomisation = createAction(SET_NEXT_PROFILE_CUSTOMISATION, props<{nextFlow: string}>());

export const updateInsuredCustomisation: any = createAction(UPDATE_INSURED_CUSTOMISATION);

export const setCustomisationCoverage: any = createAction(SET_CUSTOMISATION_COVERAGE, props<{coverages: any[]}>());

export const postSubscription: any = createAction(
    POST_SUBSCRIPTION_FLOW,
    props<{entity_policy: EntityPolicy; currentFlow: string; offerId: string | number}>()
);

export const updatePolicyStatus: any = createAction(UPDATE_POLICY_STATUS, props<{policy_status_code: string}>());
