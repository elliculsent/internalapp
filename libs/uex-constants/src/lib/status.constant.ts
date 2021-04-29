import {CONFIRMATION_LINK, PAYMENT_LINK, SUBSCRIPTION_LINK} from './flow.constant';

export const PAYMENT_STATUS = {
    UWS_PST_10_01_03_00: {
        url: `${SUBSCRIPTION_LINK}/${PAYMENT_LINK}`,
    },
};

export const CONFIRM_STATUS = {
    UWS_PST_10_01_04_00: {
        url: `${SUBSCRIPTION_LINK}/${CONFIRMATION_LINK}`,
    },
    UWS_PST_11_01_04_00: {
        url: `${SUBSCRIPTION_LINK}/${CONFIRMATION_LINK}`,
    },
};
