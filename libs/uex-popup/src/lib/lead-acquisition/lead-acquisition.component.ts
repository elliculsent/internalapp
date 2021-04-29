import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-lead-acquisition',
    templateUrl: './lead-acquisition.component.html',
    styleUrls: ['./lead-acquisition.component.scss'],
})
export class LeadAcquisitionComponent implements OnInit {
    public config: any;
    public showArrow: boolean;
    public leadAcquisitionForm: FormGroup;
    public errors: any;
    public selectedCountry: string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<LeadAcquisitionComponent>
    ) {
        this.errors = {
            email: null,
            name: null,
            contactNumber: null,
        };
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.leadAcquisitionForm = this.fb.group({
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
            name: [null, Validators.required],
            contactNumber: [null, Validators.required],
            my_need: [null],
        });
    }

    continue(): void {
        const controls = this.leadAcquisitionForm.controls;
        if (this.validateForm(controls)) {
            this.dialogRef.close(this.leadAcquisitionForm.value);
        }
    }

    skip(): void {
        this.dialogRef.close('skip');
    }

    private validateForm(controls: any): boolean {
        for (const i in controls) {
            if (controls[i].errors) {
                this.errors[i] = controls[i].errors;
            } else {
                delete this.errors[i];
            }
        }
        if (
            this.errors.hasOwnProperty('email') ||
            this.errors.hasOwnProperty('name') ||
            this.errors.hasOwnProperty('contactNumber')
        ) {
            return false;
        } else {
            return true;
        }
    }

    getNumber(value: string): void {
        const control = this.leadAcquisitionForm.get('contactNumber');
        control.setValue(value);
    }

    isValidNumber(isValid: boolean): void {
        if (!isValid) {
            this.leadAcquisitionForm.get('contactNumber').setErrors({invalidPhone: !isValid});
        } else {
            this.leadAcquisitionForm.get('contactNumber').setErrors(null);
        }
    }
}
