export interface BreadcrumbList {
    items: Array<Breadcrumb>;
}

export interface Breadcrumb {
    label: string;
    active: boolean;
    link: string;
    main_flow: string;
}
