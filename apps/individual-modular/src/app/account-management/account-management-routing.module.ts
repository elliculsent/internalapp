import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AccountManagementComponent} from './account-management.component';
import {AccountValidationComponent} from './account-validation/account-validation.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
    {
        path: '',
        component: AccountManagementComponent,
        children: [
            {
                path: 'reset-password/:token_password',
                component: ResetPasswordComponent,
            },
            {
                path: 'account-validation/:user_uuid/:token_account',
                component: AccountValidationComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountManagementRoutingModule {}
