import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {QuotationComponent} from './quotation.component';

import {CivicResponsabilityComponent} from './civic-responsability/civic-responsability.component';
import {CoverageCardComponent} from './coverage-card/coverage-card.component';
import {DeathInvalidityComponent} from './death-invalidity/death-invalidity.component';
import {InjuryTableComponent} from './injury-table/injury-table.component';
import {MedicalFeesComponent} from './medical-fees/medical-fees.component';
import {SecurityComponent} from './security/security.component';
import {TravelServicesComponent} from './travel-services/travel-services.component';

// Resolvers
import {PriceResolver, QuotationContentResolver} from '@individual-modular/resolvers/index';

const routes: Routes = [
    {
        path: '',
        component: QuotationComponent,
        resolve: {
            price: PriceResolver,
        },
        children: [
            {
                path: 'coverages',
                component: CoverageCardComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {
                path: 'crisis-security',
                component: SecurityComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {
                path: 'invalidity-accidents',
                component: DeathInvalidityComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {
                path: 'civic-responsability',
                component: CivicResponsabilityComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {
                path: 'injury',
                component: InjuryTableComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {
                path: 'travel-services',
                component: TravelServicesComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {
                path: 'medical-fees',
                component: MedicalFeesComponent,
                resolve: {
                    content: QuotationContentResolver,
                },
            },
            {path: '', redirectTo: 'coverages', pathMatch: 'full'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuotationRoutingModule {}
