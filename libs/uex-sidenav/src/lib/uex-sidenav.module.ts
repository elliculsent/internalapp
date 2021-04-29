import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {UexSidenavComponent} from './uex-sidenav.component';

@NgModule({
    declarations: [UexSidenavComponent],
    imports: [CommonModule],
    exports: [UexSidenavComponent],
    providers: [],
})
export class UexSidenavModule {}
