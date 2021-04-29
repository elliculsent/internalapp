import {createReducer, on} from '@ngrx/store';

import {
    resetLeftMenuCurrentFlow,
    resetLeftMenuFlow,
    resetProfileCustomisationSubmenu,
    setInitialLeftMenu,
    setLeftMenu,
    setMainflowIsActive,
    setMainflowIsValid,
    setPersonalisationActiveSubflow,
    setPersonalisationFields,
    setPersonalisationNextSubflow,
    setPersonalisationValidSubflow,
    setQuotationActiveSubflow,
    setQuotationFields,
    setSubscriptionActiveSubFlow,
    setSubscriptionFields,
    setSubscriptionNextSubflow,
    setSubscriptionValidSubflow,
} from '@uex/uex-store/actions';
import {PERSONALISATION, QUOTATION, SUBSCRIPTION} from '@uex/uex-constants';
import {LeftMenu, SubFlow} from '@uex/uex-models';

const initialState: LeftMenu = {
    slug: null,
    personalisation: null,
    quotation: null,
    subscription: null,
    powered_by: null,
};

const reducer: any = createReducer(
    initialState,
    on(setLeftMenu, (state, {left_menu}) => ({...state, ...left_menu})),
    on(setInitialLeftMenu, (state, {left_menu}) => ({...state, ...left_menu})),
    on(setPersonalisationActiveSubflow, (state, {sub_flow}) => ({
        ...state,
        ...personalisationActiveSubflow(state, sub_flow),
    })),
    on(setPersonalisationNextSubflow, (state, {sub_flow}) => ({
        ...state,
        ...setNextSubflow(state, sub_flow),
    })),
    on(setPersonalisationValidSubflow, (state, {sub_flow}) => ({
        ...state,
        ...setValidSubflow(state, sub_flow),
    })),
    on(setPersonalisationFields, (state, {sub_flow}) => {
        const menu = state.personalisation.menu.map((menuSubFlow: SubFlow) => {
            if (menuSubFlow.sub_flow_name === sub_flow.sub_flow_name) {
                return {...menuSubFlow, fields: sub_flow.fields};
            }
            return menuSubFlow;
        });
        return {
            ...state,
            personalisation: {
                ...state.personalisation,
                menu: [...menu],
            },
        };
    }),
    on(setMainflowIsActive, (state, {main_flow, is_active}) => ({
        ...state,
        ...setActiveMainflow(state, main_flow, is_active),
    })),
    on(setMainflowIsValid, (state, {main_flow, is_valid}) => ({
        ...state,
        ...setValidMainflow(state, main_flow, is_valid),
    })),
    on(setQuotationActiveSubflow, (state, {sub_flow}) => ({
        ...state,
        ...quotationActiveSubflow(state, sub_flow),
    })),
    on(setQuotationFields, (state, {sub_flow}) => ({
        ...state,
        ...quotationFields(state, sub_flow),
    })),
    on(setSubscriptionActiveSubFlow, (state, {sub_flow}) => ({
        ...state,
        ...subscriptionActiveSubFlow(state, sub_flow),
    })),
    on(setSubscriptionFields, (state, {sub_flow}) => ({
        ...state,
        ...subscriptionFields(state, sub_flow),
    })),
    on(resetLeftMenuFlow, (state, {flow}) => ({
        ...state,
        ...resetFlow(state, flow),
    })),
    on(resetLeftMenuCurrentFlow, (state, {flow}) => ({
        ...state,
        ...resetFromCurrentFlow(state, flow),
    })),
    on(setSubscriptionNextSubflow, (state, {sub_flow}) => ({
        ...state,
        ...subscriptionNextSubflow(state, sub_flow),
    })),
    on(setSubscriptionValidSubflow, (state, {sub_flow}) => ({
        ...state,
        ...subscriptionValidSubflow(state, sub_flow),
    })),
    on(resetProfileCustomisationSubmenu, (state) => ({
        ...state,
        ...unsetProfileCustomisationSubmenu(state),
    }))
);

function personalisationActiveSubflow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.personalisation.menu.forEach((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.is_active = true;
        } else {
            data.is_active = false;
        }
    });
    return stateCopy;
}

function quotationActiveSubflow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.quotation.menu.forEach((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.is_active = true;
        } else {
            data.is_active = false;
        }
    });
    return stateCopy;
}

function quotationFields(state: any, subFlow: SubFlow): any {
    const menu = state.quotation.menu.map((menuSubFlow: SubFlow) => {
        if (menuSubFlow.sub_flow_name === subFlow.sub_flow_name) {
            return {...menuSubFlow, fields: subFlow.fields};
        }
        return menuSubFlow;
    });
    return {
        ...state,
        quotation: {
            ...state.quotation,
            menu: [...menu],
        },
    };
}

