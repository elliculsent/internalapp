import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
    public config: any;
    public errors: any;
    public signupForm: FormGroup;

    constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SignupComponent>) {
        this.errors = {
            email: null,
            password: null,
            confirmPassword: null,
            passwordMatch: null,
            confirmPasswordMatch: null,
        };
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.signupForm = this.fb.group({
            email: [
                null,
                Validators.compose([
                    Validators.email,
                    Validators.pattern(
                        '^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$'
                    ),
                    Validators.required,
                ]),
            ],
            password: [null, Validators.required],
            confirmPassword: [null, Validators.required],
        });
    }

    signUp(): void {
        const controls = this.signupForm.controls;
        if (this.validateForm(controls)) {
            this.dialogRef.close(this.signupForm.value);
        }
    }

    login(): void {
        this.dialogRef.close('login');
    }

    private validateForm(controls: any): boolean {
        for (const i in controls) {
            if (controls[i].errors) {
                this.errors[i] = controls[i].errors;
            } else {
                delete this.errors[i];
            }
        }

        if (controls.password.value !== controls.confirmPassword.value) {
            this.errors.passwordMatch = true;
            this.errors.confirmPasswordMatch = true;
            return false;
        } else {
            this.errors.passwordMatch = false;
            this.errors.confirmPasswordMatch = false;
            if (
                this.errors.hasOwnProperty('email') ||
                this.errors.hasOwnProperty('password') ||
                this.errors.hasOwnProperty('confirmPassword')
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
}
