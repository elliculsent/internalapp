import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-language-n-country',
    templateUrl: './language-n-country.component.html',
    styleUrls: ['./language-n-country.component.scss'],
})
export class LanguageNCountryComponent implements OnInit {
    public config: any;
    public selectedLanguage: string;
    public selectedCountry: string;
    public languageNcountryForm: FormGroup;
    public countryArray: Array<any>;
    public languageArray: Array<any>;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<LanguageNCountryComponent>
    ) {}

    ngOnInit(): void {
        this.countryArray = this.config.fields.countries;
        this.buildForm();
        this.getAvailableLanguage(this.selectedCountry);
    }

    private buildForm(): void {
        this.languageNcountryForm = this.fb.group({
            language: [this.selectedLanguage, Validators.required],
            country: [this.selectedCountry, Validators.required],
        });
    }

    getAvailableLanguage(country: string): void {
        this.languageArray = this.countryArray.find((data: any) => {
            if (data.iso_alpha_code === country) {
                return data.languages;
            } else {
                return [];
            }
        }).languages;
    }

    close(): void {
        this.dialogRef.close(this.languageNcountryForm.value);
    }
}
