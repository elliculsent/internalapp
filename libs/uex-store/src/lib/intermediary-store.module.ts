import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {intermediaryReducer} from './reducers/intermediary.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('intermediary', intermediaryReducer)],
})
export class IntermediaryStoreModule {}
