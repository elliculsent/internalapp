export interface ObjectReference {
    name: string;
    reference: string;
}

export interface FormContent {
    id: string;
    placeholder: string;
    required: boolean;
    type: string;
    object_reference?: ObjectReference[];
    validation?: any;
}

export interface Item {
    id: string;
    object_reference?: ObjectReference[];
    options?: any[];
    required?: boolean;
    requiredTrue?: boolean;
    checked?: boolean;
    slug?: string;
    title?: string;
    label?: string;
    type?: string;
    form_content?: FormContent[];
}

export interface ItemContent extends Partial<FormContent>, Partial<Item> {}
