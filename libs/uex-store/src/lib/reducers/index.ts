import {
    BreadcrumbList,
    EntityPolicy,
    GenericObjects,
    Intermediary,
    LeadAcquisition,
    LeftMenu,
    Locale,
    Misc,
    UserData,
} from '@uex/uex-models';

export interface UexState {
    breadcrumb?: BreadcrumbList;
    entity_policy?: EntityPolicy;
    generic_objects?: GenericObjects;
    intermediary?: Intermediary;
    lead_acquisition?: LeadAcquisition;
    left_menu?: LeftMenu;
    locale?: Locale;
    misc?: Misc;
    user_data?: UserData;
}

export * from './breadcrumb.reducer';
export * from './entity-policy.reducer';
export * from './generic-objects.reducer';
export * from './intermediary.reducer';
export * from './lead-acquisition.reducer';
export * from './left-menu.reducer';
export * from './locale.reducer';
export * from './misc.reducer';
export * from './user.reducer';
