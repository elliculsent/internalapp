import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {leadAcquisitionReducer} from './reducers/lead-acquisition.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('lead_acquisition', leadAcquisitionReducer)],
})
export class LeadAcquisitionStoreModule {}
