import {Product} from './product.model';

export interface Policy {
    uuid: number | string;
    offer_id: number | string;
    policy_number: string;
    policy_number_encoded?: string;
    policy_type: string;
    policy_is_default?: boolean;
    policy_medical_review?: string;
    policy_tnc?: any;
    policy_encoder?: {
        email: string;
    };
    policy_start_date: string | Date;
    policy_end_date: string | Date;
    policy_is_active?: boolean;
    policy_status_code?: string;
    product: Product;
    policy_custom_data?: any;
    policy_movement?: any;
    policy_counter_offer?: any;
    policy_external_reference?: ExternalReference;
    group: Array<Group>;
    policy_renewal?: any;
    policy_brochure?: any;
    intermediary_has_user?: any;
}

export interface ExternalReference {
    external_reference_policy_number: string;
    external_reference_number: string;
    external_reference_number_encoded: string;
}

export interface Group {
    id: number | string;
    insured: Array<Partial<Insured>>;
    group_name: string;
    group_type: string;
}

export interface Insured {
    id: number | string;
    insured_age: {
        days: number;
        years: number;
        months: number;
    };
    insured_bmi: any;
    insured_type: string;
    customisation: Customisation;
    insured_email: string;
    insured_label: string;
    insured_gender: string;
    insured_height: number;
    insured_weight: number;
    insured_age_label: string;
    insured_birthdate:
        | {
              date: {
                  day: number;
                  year: number;
                  month: number;
              };
          }
        | string;
    insured_last_name: string;
    insured_linked_to: number;
    insured_first_name: string;
    insured_is_insured: boolean;
    insured_occupation: string;
    insured_nationality: string;
    insured_identity_type: string;
    insured_marital_status: string;
    insured_health_question: any;
    insured_identity_number: string;
    insured_accept_term_and_cond: boolean;
    insured_civility: string;
    insured_sequence_ref: number;
    is_selected: boolean;
    user_policy_customisation_profile?: any;
}

export interface Customisation {
    factor: Factor[];
    coverage: Coverage | Coverage[];
}

export interface Factor {
    code: string;
    name: string;
}

export interface Coverage {
    name: string;
    level: number;
}
