// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    appTitle: 'APRIL Entreprise',
    baymax_backend_root_url: 'http://localhost:8000/',
    baymax_client_id: 'SUzVXzxmkV0Nc4AEdurN6mjLMG89K7o3qI0KMYpY',
    domain: 'localhost',
    origin_site: 'april-enterprise',
    product: {
        code: 'APRIL_ENTERPRISE',
    },
    defaults: {
        country: 'fr',
        countryLabel: 'France',
        language: 'fr',
        spinnerMessage: `L'assurance en plus facile`,
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
        domain: 'localhost'
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
