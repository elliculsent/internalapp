import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {UexSnackbarComponent} from './uex-snackbar.component';

@NgModule({
    declarations: [UexSnackbarComponent],
    imports: [CommonModule],
    exports: [UexSnackbarComponent],
})
export class UexSnackbarModule {}
