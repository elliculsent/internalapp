export interface Misc {
    intermediary_readonly: boolean;
    price_display: PriceDisplay;
    familyComposition: string;
}

export interface PriceDisplay {
    currency_code: string;
    currency_symbole: string;
    help_tip_label: string;
    help_tip: Helptip;
    logo: string;
    per_month_label: string;
    price_value: number;
    monthly_price_value: number;
    title: string;
    price_error_msg: string;
}

export interface Helptip {
    content: string;
    title: string;
}
