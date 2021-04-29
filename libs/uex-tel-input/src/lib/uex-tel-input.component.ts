import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'uex-tel-input',
    templateUrl: './uex-tel-input.component.html',
})
export class UexTelInputComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() placeholder: string;
    @Input() value: string;
    @Input() initialCountry: string;
    @Output() eGetNumber: EventEmitter<string> = new EventEmitter();
    @Output() eIsValid: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('tel') tel: ElementRef;
    public isValid = false;
    public changed = false;
    public telInputOptions: any = {};
    public selectedMask: any[] = [];
    public telValue: string;
    private iti: any;
    private subscription: Subscription;

    ngOnInit(): void {
        this.telInputOptions = {
            customPlaceholder: (selectedCountryPlaceholder: string, selectedCountryData: any) => {
                return this.updateMaskFromPlaceholder(selectedCountryPlaceholder, selectedCountryData);
            },
            initialCountry: this.initialCountry,
            localizedCountries: {
                // de: 'Deutschland',
            },
            nationalMode: false,
            preferredCountries: [],
        };
    }

    ngAfterViewInit(): void {
        this.subscription = fromEvent(this.tel.nativeElement, 'keyup')
            .pipe(debounceTime(100), distinctUntilChanged())
            .subscribe(() => {
                this.hasError(this.iti.isValidNumber());
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    updateMaskFromPlaceholder(selectedCountryPlaceholder: string, selectedCountryData: any): string {
        setTimeout(() => {
            if (selectedCountryPlaceholder && selectedCountryData) {
                const phoneNumber = selectedCountryPlaceholder.replace(`+${selectedCountryData.dialCode}`, '');
                this.selectedMask = [];
                this.selectedMask.push('+');
                this.selectedMask = this.selectedMask.concat(selectedCountryData.dialCode.split(''));
                phoneNumber.split('').map((char: string) => {
                    if (char.match(/[^\d]/g)) {
                        this.selectedMask.push(char);
                    } else {
                        this.selectedMask.push(/\d+/);
                    }
                });
            }
        });
        return this.placeholder;
    }

    getNumber(value: string): void {
        this.eGetNumber.emit(value);
    }

    // the emit value is true if phone is valid
    hasError(e: any): void {
        this.isValid = e;
        this.eIsValid.emit(e);
    }

    onChange(): void {
        this.changed = true;
    }

    telInputObject(e: any): void {
        setTimeout(() => {
            this.iti = e;
            if (this.value) {
                this.telValue = this.value;
                e.setNumber(this.value);
            } else {
                this.telValue = '+';
                e.setNumber('+');
            }
        });
    }
}
