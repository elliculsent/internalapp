import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {PersonalisationBaseRoutingModule} from './personalisation-base-routing.module';
import {PersonalisationBaseComponent} from './personalisation-base.component';

@NgModule({
    declarations: [PersonalisationBaseComponent],
    imports: [CommonModule, PersonalisationBaseRoutingModule],
})
export class PersonalisationBaseModule {}
