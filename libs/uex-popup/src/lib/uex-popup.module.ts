import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

// ANGULAR MATERIAL MODULES
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

// COMPONENTS
import {UexTelInputModule} from '@uex/uex-tel-input';
import {AlertComponent} from './alert/alert.component';
import {ConfirmComponent} from './confirm/confirm.component';
import {ErrorComponent} from './error/error.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {GuideAcquisitionComponent} from './guide-acquisition/guide-acquisition.component';
import {InfoComponent} from './info/info.component';
import {LanguageNCountryComponent} from './language-n-country/language-n-country.component';
import {LeadAcquisitionComponent} from './lead-acquisition/lead-acquisition.component';
import {LoginFunnelsComponent} from './login-funnels/login-funnels.component';
import {LoginComponent} from './login/login.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {SignupComponent} from './signup/signup.component';

// SERVICES
import {UexPopupService} from './uex-popup.service';

@NgModule({
    declarations: [
        AlertComponent,
        ConfirmComponent,
        ErrorComponent,
        ForgotPasswordComponent,
        GuideAcquisitionComponent,
        InfoComponent,
        LanguageNCountryComponent,
        LeadAcquisitionComponent,
        LoginFunnelsComponent,
        LoginComponent,
        ResetPasswordComponent,
        SignupComponent,
    ],
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, UexTelInputModule],
    providers: [UexPopupService],
})
export class UexPopupModule {}
