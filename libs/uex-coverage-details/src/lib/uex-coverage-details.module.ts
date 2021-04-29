import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

import {UexCoverageDetailsComponent} from './uex-coverage-details.component';

@NgModule({
    declarations: [UexCoverageDetailsComponent],
    imports: [CommonModule, MatExpansionModule],
    exports: [UexCoverageDetailsComponent],
})
export class UexCoverageDetailsModule {}
