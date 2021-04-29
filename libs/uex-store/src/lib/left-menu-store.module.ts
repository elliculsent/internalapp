import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {leftMenuReducer} from './reducers/left-menu.reducer';
import {LeftMenuEffects} from './effects/index';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('left_menu', leftMenuReducer),
        EffectsModule.forFeature([LeftMenuEffects]),
    ],
})
export class LeftMenuStoreModule {}
