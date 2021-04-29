import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {entityPolicyReducer} from './reducers/entity-policy.reducer';
// import {EntityPolicyEffects} from './effects/index';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('entity_policy', entityPolicyReducer), EffectsModule.forFeature([])],
})
export class EntityPolicyStoreModule {}
