import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {userDataReducer} from './reducers/user.reducer';
// import {EntityPolicyEffects} from './effects/index';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature('user_data', userDataReducer), EffectsModule.forFeature([])],
})
export class UserStoreModule {}
