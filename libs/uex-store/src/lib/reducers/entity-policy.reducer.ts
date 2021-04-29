import {createReducer, on} from '@ngrx/store';

import {
    removeInsured,
    resetEntityPolicy,
    setCustomisationCoverage,
    setEntityPolicy,
    setInsured,
    setIntermediaryHasUser,
    setOfferId,
    updateInsured,
    updateInsuredCustomisation,
    updatePolicyStatus,
} from '@uex/uex-store/actions';
import {POLICY_HOLDER} from '@uex/uex-constants';
import {Coverage, EntityPolicy, Insured} from '@uex/uex-models';

const initialState: EntityPolicy = {
    id: null,
    entity_name: null,
    entity_type: null,
    entity_reference_number: null,
    entity_reference_type: null,
    entity_business: null,
    entity_description: null,
    entity_is_active: null,
    entity_code: null,
    contact: null,
    address: null,
    policy: {
        uuid: null,
        offer_id: null,
        policy_number: null,
        policy_type: null,
        policy_start_date: null,
        policy_end_date: null,
        product: {
            product_code: null,
            product_version: null,
        },
        group: [
            {
                id: null,
                insured: [
                    {
                        customisation: {
                            factor: null,
                            coverage: null,
                        },
                    },
                ],
                group_name: null,
                group_type: null,
            },
        ],
    },
};

const reducer: any = createReducer(
    initialState,
    on(setEntityPolicy, (state, {entity_policy}) => ({...state, ...entity_policy})),
    // tslint:disable-next-line:variable-name
    on(resetEntityPolicy, (_state, {entity_policy}) => entity_policy),
    on(setOfferId, (state, {offer_id}) => ({...state, ...setOfferIdValue(state, offer_id)})),
    on(setIntermediaryHasUser, (state, {intermediary_has_user}) => ({
        ...state,
        ...setIntermediaryHasUserValue(state, intermediary_has_user),
    })),
    on(setInsured, (state, {insured, insuredType}) => ({
        ...state,
        ...setInsuredValue(state, insured, insuredType),
    })),
    on(updateInsured, (state, {insured, insuredId}) => ({
        ...state,
        ...updateInsuredById(state, insured, insuredId),
    })),
    on(removeInsured, (state, {insured_type}) => ({
        ...state,
        ...removeInsuredValue(state, insured_type),
    })),
    on(setCustomisationCoverage, (state, {coverages}) => ({
        ...state,
        ...setCustomisationCoverageValue(state, coverages),
    })),
    on(updateInsuredCustomisation, (state) => ({
        ...state,
        ...updateInsuredCustomisationValue(state),
    })),
    on(updatePolicyStatus, (state, {policy_status_code}) => ({
        ...state,
        ...updatePolicyStatusCode(state, policy_status_code),
    }))
);

function setOfferIdValue(state: EntityPolicy, offerId: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.policy.offer_id = offerId;
    return stateCopy;
}

function setIntermediaryHasUserValue(state: EntityPolicy, intermediaryHasUser: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.policy.intermediary_has_user = intermediaryHasUser;
    return stateCopy;
}

export function setInsuredValue(state: EntityPolicy, insured: Insured[], insuredType: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    const insuredCopy: any[] = stateCopy.policy.group[0].insured.slice(0);
    const newInsured = insuredCopy.reduce((acc, curr) => {
        if (curr.insured_type !== insuredType) {
            acc.push(curr);
        }
        return acc;
    }, []);
    stateCopy.policy.group[0].insured = newInsured.concat(insured);
    return stateCopy;
}

export function updateInsuredById(state: EntityPolicy, insured: Partial<Insured>, insuredId: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    const insuredCopy: any[] = stateCopy.policy.group[0].insured.slice(0);
    const insuredIndex = insuredCopy.findIndex((insuredData: Insured) => insuredData.id === insuredId);
    const newInsured = {...insuredCopy[insuredIndex], ...insured};
    stateCopy.policy.group[0].insured[insuredIndex] = newInsured;
    return stateCopy;
}

export function removeInsuredValue(state: EntityPolicy, insuredType: Array<string>): any {
    const stateCopy = JSON.parse(JSON.stringify(state));

    stateCopy.policy.group[0].insured = stateCopy.policy.group[0].insured.filter(
        (val) => !insuredType.includes(val.insured_type)
    );
    return stateCopy;
}

export function updateInsuredCustomisationValue(state: EntityPolicy): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    const insuredCopy: any[] = stateCopy.policy.group[0].insured.slice(0);
    const policyHolderInsured: Insured = insuredCopy.filter((insured) => insured.insured_type === POLICY_HOLDER).pop();
    const dependantInsuredList: Insured[] = insuredCopy.filter((insured) => insured.insured_type !== POLICY_HOLDER);

    dependantInsuredList.map((dependantInsured: Insured) => {
        const currentInsured = JSON.parse(JSON.stringify(dependantInsured));
        currentInsured.customisation = policyHolderInsured.customisation;
        const index = insuredCopy.findIndex((insured: Insured) => insured.id === currentInsured.id);
        stateCopy.policy.group[0].insured[index] = currentInsured;
        return currentInsured;
    });
    return stateCopy;
}

export function setCustomisationCoverageValue(state: EntityPolicy, coverages: {[key: string]: number}[]): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    const insuredCopy: any[] = stateCopy.policy.group[0].insured.slice(0);
    insuredCopy.map((insured: Insured, index: number) => {
        const currentInsured = JSON.parse(JSON.stringify(insured));
        const coverage = currentInsured.customisation.coverage as Coverage[];
        if (!coverage.length) {
            return currentInsured;
        }
        const newCover = coverage.map((cover) => {
            const level = coverages.filter((c: any) => c[cover.name]);
            if (level && level.length) {
                return {name: cover.name, level: level[0][cover.name]};
            } else {
                return cover;
            }
        });
        currentInsured.customisation.coverage = newCover;
        stateCopy.policy.group[0].insured[index] = currentInsured;
        return currentInsured;
    });

    return stateCopy;
}

export function updatePolicyStatusCode(state: EntityPolicy, policyStatusCode: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.policy.policy_status_code = policyStatusCode;
    return stateCopy;
}

export function entityPolicyReducer(state: EntityPolicy, action: any): any {
    return reducer(state, action);
}
