import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {UexDarkMenuComponent} from './uex-dark-menu.component';

@NgModule({
    declarations: [UexDarkMenuComponent],
    imports: [CommonModule, RouterModule],
    exports: [UexDarkMenuComponent],
    providers: [],
})
export class UexDarkMenuModule {}
