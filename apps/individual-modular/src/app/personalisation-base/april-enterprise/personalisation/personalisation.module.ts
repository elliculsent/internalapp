import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';

import {SharedModule} from '@individual-modular/shared/shared.module';
import {PersonalisationRoutingModule} from './personalisation-routing.module';

// Components
import {PersonalisationComponent} from './personalisation.component';
import {PolicyDurationComponent} from './policy-duration/policy-duration.component';
import {ProfileAddressComponent} from './profile-address/profile-address.component';
import {ProfileChildComponent} from './profile-customisation/profile-child/profile-child.component';
import {ProfileCustomisationComponent} from './profile-customisation/profile-customisation.component';
import {ProfileFamilyCompositionComponent} from './profile-customisation/profile-family-composition/profile-family-composition.component';
import {ProfileMyselfComponent} from './profile-customisation/profile-myself/profile-myself.component';
import {ProfileSpouseComponent} from './profile-customisation/profile-spouse/profile-spouse.component';
import {ProfileDetailsComponent} from './profile-details/profile-details.component';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexHeaderModule} from '@uex/uex-header';
import {UexLeftMenuModule} from '@uex/uex-left-menu';
import {UexTelInputModule} from '@uex/uex-tel-input';

// SHARED PIPES
import {UexPipesModule} from '@uex/uex-pipes';

@NgModule({
    declarations: [
        PersonalisationComponent,
        ProfileDetailsComponent,
        PolicyDurationComponent,
        ProfileCustomisationComponent,
        ProfileAddressComponent,
        ProfileMyselfComponent,
        ProfileSpouseComponent,
        ProfileChildComponent,
        ProfileFamilyCompositionComponent,
    ],
    imports: [
        AngularMyDatePickerModule,
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatSelectModule,
        PersonalisationRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        UexBreadcrumbModule,
        UexHeaderModule,
        UexLeftMenuModule,
        UexPipesModule,
        UexTelInputModule,
    ],
})
export class PersonalisationModule {}
