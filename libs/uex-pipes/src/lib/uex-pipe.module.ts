import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {SafePipe} from './safe.pipe';

@NgModule({
    declarations: [SafePipe],
    imports: [CommonModule, HttpClientModule],
    exports: [SafePipe],
})
export class UexPipesModule {}
