import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';

import {SharedModule} from '@individual-modular/shared/shared.module';
import {PersonalisationRoutingModule} from './personalisation-routing.module';

// Components
import {CountryCoverageComponent} from './country-coverage/country-coverage.component';
import {CoverageInformationComponent} from './coverage-information/coverage-information.component';
import {CoverageTypeComponent} from './coverage-type/coverage-type.component';
import {OfferSummaryComponent} from './offer-summary/offer-summary.component';
import {PersonalisationComponent} from './personalisation.component';
import {ProfileDetailsComponent} from './profile-details/profile-details.component';

// SHARED COMPONENTS MODULE
import {UexBreadcrumbModule} from '@uex/uex-breadcrumb';
import {UexHeaderModule} from '@uex/uex-header';
import {UexLeftMenuModule} from '@uex/uex-left-menu';
import {UexTelInputModule} from '@uex/uex-tel-input';

@NgModule({
    declarations: [
        CountryCoverageComponent,
        CoverageInformationComponent,
        CoverageTypeComponent,
        OfferSummaryComponent,
        PersonalisationComponent,
        ProfileDetailsComponent,
    ],
    imports: [
        AngularMyDatePickerModule,
        CommonModule,
        MatAutocompleteModule,
        MatSelectModule,
        PersonalisationRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        UexBreadcrumbModule,
        UexHeaderModule,
        UexLeftMenuModule,
        UexTelInputModule,
    ],
    providers: [],
})
export class PersonalisationModule {}
