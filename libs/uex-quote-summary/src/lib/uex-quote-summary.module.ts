import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

import {UexQuoteSummaryComponent} from './uex-quote-summary.component';

@NgModule({
    declarations: [UexQuoteSummaryComponent],
    imports: [CommonModule, MatExpansionModule],
    exports: [UexQuoteSummaryComponent],
})
export class UexQuoteSummaryModule {}
