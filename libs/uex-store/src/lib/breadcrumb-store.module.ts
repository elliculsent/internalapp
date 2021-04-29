import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {breadcrumbReducer} from './reducers/breadcrumb.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('breadcrumb', breadcrumbReducer)],
})
export class BreadcrumbStoreModule {}
