import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '@individual-modular/shared/shared.module';
import {QuotationRoutingModule} from './quotation-routing.module';

import {CivicResponsabilityComponent} from './civic-responsability/civic-responsability.component';
import {CoverageCardComponent} from './coverage-card/coverage-card.component';
import {DeathInvalidityComponent} from './death-invalidity/death-invalidity.component';
import {InjuryTableComponent} from './injury-table/injury-table.component';
import {MedicalFeesComponent} from './medical-fees/medical-fees.component';
import {QuotationComponent} from './quotation.component';
import {SecurityComponent} from './security/security.component';
import {TravelServicesComponent} from './travel-services/travel-services.component';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexHeaderModule} from '@uex/uex-header';
import {UexLeftMenuModule} from '@uex/uex-left-menu';

@NgModule({
    declarations: [
        CivicResponsabilityComponent,
        CoverageCardComponent,
        InjuryTableComponent,
        QuotationComponent,
        SecurityComponent,
        MedicalFeesComponent,
        DeathInvalidityComponent,
        TravelServicesComponent,
    ],
    imports: [
        CommonModule,
        QuotationRoutingModule,
        SharedModule,
        UexBreadcrumbModule,
        UexHeaderModule,
        UexLeftMenuModule,
    ],
    providers: [],
})
export class QuotationModule {}
