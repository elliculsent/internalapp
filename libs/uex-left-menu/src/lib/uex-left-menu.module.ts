import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {UexLeftMenuComponent} from './uex-left-menu.component';

@NgModule({
    declarations: [UexLeftMenuComponent],
    imports: [CommonModule, RouterModule],
    exports: [UexLeftMenuComponent],
})
export class UexLeftMenuModule {}
