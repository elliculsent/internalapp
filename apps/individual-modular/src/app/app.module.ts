import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

// NODE MODULES
import {IntercomModule} from 'ng-intercom';
import {ClipboardModule} from 'ngx-clipboard';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {NgxSpinnerModule} from 'ngx-spinner';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UexServicesModule} from '@uex/uex-services';
import {environment} from '../environments/environment';

import {
    LeadAcquisitionEffects,
    PersonalisationEffects,
    ProductEffects,
    ProfileCustomisationEffects,
    SubscriptionEffects,
    UserEffects,
} from '@individual-modular/effects';
import {metaReducers, reducers} from '@individual-modular/reducers';
import {SharedModule} from '../shared/shared.module';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexDarkMenuModule} from '@uex/uex-dark-menu';
import {UexPopupModule} from '@uex/uex-popup';
import {UexSidenavModule} from '@uex/uex-sidenav';

// SHARED STORE MODULE
import {
    BreadcrumbStoreModule,
    EntityPolicyStoreModule,
    GenericObjectsStoreModule,
    LeftMenuStoreModule,
    LocaleStoreModule,
    MiscStoreModule,
    UserStoreModule,
} from '@uex/uex-store';

// SHARED GUARDS
import {BrowserNotSupportedGuard, LocaleGuard} from '@uex/uex-guards';

// SHARED PIPES
import {UexPipesModule} from '@uex/uex-pipes';

// SHARED RESOLVERS
import {ComponentsResolver} from '@uex/uex-resolvers';

registerLocaleData(localeFr, 'fr');

let enableCookieConsent = false;

if(environment.cookie.cookie_lib === 'cookieconsent'){
    enableCookieConsent = true;
}

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: environment.domain,
    },
    position: 'bottom',
    theme: 'classic',
    enabled: enableCookieConsent,
    palette: {
        popup: {
            background: '#F2F2F2',
            text: '#363636',
            link: '#363636',
        },
        button: {
            background: '#2188E6',
            text: '#ffffff',
        },
        highlight: {
            background: '#2188E6',
            border: '#2188E6',
            text: '#ffffff',
        },
    },
    type: 'info',
    content: {
        message:
            'Nous utilisons des cookies et traceurs sur cette application, y compris des cookies tiers, à des fins de fonctionnement de l’application et de réalisation d’analyses statistiques. Vous pouvez accepter ces cookies de manière globale en cliquant sur « Accepter » . Pour en savoir plus sur notre politique en matière de cookies et traceurs, consultez notre ',
        dismiss: 'Accepter',
        link: 'Politique Données Personnelles et cookies.',
        href: 'javascript:void(0);',
        policy: 'Cookie Policy',
    },
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ClipboardModule,
        IntercomModule.forRoot({
            // from your Intercom config
            appId: environment.intercom.appId,
            // will automatically run `update` on router event changes. Default: `false`
            updateOnRouterChange: true,
        }),
        MatSidenavModule,
        NgcCookieConsentModule.forRoot(cookieConfig),
        NgxSpinnerModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        SharedModule,
        // UEX SHARED COMPONENTS MODULE
        UexBreadcrumbModule,
        UexDarkMenuModule,
        UexPipesModule,
        UexPopupModule,
        UexServicesModule,
        UexSidenavModule,

        // UEX SHARED STORE MODULES
        BreadcrumbStoreModule,
        EntityPolicyStoreModule,
        GenericObjectsStoreModule,
        LeftMenuStoreModule,
        LocaleStoreModule,
        MiscStoreModule,
        UserStoreModule,

        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictActionImmutability: false,
                strictStateImmutability: false,
            },
        }),
        EffectsModule.forRoot([
            LeadAcquisitionEffects,
            PersonalisationEffects,
            ProductEffects,
            ProfileCustomisationEffects,
            SubscriptionEffects,
            UserEffects,
        ]),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreRouterConnectingModule.forRoot(),
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'fr-FR'},
        // GUARDS
        BrowserNotSupportedGuard,
        LocaleGuard,
        // RESOLVERS
        ComponentsResolver,
        // NODE MODULES
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {}
