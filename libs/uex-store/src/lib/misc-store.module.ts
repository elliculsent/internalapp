import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {miscReducer} from './reducers/misc.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('misc', miscReducer)],
})
export class MiscStoreModule {}
