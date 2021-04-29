import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {APRIL_ENTERPRISE, APRIL_MISSION, FOOTER_COMPONENT, HEADER_COMPONENT} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {AuthGuard, QuotationGuard} from '@individual-modular/guards';
import {ComponentsResolver} from '@uex/uex-resolvers';

const modules: any = {};
switch (environment.product.code) {
    case APRIL_ENTERPRISE:
        modules.subscription = import('./april-enterprise/subscription/subscription.module');
        break;
    case APRIL_MISSION:
        modules.subscription = import('./april-mission/subscription/subscription.module');
        break;
}

const routes: Routes = [
    {
        path: '',
        loadChildren: () => modules.subscription.then((m: any) => m.SubscriptionModule),
        canActivate: [AuthGuard, QuotationGuard],
        resolve: {
            resolvedData: ComponentsResolver,
        },
        data: {components: [FOOTER_COMPONENT, HEADER_COMPONENT]},
    },
    {path: '**', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubscriptionBaseRoutingModule {}
