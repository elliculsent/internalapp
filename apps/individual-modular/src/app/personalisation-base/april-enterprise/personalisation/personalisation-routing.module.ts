import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Components
import {PersonalisationComponent} from './personalisation.component';
import {PolicyDurationComponent} from './policy-duration/policy-duration.component';
import {ProfileAddressComponent} from './profile-address/profile-address.component';
import {ProfileCustomisationComponent} from './profile-customisation/profile-customisation.component';
import {ProfileDetailsComponent} from './profile-details/profile-details.component';

// Guards
import {
    PolicyDurationGuard,
    ProfileAddressGuard,
    ProfileCustomisationGuard,
    SubProfileCustomisationGuard,
} from '@individual-modular/guards';

// Resolvers
import {ProfileChildComponent} from './profile-customisation/profile-child/profile-child.component';
import {ProfileFamilyCompositionComponent} from './profile-customisation/profile-family-composition/profile-family-composition.component';
import {ProfileMyselfComponent} from './profile-customisation/profile-myself/profile-myself.component';
import {ProfileSpouseComponent} from './profile-customisation/profile-spouse/profile-spouse.component';

export const routes: Routes = [
    {
        path: '',
        component: PersonalisationComponent,
        children: [
            {
                path: 'profile-details',
                component: ProfileDetailsComponent,
            },
            {
                path: 'policy-duration',
                component: PolicyDurationComponent,
                canActivate: [PolicyDurationGuard],
            },
            {
                path: 'profile-customisation',
                component: ProfileCustomisationComponent,
                canActivate: [PolicyDurationGuard, ProfileCustomisationGuard],
                canActivateChild: [SubProfileCustomisationGuard],
                children: [
                    {
                        path: '',
                        component: ProfileFamilyCompositionComponent,
                    },
                    {
                        path: 'myself',
                        component: ProfileMyselfComponent,
                    },
                    {
                        path: 'dependant',
                        component: ProfileSpouseComponent,
                    },
                    {
                        path: 'child',
                        component: ProfileChildComponent,
                    },
                ],
            },
            {
                path: 'profile-address',
                component: ProfileAddressComponent,
                canActivate: [PolicyDurationGuard, ProfileCustomisationGuard, ProfileAddressGuard],
            },
            {path: '', redirectTo: 'profile-details', pathMatch: 'full'},
            {path: '**', redirectTo: 'profile-details'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PersonalisationRoutingModule {}
