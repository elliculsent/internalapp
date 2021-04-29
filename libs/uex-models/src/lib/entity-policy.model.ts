import {Policy} from './policy.model';

export interface EntityPolicy {
    id: number | string;
    entity_name: string;
    entity_type: string;
    entity_reference_number: string;
    entity_reference_type: string;
    entity_business: string;
    entity_description: string;
    entity_is_active: boolean;
    entity_code: string;
    contact: Contact;
    address: Address;
    policy: Policy;
}

export interface Contact {
    id: number | string;
    contact_phone_number: string;
    contact_email: string;
    contact_alternative_email: string;
    contact_name: string;
    contact_is_active: boolean;
}

export interface Address {
    id: number | string;
    address_street: string;
    address_country: string;
    address_postcode: string;
    address_floor: string;
    address_unit: string;
    address_complete_location: string;
    address_is_active: boolean;
    address_is_checked: boolean;
}
