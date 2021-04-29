import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FOOTER_COMPONENT, HEADER_COMPONENT} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {BrowserNotSupportedGuard, LocaleGuard} from '@uex/uex-guards';
import {ComponentsResolver} from '@uex/uex-resolvers';

const defLangNCountry = `${environment.defaults.language}-${environment.defaults.country}`;

const routes: Routes = [
    {
        path: ':langNcountry/account-management',
        loadChildren: () =>
            import('./account-management/account-management.module').then((m) => m.AccountManagementModule),
        canActivate: [BrowserNotSupportedGuard, LocaleGuard],
        resolve: {
            resolvedData: ComponentsResolver,
        },
        data: {components: [FOOTER_COMPONENT, HEADER_COMPONENT], environment},
    },
    {
        path: 'browser-not-supported',
        canActivate: [BrowserNotSupportedGuard],
        loadChildren: () => import('@uex/uex-browser-not-supported').then((m) => m.UexBrowserNotSupportedModule),
    },
    {
        path: ':langNcountry/personalisation',
        loadChildren: () =>
            import('./personalisation-base/personalisation-base.module').then((m) => m.PersonalisationBaseModule),
        canActivate: [BrowserNotSupportedGuard, LocaleGuard],
        data: {environment},
    },
    {
        path: ':langNcountry/quotation',
        loadChildren: () => import('./quotation-base/quotation-base.module').then((m) => m.QuotationBaseModule),
        canActivate: [BrowserNotSupportedGuard, LocaleGuard],
        data: {environment},
    },
    {
        path: ':langNcountry/subscription',
        loadChildren: () =>
            import('./subscription-base/subscription-base.module').then((m) => m.SubscriptionBaseModule),
        canActivate: [BrowserNotSupportedGuard, LocaleGuard],
        data: {environment},
    },
    {
        path: '**',
        redirectTo: `${defLangNCountry}/personalisation`,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
