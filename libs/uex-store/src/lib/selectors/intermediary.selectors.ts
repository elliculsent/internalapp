import {createSelector} from '@ngrx/store';

import {Intermediary} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectIntermediary = (state: UexState) => state.intermediary;

export const getIntermediaryToken = createSelector(selectIntermediary, (intermediary: Intermediary): string => {
    if (intermediary && intermediary.intermediary_token) {
        return intermediary.intermediary_token;
    } else {
        return null;
    }
});

export const hasIntermediaryToken = createSelector(selectIntermediary, (intermediary: Intermediary): boolean => {
    if (intermediary && intermediary.intermediary_token) {
        return true;
    } else {
        return false;
    }
});

export const isReadOnlyCode = createSelector(selectIntermediary, (intermediary: Intermediary): boolean => {
    if (intermediary && (intermediary.read_only || intermediary.intermediary_token)) {
        return true;
    } else {
        return false;
    }
});
