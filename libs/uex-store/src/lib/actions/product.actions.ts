import {createAction} from '@ngrx/store';

const INIT_PRODUCT_OBJECT = '[PRODUCT] Initialize Product Object Data';

export const initProductObject: any = createAction(INIT_PRODUCT_OBJECT);
