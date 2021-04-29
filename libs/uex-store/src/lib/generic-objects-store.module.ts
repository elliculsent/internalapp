import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {genericObjectsReducer} from './reducers/generic-objects.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('generic_objects', genericObjectsReducer)],
})
export class GenericObjectsStoreModule {}
