import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {localeReducer} from './reducers/locale.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('locale', localeReducer)],
})
export class LocaleStoreModule {}
