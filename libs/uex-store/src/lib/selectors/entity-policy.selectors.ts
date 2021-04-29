/* eslint-disable no-prototype-builtins */
import {createSelector} from '@ngrx/store';

import {POLICY_HOLDER} from '@uex/uex-constants';
import {Coverage, Customisation, EntityPolicy, Factor, Group, Insured, Policy} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectEntityPolicy = (state: UexState) => state.entity_policy;

export const getOfferId = createSelector(selectEntityPolicy, (entityPolicy: EntityPolicy):
    | string
    | number => {
    return entityPolicy.policy.offer_id;
});

export const getPolicy = createSelector(
    selectEntityPolicy,
    (entityPolicy: EntityPolicy): Policy => {
        return entityPolicy.policy;
    }
);

export const getGroup = createSelector(getPolicy, (policy: Policy): Group[] => {
    return policy.group;
});

export const getGroupByIndex = createSelector(
    getGroup,
    (group: Group[], index: number): Group => {
        return group[index];
    }
);

export const getFirstGroup = createSelector(getGroup, (group: Group[]) => {
    if (group.length > 0) {
        return getGroupByIndex.projector(group, 0);
    } else {
        return null;
    }
});

export const getFirstGroupInsured = createSelector(
    getFirstGroup,
    (group: Group): Partial<Insured> => {
        if (group && group.insured) {
            return group.insured[0];
        } else {
            return null;
        }
    }
);

export const getInsuredByType = createSelector(
    getFirstGroup,
    (group: Group, insuredType: string): Partial<Insured>[] => {
        if (group && group.insured) {
            return group.insured.filter((insured) => insured.insured_type === insuredType);
        } else {
            return null;
        }
    }
);

export const getInsuredCount = createSelector(getFirstGroup, (group: Group): any => {
    if (group && group.insured) {
        return group.insured.reduce((acc, curr) => {
            // tslint:disable-next-line: restrict-plus-operands
            acc[curr.insured_type] = (acc[curr.insured_type] || 0) + 1;
            return acc;
        }, {});
    } else {
        return null;
    }
});

export const getCustomisation = createSelector(
    getFirstGroupInsured,
    (insured: Insured): Customisation => {
        if (insured) {
            return insured.customisation;
        } else {
            return null;
        }
    }
);

export const getFirstInsuredCoverage = createSelector(getFirstGroupInsured, (insured: Insured): {
    [key: string]: number;
}[] => {
    if (insured) {
        const coverages = insured.customisation.coverage as Coverage[];
        return coverages.map((coverage) => {
            return {[coverage.name]: coverage.level};
        });
    } else {
        return null;
    }
});

export const getPolicyHolderOccupation = createSelector(
    getFirstGroupInsured,
    (insured: Insured): string => {
        if (insured) {
            return insured.insured_occupation;
        }
        return null;
    }
);

export const getProductVersion = createSelector(selectEntityPolicy, (entityPolicy: EntityPolicy):
    | string
    | number => {
    return entityPolicy.policy.product.product_version;
});

export const getProductCode = createSelector(
    selectEntityPolicy,
    (entityPolicy: EntityPolicy): string => {
        return entityPolicy.policy.product.product_code;
    }
);

export const getIntermediaryName = createSelector(getPolicy, (policy: Policy): string => {
    if (
        policy.intermediary_has_user &&
        policy.intermediary_has_user.hasOwnProperty('intermediary') &&
        policy.intermediary_has_user.intermediary.hasOwnProperty('intermediary_name')
    ) {
        return policy.intermediary_has_user.intermediary.intermediary_name;
    } else {
        return null;
    }
});

export const getIntermediaryCode = createSelector(getPolicy, (policy: Policy): string => {
    if (
        policy.intermediary_has_user &&
        policy.intermediary_has_user.hasOwnProperty('intermediary_has_user_reference')
    ) {
        return policy.intermediary_has_user.intermediary_has_user_reference;
    } else {
        return null;
    }
});

export const getPolicyStatusCode = createSelector(
    selectEntityPolicy,
    (entityPolicy: EntityPolicy): string => {
        return entityPolicy.policy?.policy_status_code;
    }
);

export const getSelectedInsuredID = createSelector(getFirstGroup, (group: Group):
    | string
    | number => {
    if (group.insured) {
        let id;
        group.insured.forEach((item) => {
            if (item.is_selected) {
                id = item.id;
            }
        });

        if (!id) {
            group.insured.forEach((item) => {
                if (item.insured_type === POLICY_HOLDER) {
                    id = item.id;
                }
            });
        }
        return id;
    }
});

export const getFactor = createSelector(getFirstGroupInsured, (insured: Insured): Factor[] => {
    if (insured) {
        return insured.customisation.factor;
    } else {
        return null;
    }
});

export const getFactorByName = createSelector(
    getFactor,
    (factors: Factor[], name: string): Factor => {
        if (factors) {
            return factors.find((factor) => {
                // prettier-ignore
                return factor.name === name ? factor : null;
            });
        } else {
            return null;
        }
    }
);
