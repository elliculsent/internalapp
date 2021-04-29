export const environment = {
    appTitle: 'APRIL Entreprise',
    baymax_backend_root_url: 'https://baymax-preproduction-eu.uexglobal.com/',
    baymax_client_id: '1zH0ZZPwKRNc7zsAuPUtEqNbHkmhZc2iKfYT2qbl',
    domain: 'uexglobal.com',
    origin_site: 'april-enterprise',
    product: {
        code: 'APRIL_ENTERPRISE',
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
    postal: {
        regex: '^\\d{5}$',
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
    },
    cookie: {
        cookie_lib: 'cookieconsent',
        domain: 'april-international.com'
    },
    google_tag_manager: {
        id: 'GTM-NR6Z8F5',
        audience: 'b2c',
    },
    intercom: {
        appId: 'zebnu1s2',
    },
    production: false,
    showFeedback: true,
    showInterCom: false,
};
