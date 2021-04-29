import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {TextMaskModule} from 'angular2-text-mask';

import {SharedModule} from '@individual-modular/shared/shared.module';
import {SubscriptionRoutingModule} from './subscription-routing.module';
import {SubscriptionComponent} from './subscription.component';

// Components
import {ConfirmationAprilComponent} from './confirmation/confirmation-april/confirmation-april.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {InsuredDetailsComponent} from './insured-details/insured-details.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {PaymentAprilComponent} from './payment/payment-april/payment-april.component';
import {PaymentComponent} from './payment/payment.component';
import {ProfileDataDetailsComponent} from './profile-data-details/profile-data-details.component';
import {SignatureComponent} from './signature/signature.component';
import {TncComponent} from './tnc/tnc.component';

// Directive
import {ConfirmationDirective} from './confirmation/confirmation.directive';
import {PaymentDirective} from './payment/payment.directive';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexHeaderModule} from '@uex/uex-header';
import {UexLeftMenuModule} from '@uex/uex-left-menu';
import {UexTelInputModule} from '@uex/uex-tel-input';

@NgModule({
    declarations: [
        InsuredDetailsComponent,
        PaymentMethodComponent,
        TncComponent,
        SubscriptionComponent,
        PaymentComponent,
        PaymentAprilComponent,
        ConfirmationComponent,
        ConfirmationAprilComponent,
        SignatureComponent,
        PaymentDirective,
        ConfirmationDirective,
        ProfileDataDetailsComponent,
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
        UexTelInputModule,
    ],
    providers: [],
})
export class SubscriptionModule {}
