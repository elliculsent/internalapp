import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Components
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {InsuredDetailsComponent} from './insured-details/insured-details.component';
import {MutualHealthComponent} from './mutual-health/mutual-health.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {SignatureComponent} from './signature/signature.component';
import {SubscriptionComponent} from './subscription.component';
import {TncComponent} from './tnc/tnc.component';

import {
    MutualHealthGuard,
    PaymentMethodGuard,
    PolicyStatusGuard,
    PriceCustoGuard,
    TncGuard,
} from '@individual-modular/guards';

import {ConfirmationEnterpriseResolver} from '@individual-modular/resolvers/confirmation-enterprise.resolver';

const routes: Routes = [
    {
        path: '',
        component: SubscriptionComponent,
        canActivate: [PriceCustoGuard],
        children: [
            {
                path: 'insured-details',
                component: InsuredDetailsComponent,
                canActivate: [PolicyStatusGuard],
            },
            {
                path: 'mutual-health',
                component: MutualHealthComponent,
                canActivate: [MutualHealthGuard, PolicyStatusGuard],
            },
            {
                path: 'payment-method',
                component: PaymentMethodComponent,
                canActivate: [MutualHealthGuard, PaymentMethodGuard, PolicyStatusGuard],
            },
            {
                path: 'tnc',
                component: TncComponent,
                canActivate: [MutualHealthGuard, PaymentMethodGuard, PolicyStatusGuard, TncGuard],
            },
            {
                path: 'signature',
                component: SignatureComponent,
            },
            {
                path: 'confirmation',
                component: ConfirmationComponent,
                canActivate: [PolicyStatusGuard],
                resolve: {
                    content: ConfirmationEnterpriseResolver,
                },
            },
            {path: '', redirectTo: 'insured-details', pathMatch: 'full'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
