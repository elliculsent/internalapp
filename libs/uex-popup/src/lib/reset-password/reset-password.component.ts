/* eslint-disable no-prototype-builtins */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    public resetPasswordForm: FormGroup;
    public errors: any;

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ResetPasswordComponent>) {
        this.errors = {
            // oldPassword: null,
            newPassword: null,
            confirmNewPassword: null,
            newPasswordMatch: null,
            confirmNewPasswordMatch: null,
        };
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.resetPasswordForm = this.fb.group({
            // oldPassword: [null, Validators.required],
            newPassword: [null, Validators.required],
            confirmNewPassword: [null, Validators.required],
        });
    }

    resetPassword(): void {
        const controls = this.resetPasswordForm.controls;
        if (this.validateForm(controls)) {
            this.dialogRef.close(this.resetPasswordForm.value);
        }
    }

    private validateForm(controls: any): boolean {
        for (const i in controls) {
            if (controls[i].errors) {
                this.errors[i] = controls[i].errors;
            } else {
                delete this.errors[i];
            }
        }

        if (controls.newPassword.value !== controls.confirmNewPassword.value) {
            this.errors.newPasswordMatch = true;
            this.errors.confirmNewPasswordMatch = true;
            return false;
        } else {
            this.errors.newPasswordMatch = false;
            this.errors.confirmNewPasswordMatch = false;
            if (
                // this.errors.hasOwnProperty('oldPassword') ||
                this.errors.hasOwnProperty('newPassword') ||
                this.errors.hasOwnProperty('confirmNewPassword')
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
}
