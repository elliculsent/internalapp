import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TextMaskModule} from 'angular2-text-mask';

import {SharedModule} from '@individual-modular/shared/shared.module';
import {SubscriptionRoutingModule} from './subscription-routing.module';

// Components
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {InsuredDetailsComponent} from './insured-details/insured-details.component';
import {MutualHealthComponent} from './mutual-health/mutual-health.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {SignatureComponent} from './signature/signature.component';
import {SubscriptionComponent} from './subscription.component';
import {TncComponent} from './tnc/tnc.component';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexHeaderModule} from '@uex/uex-header';
import {UexLeftMenuModule} from '@uex/uex-left-menu';

// SHARED PIPES
import {UexPipesModule} from '@uex/uex-pipes';

@NgModule({
    declarations: [
        SubscriptionComponent,
        InsuredDetailsComponent,
        MutualHealthComponent,
        PaymentMethodComponent,
        TncComponent,
        SignatureComponent,
        ConfirmationComponent,
    ],
    imports: [
        CommonModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        SubscriptionRoutingModule,
        SharedModule,
        TextMaskModule,
        AngularMyDatePickerModule,
        // SHARED MODULES
        UexBreadcrumbModule,
        UexHeaderModule,
        UexLeftMenuModule,
        UexPipesModule,
    ],
    providers: [],
})
export class SubscriptionModule {}
