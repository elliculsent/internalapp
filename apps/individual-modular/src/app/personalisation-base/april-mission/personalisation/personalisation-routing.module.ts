import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Components
import {CountryCoverageComponent} from './country-coverage/country-coverage.component';
import {CoverageInformationComponent} from './coverage-information/coverage-information.component';
import {CoverageTypeComponent} from './coverage-type/coverage-type.component';
import {OfferSummaryComponent} from './offer-summary/offer-summary.component';
import {PersonalisationComponent} from './personalisation.component';
import {ProfileDetailsComponent} from './profile-details/profile-details.component';

// Guards
import {
    CountryCoverageGuard,
    CoverageInformationGuard,
    CoverageTypeGuard,
    OfferSummaryGuard,
} from '@individual-modular/guards';

const routes: Routes = [
    {
        path: '',
        component: PersonalisationComponent,
        children: [
            {
                path: 'profile-details',
                component: ProfileDetailsComponent,
            },
            {
                path: 'coverage-type',
                component: CoverageTypeComponent,
                canActivate: [CoverageTypeGuard],
            },
            {
                path: 'coverage-information',
                component: CoverageInformationComponent,
                canActivate: [CoverageTypeGuard, CoverageInformationGuard],
            },
            {
                path: 'country-coverage',
                component: CountryCoverageComponent,
                canActivate: [CoverageTypeGuard, CoverageInformationGuard, CountryCoverageGuard],
            },
            {
                path: 'offer-summary',
                component: OfferSummaryComponent,
                canActivate: [CountryCoverageGuard, CoverageInformationGuard, CoverageTypeGuard, OfferSummaryGuard],
            },
            {path: '', redirectTo: 'profile-details', pathMatch: 'full'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PersonalisationRoutingModule {}
