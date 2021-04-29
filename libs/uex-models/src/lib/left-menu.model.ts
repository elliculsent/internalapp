export interface LeftMenu {
    slug: string;
    personalisation: MainFlow;
    quotation: MainFlow;
    subscription: MainFlow;
    powered_by: PoweredBy;
}

export interface MainFlow {
    flow_name: string;
    label: string;
    link: string;
    link_type: string;
    is_active: boolean;
    is_valid: boolean;
    menu: Array<SubFlow>;
}

export interface SubFlow {
    sub_flow_name: string;
    label: string;
    link: string;
    link_type: string;
    icon: string;
    show: boolean;
    is_valid: boolean;
    is_active: boolean;
    active_icon: string;
    fields?: any;
    sub_flow_status: any[];
    menu_type?: string;
}

export interface PoweredBy {
    powered_by_alt_text: string;
    powered_by_label: string;
    powered_by_logo: string;
}