function setNextSubflow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.personalisation.menu.find((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.show = true;
        }
    });
    return stateCopy;
}

function setValidSubflow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.personalisation.menu.find((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.is_valid = true;
        }
    });
    return stateCopy;
}

function setActiveMainflow(state: any, mainFlow: string, isActive: boolean): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    switch (mainFlow) {
        case PERSONALISATION:
            stateCopy.personalisation.is_active = isActive;
            stateCopy.quotation.is_active = false;
            stateCopy.subscription.is_active = false;
            break;
        case QUOTATION:
            stateCopy.personalisation.is_active = false;
            stateCopy.quotation.is_active = isActive;
            stateCopy.subscription.is_active = false;
            break;
        case SUBSCRIPTION:
            stateCopy.personalisation.is_active = false;
            stateCopy.quotation.is_active = false;
            stateCopy.subscription.is_active = isActive;
            break;
    }
    return stateCopy;
}

function setValidMainflow(state: any, mainFlow: string, isValid: boolean): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    switch (mainFlow) {
        case PERSONALISATION:
            stateCopy.personalisation.is_valid = isValid;
            break;
        case QUOTATION:
            stateCopy.quotation.is_valid = isValid;
            break;
        case SUBSCRIPTION:
            stateCopy.subscription.is_valid = isValid;
            break;
    }
    return stateCopy;
}

function subscriptionActiveSubFlow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.subscription.menu.forEach((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.is_active = true;
        } else {
            data.is_active = false;
        }
    });
    return stateCopy;
}

function subscriptionFields(state: any, subFlow: SubFlow): any {
    const menu = state.subscription.menu.map((menuSubFlow: SubFlow) => {
        if (menuSubFlow.sub_flow_name === subFlow.sub_flow_name) {
            return {...menuSubFlow, fields: subFlow.fields};
        }
        return menuSubFlow;
    });
    return {
        ...state,
        subscription: {
            ...state.subscription,
            menu: [...menu],
        },
    };
}

function resetFlow(state: any, flow: any): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    let flag = true;
    switch (flow.main_flow) {
        case PERSONALISATION:
            stateCopy.personalisation.is_valid = false;
            stateCopy.quotation.is_valid = false;
            stateCopy.subscription.is_valid = false;
            stateCopy.personalisation.menu.map((menuSubFlow: SubFlow) => {
                if (!flag) {
                    menuSubFlow.show = false;
                    menuSubFlow.is_valid = false;
                }

                if (menuSubFlow.sub_flow_name === flow.sub_flow_name) {
                    flag = false;
                    menuSubFlow.is_valid = false;
                }
            });
            stateCopy.subscription.menu.map((menuSubFlow: SubFlow) => {
                menuSubFlow.show = false;
                menuSubFlow.is_valid = false;
            });
            break;
        case SUBSCRIPTION:
            stateCopy.subscription.is_valid = false;
            stateCopy.subscription.menu.map((menuSubFlow: SubFlow) => {
                if (!flag) {
                    menuSubFlow.show = false;
                    menuSubFlow.is_valid = false;
                }

                if (menuSubFlow.sub_flow_name === flow.sub_flow_name) {
                    flag = false;
                    menuSubFlow.is_valid = false;
                }
            });
            break;
    }
    return stateCopy;
}

function resetFromCurrentFlow(state: any, flow: any): any {
    let flag = true;
    const stateCopy = JSON.parse(JSON.stringify(state));
    switch (flow.main_flow) {
        case SUBSCRIPTION:
            stateCopy.subscription.is_valid = false;
            stateCopy.subscription.menu.map((menuSubFlow: SubFlow) => {
                if (menuSubFlow.sub_flow_name === flow.sub_flow_name) {
                    flag = false;
                }
                if (menuSubFlow.sub_flow_name !== flow.sub_flow_name) {
                    menuSubFlow.show = flag;
                    menuSubFlow.is_valid = flag;
                }
            });
            break;
    }
    return stateCopy;
}

function subscriptionNextSubflow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.subscription.menu.find((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.show = true;
        }
    });
    return stateCopy;
}

function subscriptionValidSubflow(state: any, subFlow: string): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.subscription.menu.find((data: SubFlow) => {
        if (data.sub_flow_name === subFlow) {
            data.is_valid = true;
        }
    });
    return stateCopy;
}

function unsetProfileCustomisationSubmenu(state: any): any {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.personalisation.menu
        .filter((menuSubFlow: SubFlow) => menuSubFlow.menu_type === 'submenu')
        .map((subMenu: SubFlow) => {
            subMenu.is_valid = false;
            subMenu.show = false;
        });
    return stateCopy;
}

export function leftMenuReducer(state: LeftMenu, action: any): any {
    return reducer(state, action);
}
