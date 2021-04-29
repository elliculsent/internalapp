import {createSelector} from '@ngrx/store';

import {BreadcrumbList} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';

export const selectBreadcrumb = (state: UexState) => state.breadcrumb;

export const isSetBreadcrumb = createSelector(selectBreadcrumb, (breadcrumb: BreadcrumbList): boolean => {
    if (breadcrumb && breadcrumb.items && breadcrumb.items.length > 0) {
        return true;
    } else {
        return false;
    }
});
