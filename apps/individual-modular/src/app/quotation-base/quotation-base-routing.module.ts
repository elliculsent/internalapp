import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {APRIL_ENTERPRISE, APRIL_MHI, APRIL_MISSION, FOOTER_COMPONENT, HEADER_COMPONENT} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {PolicyStatusGuard, QuotationGuard} from '@individual-modular/guards';
import {ComponentsResolver} from '@uex/uex-resolvers';

const modules: any = {};
switch (environment.product.code) {
    case APRIL_ENTERPRISE:
        modules.quotation = import('./april-enterprise/quotation/quotation.module');
        break;
    case APRIL_MISSION:
        modules.quotation = import('./april-mission/quotation/quotation.module');
        break;
}

const routes: Routes = [
    {
        path: '',
        loadChildren: () => modules.quotation.then((m) => m.QuotationModule),
        canActivate: [PolicyStatusGuard, QuotationGuard], // Do not change the order!!
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
export class QuotationBaseRoutingModule {}
