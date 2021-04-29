import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    public config: any;
    public errors: any;
    public forgotPasswordForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ForgotPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.errors = {
            email: null,
        };
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.forgotPasswordForm = this.fb.group({
            email: [
                this.data ? this.data : null,
                Validators.compose([
                    Validators.email,
                    Validators.pattern(
                        '^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$'
                    ),
                    Validators.required,
                ]),
            ],
        });
    }

    resetPassword(): void {
        const controls = this.forgotPasswordForm.controls;
        if (this.validateForm(controls)) {
            this.dialogRef.close(this.forgotPasswordForm.value);
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
        if (this.errors.hasOwnProperty('email')) {
            return false;
        } else {
            return true;
        }
    }
}
