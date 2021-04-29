import {createAction, props} from '@ngrx/store';

import {Breadcrumb} from '@uex/uex-models';

const SET_BREADCRUMB = '[BREADCRUMB] Set Breadcrumb State';
const RESET_BREADCRUMB = '[BREADCRUMB] Reset Breadcrumb State';
const SET_BREADCRUMB_ACTIVE = '[BREADCRUMB] Set Breadcrumb Active State';

export const setBreadcrumb: any = createAction(SET_BREADCRUMB, props<{items: Array<Breadcrumb>}>());
export const setBreadcrumbActive: any = createAction(SET_BREADCRUMB_ACTIVE, props<{main_flow: string}>());
export const resetBreadcrumb: any = createAction(RESET_BREADCRUMB, props<{main_flow: string}>());
