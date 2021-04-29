export const environment = {
    appTitle: 'MyBusiness Travel',
    baymax_backend_root_url: 'https://baymax-eu.uexglobal.com/',
    baymax_client_id: '1zH0ZZPwKRNc7zsAuPUtEqNbHkmhZc2iKfYT2qbl',
    domain: 'april-international.com',
    origin_site: 'april-mission',
    product: {
        code: 'APRIL_MISSION',
    },
    defaults: {
        country: 'fr',
        countryLabel: 'France',
        language: 'fr',
        spinnerMessage: "L'assurance en plus facile",
    },
    phone: {
        regex: '(\\+)?\\d{10}$',
        mask: ['+', 6, 5, /\d+/, /\d+/, /\d+/, /\d+/, /\d+/, /\d+/, /\d+/, /\d+/],
    },
    cookie: {
        cookie_lib: 'cookieconsent',
        domain: 'april-international.com'
    },
    postal: {
        regex: '^\\d{5}$',
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
    },
    google_tag_manager: {
        id: 'GTM-NR6Z8F5',
    },
    intercom: {
        appId: 'zebnu1s2',
    },
    production: true,
    showFeedback: false,
    showInterCom: false,
};
