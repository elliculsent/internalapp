/* eslint-disable no-prototype-builtins */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public config: any;
    public errors: any;
    public loginForm: FormGroup;

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<LoginComponent>) {
        this.errors = {
            email: null,
            password: null,
        };
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.loginForm = this.fb.group({
            email: [
                null,
                Validators.compose([
                    Validators.email,
                    Validators.pattern('^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$'),
                    Validators.required,
                ]),
            ],
            password: [null, Validators.required],
        });
    }

    submitLogin(): void {
        const controls = this.loginForm.controls;
        if (this.validateForm(controls)) {
            this.dialogRef.close(this.loginForm.value);
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
        if (this.errors.hasOwnProperty('email') || this.errors.hasOwnProperty('password')) {
            return false;
        } else {
            return true;
        }
    }

    forgotPassword(): void {
        this.dialogRef.close({dialog: 'forgotpassword', email: this.loginForm.get('email').value});
    }

    signup(): void {
        this.dialogRef.close('signup');
    }
}
