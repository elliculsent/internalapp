import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {AcquisitionService} from './acquisition.service';
import {AuthService} from './auth.service';
import {GoogleTagManagerService} from './google-tag-manager.service';
import {PolicyService} from './policy.service';
import {ProductService} from './product.service';
import {SpinnerService} from './spinner.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [
        AcquisitionService,
        AuthService,
        GoogleTagManagerService,
        PolicyService,
        ProductService,
        SpinnerService,
    ],
})
export class UexServicesModule {}
