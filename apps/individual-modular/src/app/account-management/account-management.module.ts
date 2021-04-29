import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AccountManagementRoutingModule} from './account-management-routing.module';

// MODULES
import {UexHeaderModule} from '@uex/uex-header';

// Components
import {AccountManagementComponent} from './account-management.component';
import {AccountValidationComponent} from './account-validation/account-validation.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

@NgModule({
    declarations: [AccountManagementComponent, ResetPasswordComponent, AccountValidationComponent],
    imports: [CommonModule, AccountManagementRoutingModule, UexHeaderModule],
})
export class AccountManagementModule {}
