import {CommonModule} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';

// GUARDS
import {
    AuthGuard,
    CountryCoverageGuard,
    CoverageInformationGuard,
    CoverageTypeGuard,
    MutualHealthGuard,
    OfferSummaryGuard,
    PaymentMethodGuard,
    PaymentStatusGuard,
    PolicyDurationGuard,
    PolicyStatusGuard,
    PriceCustoGuard,
    ProfileAddressGuard,
    ProfileCustomisationGuard,
    ProfileDataDetailsGuard,
    QuotationGuard,
    SharedOfferGuard,
    SubProfileCustomisationGuard,
    TncGuard,
} from './guards/index';

// INTERCEPTOR
import {HttpErrorInterceptor} from './interceptors/http-error.interceptor';

// RESOLVERS
import {
    ConfirmationEnterpriseResolver,
    ConfirmationResolver,
    PaymentResolver,
    PriceCustoResolver,
    PriceResolver,
    QuotationContentResolver,
    SummaryResolver,
} from './resolvers/index';

// SERVICES
import {FlowService} from './services/flow.service';
import {FormService} from './services/form.service';
import {PriceService} from './services/price.service';
import {UtilsService} from './services/utils.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    exports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
        // GUARDS
        AuthGuard,
        CountryCoverageGuard,
        CoverageInformationGuard,
        CoverageTypeGuard,
        MutualHealthGuard,
        OfferSummaryGuard,
        PaymentMethodGuard,
        PaymentStatusGuard,
        PolicyDurationGuard,
        PolicyStatusGuard,
        PriceCustoGuard,
        ProfileAddressGuard,
        ProfileCustomisationGuard,
        ProfileDataDetailsGuard,
        QuotationGuard,
        SharedOfferGuard,
        SubProfileCustomisationGuard,
        TncGuard,
        //RESOLVERS
        ConfirmationEnterpriseResolver,
        ConfirmationResolver,
        PaymentResolver,
        PriceCustoResolver,
        PriceResolver,
        QuotationContentResolver,
        SummaryResolver,
        // SERVICES
        FlowService,
        FormService,
        PriceService,
        UtilsService,
    ],
})
export class SharedModule {}
