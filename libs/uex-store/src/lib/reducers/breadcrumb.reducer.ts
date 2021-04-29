import {createReducer, on} from '@ngrx/store';

import {resetBreadcrumb, setBreadcrumb, setBreadcrumbActive} from '@uex/uex-store/actions';
import {Breadcrumb, BreadcrumbList} from '@uex/uex-models';

const initialState: BreadcrumbList = {
    items: [],
};

const reducer: any = createReducer(
    initialState,
    on(setBreadcrumb, (state, {items}) => ({...state, items})),
    on(setBreadcrumbActive, (state, {main_flow}) => ({
        ...state,
        ...activeBreadcumb(state, main_flow),
    })),
    on(resetBreadcrumb, (state, {main_flow}) => ({
        ...state,
        ...resetActiveBreadcumb(state, main_flow),
    }))
);

function activeBreadcumb(state: any, mainFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.items.forEach((data: Breadcrumb) => {
        if (data.main_flow === mainFlow) {
            data.active = true;
        }
    });
    return stateCopy;
}

function resetActiveBreadcumb(state: any, mainFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    let flag = true;
    stateCopy.items.forEach((data: Breadcrumb) => {
        if (!flag) {
            data.active = false;
        }
        if (data.main_flow === mainFlow) {
            flag = false;
        }
    });
    return stateCopy;
}

export function breadcrumbReducer(state: BreadcrumbList, action: any): any {
    return reducer(state, action);
}
