import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SubscriptionBaseRoutingModule} from './subscription-base-routing.module';
import {SubscriptionBaseComponent} from './subscription-base.component';

@NgModule({
    declarations: [SubscriptionBaseComponent],
    imports: [CommonModule, SubscriptionBaseRoutingModule],
})
export class SubscriptionBaseModule {}
