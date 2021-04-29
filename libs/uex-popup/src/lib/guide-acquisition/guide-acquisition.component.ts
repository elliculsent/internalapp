import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-guide-acquisition',
    templateUrl: './guide-acquisition.component.html',
    styleUrls: ['./guide-acquisition.component.scss'],
})
export class GuideAcquisitionComponent implements OnInit {
    public config: any;
    public showArrow: boolean;
    public guideAcquisitionForm: FormGroup;
    public errors: any;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<GuideAcquisitionComponent>
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
        this.guideAcquisitionForm = this.fb.group({
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
        });
    }

    download(): void {
        const controls = this.guideAcquisitionForm.controls;
        if (this.validateForm(controls)) {
            this.dialogRef.close(this.guideAcquisitionForm.value);
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
}
