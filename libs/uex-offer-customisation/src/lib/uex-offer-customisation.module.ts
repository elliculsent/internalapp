import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';

import {UexOfferCustomisationComponent} from './uex-offer-customisation.component';

@NgModule({
    declarations: [UexOfferCustomisationComponent],
    imports: [CommonModule, MatExpansionModule, ReactiveFormsModule],
    exports: [UexOfferCustomisationComponent],
})
export class UexOfferCustomisationModule {}
