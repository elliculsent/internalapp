import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CustomisationComponent} from './customisation/customisation.component';
import {QuotationComponent} from './quotation.component';

// Resolvers
import {PriceCustoResolver, SummaryResolver} from '@individual-modular/resolvers/index';

const routes: Routes = [
    {
        path: '',
        component: QuotationComponent,
        children: [
            {
                path: 'customisation',
                component: CustomisationComponent,
                resolve: {
                    summary: SummaryResolver,
                    priceCusto: PriceCustoResolver,
                },
            },
            {path: '', redirectTo: 'customisation', pathMatch: 'full'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuotationRoutingModule {}
