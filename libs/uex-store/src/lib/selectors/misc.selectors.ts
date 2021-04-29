import {createSelector} from '@ngrx/store';

import {
    CHILD,
    COUPLE,
    FAMILY,
    POLICY_HOLDER,
    POLICY_HOLDER_AND_CHILD,
    POLICY_HOLDER_ONLY,
    SPOUSE,
} from '@uex/uex-constants';
import {Misc, PriceDisplay} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';
import {getInsuredCount} from '@uex/uex-store/selectors/entity-policy';

export const selectMisc = (state: UexState) => state.misc;

export const isIntermediaryReadonly = createSelector(selectMisc, (misc: Misc): boolean => {
    return misc.intermediary_readonly;
});

export const getPriceDisplay = createSelector(selectMisc, (misc: Misc): PriceDisplay => {
    return misc.price_display;
});

export const isPriceValid = createSelector(getPriceDisplay, (priceDisplay: PriceDisplay): boolean => {
    if (priceDisplay && priceDisplay.monthly_price_value) {
        return true;
    } else {
        return false;
    }
});

export const getFamilyComposition = createSelector(
    selectMisc,
    getInsuredCount,
    (misc: Misc, insuredCount: any): string => {
        if (misc.familyComposition) {
            return misc.familyComposition;
        } else {
            if (POLICY_HOLDER in insuredCount && SPOUSE in insuredCount && CHILD in insuredCount) {
                return FAMILY;
            } else if (POLICY_HOLDER in insuredCount && SPOUSE in insuredCount) {
                return COUPLE;
            } else if (POLICY_HOLDER in insuredCount && CHILD in insuredCount) {
                return POLICY_HOLDER_AND_CHILD;
            }
            return POLICY_HOLDER_ONLY;
        }
    }
);
