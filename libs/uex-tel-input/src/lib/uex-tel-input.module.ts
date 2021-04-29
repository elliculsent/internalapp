import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TextMaskModule} from 'angular2-text-mask';
import {Ng2TelInputModule} from 'ng2-tel-input';

import {UexTelInputComponent} from './uex-tel-input.component';

@NgModule({
    declarations: [UexTelInputComponent],
    imports: [CommonModule, TextMaskModule, Ng2TelInputModule],
    exports: [UexTelInputComponent],
})
export class UexTelInputModule {}
