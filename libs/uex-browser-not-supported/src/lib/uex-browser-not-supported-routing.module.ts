import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UexBrowserNotSupportedComponent} from './uex-browser-not-supported.component';

const routes: Routes = [
    {
        path: '',
        component: UexBrowserNotSupportedComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UexBrowserNotSupportedRoutingModule {}
