import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {APRIL_ENTERPRISE, APRIL_MHI, APRIL_MISSION, FOOTER_COMPONENT, HEADER_COMPONENT} from '@uex/uex-constants';
import {environment} from '@individual-modular/environment/environment';
import {PolicyStatusGuard, SharedOfferGuard} from '@individual-modular/guards';
import {ComponentsResolver} from '@uex/uex-resolvers';

const modules: any = {};
switch (environment.product.code) {
    case APRIL_ENTERPRISE:
        modules.personalisation = import('./april-enterprise/personalisation/personalisation.module');
        break;
    case APRIL_MISSION:
        modules.personalisation = import('./april-mission/personalisation/personalisation.module');
        break;
}

const routes: Routes = [
    {
        path: '',
        loadChildren: () => modules.personalisation.then((m) => m.PersonalisationModule),
        canActivate: [SharedOfferGuard, PolicyStatusGuard],
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
export class PersonalisationBaseRoutingModule {}
