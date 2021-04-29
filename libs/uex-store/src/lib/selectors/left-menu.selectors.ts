import {createSelector, select} from '@ngrx/store';

import {LeftMenu, MainFlow, PoweredBy, SubFlow} from '@uex/uex-models';
import {UexState} from '@uex/uex-store/reducers';
import {pipe} from 'rxjs';
import {filter, mergeMap, pluck} from 'rxjs/operators';

export const selectLeftMenu = (state: UexState) => state.left_menu;

export const isLeftMenuSet = createSelector(selectLeftMenu, (leftMenu: LeftMenu): boolean => {
    if (
        leftMenu.personalisation &&
        leftMenu.quotation &&
        leftMenu.subscription &&
        leftMenu.powered_by &&
        leftMenu.slug
    ) {
        return true;
    } else {
        return false;
    }
});

export const selectPersonalisation = createSelector(selectLeftMenu, (leftMenu: LeftMenu): MainFlow => {
    return leftMenu.personalisation;
});

export const selectQuotation = createSelector(selectLeftMenu, (leftMenu: LeftMenu): MainFlow => {
    return leftMenu.quotation;
});

export const selectSubscription = createSelector(selectLeftMenu, (leftMenu: LeftMenu): MainFlow => {
    return leftMenu.subscription;
});

export const selectPoweredBy = createSelector(selectLeftMenu, (leftMenu: LeftMenu): PoweredBy => {
    return leftMenu.powered_by;
});

export const selectPersonalisationSubFlow = createSelector(
    selectPersonalisation,
    (mainFlow: MainFlow, subFlowName: string): SubFlow => {
        return mainFlow.menu.find((data) => data.sub_flow_name === subFlowName);
    }
);

export const selectPersonalisationFields = (subFlowName: string) =>
    pipe(select(selectPersonalisationSubFlow, subFlowName), filter((subFlow) => subFlow.fields), pluck('fields'));

export const selectPersonalisationFormControls = (subFlowName: string) =>
    pipe(selectPersonalisationFields(subFlowName), pluck('form_controls'), mergeMap((formControls) => formControls));

export const selectQuotationSubFlow = createSelector(
    selectQuotation,
    (mainFlow: MainFlow, subFlowName: string): SubFlow => {
        return mainFlow.menu.find((data) => data.sub_flow_name === subFlowName);
    }
);

export const selectQuotationFields = (subFlowName: string) =>
    pipe(select(selectQuotationSubFlow, subFlowName), filter((subFlow) => subFlow.fields), pluck('fields'));

export const isPersonalisationSubFlowValid = createSelector(
    selectPersonalisation,
    (mainFlow: MainFlow, subFlowName: string): boolean => {
        const subflow = mainFlow.menu.find((data) => data.sub_flow_name === subFlowName);
        if (subflow && subflow.is_valid && subflow.show) {
            return true;
        } else {
            return false;
        }
    }
);

export const isPersonalisationValid = createSelector(selectPersonalisation, (mainFlow: MainFlow): boolean => {
    return mainFlow.is_valid;
});

export const getMainflowLink = createSelector(selectLeftMenu, (leftMenu: any, props: string): string => {
    return leftMenu[props].link;
});

export const getSubflowLink = createSelector(selectLeftMenu, (leftMenu: any, props: any): string => {
    let link: string;
    leftMenu[props.mainflow].menu.map((sub) => {
        if (sub.sub_flow_name === props.subflow) {
            link = sub.link;
        }
    });
    return link;
});

export const getActiveSubFlow = createSelector(selectLeftMenu, (leftMenu: any, props: any): string => {
    let subFlowName: string;
    leftMenu[props.mainflow].menu.map((sub) => {
        if (sub.is_active) {
            subFlowName = sub.sub_flow_name;
        }
    });
    return subFlowName;
});

export const isSubscriptionSubFlowValid = createSelector(
    selectSubscription,
    (mainFlow: MainFlow, subFlowName: string): boolean => {
        const subflow = mainFlow.menu.find((data) => data.sub_flow_name === subFlowName);
        if (subflow && subflow.is_valid && subflow.show) {
            return true;
        } else {
            return false;
        }
    }
);

export const isSubscriptionSubFlowShown = createSelector(
    selectSubscription,
    (mainFlow: MainFlow, subFlowName: string): boolean => {
        const subflow = mainFlow.menu.find((data) => data.sub_flow_name === subFlowName);
        if (subflow && subflow.show) {
            return true;
        } else {
            return false;
        }
    }
);

export const selectSubscriptionSubFlow = createSelector(
    selectSubscription,
    (mainFlow: MainFlow, subFlowName: string): SubFlow => {
        return mainFlow.menu.find((data) => data.sub_flow_name === subFlowName);
    }
);

export const selectSubscriptionFields = (subFlowName: string) =>
    pipe(select(selectSubscriptionSubFlow, subFlowName), filter((subFlow) => subFlow.fields), pluck('fields'));

export const selectSubscriptionFormControls = (subFlowName: string) =>
    pipe(selectSubscriptionFields(subFlowName), pluck('form_controls'), mergeMap((formControls) => formControls));
