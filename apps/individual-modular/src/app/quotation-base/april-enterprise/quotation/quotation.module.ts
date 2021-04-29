import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {SharedModule} from '@individual-modular/shared/shared.module';
import {QuotationRoutingModule} from './quotation-routing.module';

import {CustomisationComponent} from './customisation/customisation.component';
import {QuotationComponent} from './quotation.component';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexCoverageDetailsModule} from '@uex/uex-coverage-details';
import {UexHeaderModule} from '@uex/uex-header';
import {UexOfferCustomisationModule} from '@uex/uex-offer-customisation';
import {UexQuoteSummaryModule} from '@uex/uex-quote-summary';

@NgModule({
    declarations: [QuotationComponent, CustomisationComponent],
    imports: [
        CommonModule,
        MatExpansionModule,
        MatSnackBarModule,
        QuotationRoutingModule,
        SharedModule,
        UexBreadcrumbModule,
        UexCoverageDetailsModule,
        UexHeaderModule,
        UexOfferCustomisationModule,
        UexQuoteSummaryModule,
    ],
    providers: [],
})
export class QuotationModule {}
