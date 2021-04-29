import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {QuotationBaseRoutingModule} from './quotation-base-routing.module';
import {QuotationBaseComponent} from './quotation-base.component';

@NgModule({
    declarations: [QuotationBaseComponent],
    imports: [CommonModule, QuotationBaseRoutingModule],
})
export class QuotationBaseModule {}
