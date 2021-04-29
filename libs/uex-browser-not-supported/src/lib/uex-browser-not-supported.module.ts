import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';

import {UexBrowserNotSupportedRoutingModule} from './uex-browser-not-supported-routing.module';
import {UexBrowserNotSupportedComponent} from './uex-browser-not-supported.component';

@NgModule({
    declarations: [UexBrowserNotSupportedComponent],
    imports: [CommonModule, MatDialogModule, UexBrowserNotSupportedRoutingModule],
    exports: [UexBrowserNotSupportedComponent],
})
export class UexBrowserNotSupportedModule {}
