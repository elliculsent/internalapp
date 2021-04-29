import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ConfirmationComponent} from './confirmation/confirmation.component';
import {InsuredDetailsComponent} from './insured-details/insured-details.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {PaymentComponent} from './payment/payment.component';
import {ProfileDataDetailsComponent} from './profile-data-details/profile-data-details.component';
import {SignatureComponent} from './signature/signature.component';
import {SubscriptionComponent} from './subscription.component';
import {TncComponent} from './tnc/tnc.component';

// Guards
import {
    PaymentMethodGuard,
    PaymentStatusGuard,
    PolicyStatusGuard,
    ProfileDataDetailsGuard,
    TncGuard,
} from '@individual-modular/guards';

import {ConfirmationResolver, PaymentResolver, PriceResolver} from '@individual-modular/resolvers/index';

const routes: Routes = [
    {
        path: '',
        component: SubscriptionComponent,
        children: [
            {
                path: 'insured-details',
                component: InsuredDetailsComponent,
                canActivate: [PaymentStatusGuard, PolicyStatusGuard],
            },
            {
                path: 'profile-data-details',
                component: ProfileDataDetailsComponent,
                canActivate: [ProfileDataDetailsGuard, PaymentStatusGuard, PolicyStatusGuard],
            },
            {
                path: 'payment-method',
                component: PaymentMethodComponent,
                canActivate: [ProfileDataDetailsGuard, PaymentMethodGuard, PaymentStatusGuard, PolicyStatusGuard],
            },
            {
                path: 'tnc',
                component: TncComponent,
                canActivate: [
                    ProfileDataDetailsGuard,
                    PaymentMethodGuard,
                    TncGuard,
                    PaymentStatusGuard,
                    PolicyStatusGuard,
                ],
            },
            {
                path: 'signature',
                component: SignatureComponent,
                canActivate: [ProfileDataDetailsGuard, PaymentMethodGuard, TncGuard, PolicyStatusGuard],
            },
            {
                path: 'payment',
                component: PaymentComponent,
                canActivate: [ProfileDataDetailsGuard, PaymentMethodGuard, TncGuard, PolicyStatusGuard],
                resolve: {
                    content: PaymentResolver,
                },
            },
            {
                path: 'confirmation',
                component: ConfirmationComponent,
                canActivate: [PolicyStatusGuard],
                resolve: {
                    content: ConfirmationResolver,
                    price: PriceResolver,
                },
            },
            {path: '', redirectTo: 'insured-details'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
