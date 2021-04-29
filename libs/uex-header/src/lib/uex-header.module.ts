import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {UexHeaderComponent} from './uex-header.component';

@NgModule({
    declarations: [UexHeaderComponent],
    imports: [CommonModule, RouterModule],
    exports: [UexHeaderComponent],
})
export class UexHeaderModule {}
