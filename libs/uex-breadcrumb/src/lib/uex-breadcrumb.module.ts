import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {UexBreadcrumbComponent} from './uex-breadcrumb.component';

@NgModule({
    declarations: [UexBreadcrumbComponent],
    imports: [CommonModule, RouterModule],
    exports: [UexBreadcrumbComponent],
})
export class UexBreadcrumbModule {}
