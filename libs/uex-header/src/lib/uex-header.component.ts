import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, tap} from 'rxjs/operators';

@Component({
    selector: 'uex-header',
    templateUrl: './uex-header.component.html',
    styleUrls: ['./uex-header.component.scss'],
})
export class UexHeaderComponent implements AfterViewInit {
    @Input() config: any;
    @Input() intermediaryCode: string;
    @Input() invalidCode = false;
    @Input() priceDisplay: any;
    @Input() showAdherer = false;
    @Input() showFooterBtn = false;
    @Input() showPartager = false;
    @Input() showPrice = false;
    @Input() showSave = false;
    @Input() readonlyCode = false;
    @Input() userEmail: string;
    @Output() eShowDarkMenu: EventEmitter<any> = new EventEmitter();
    @Output() eLogin: EventEmitter<any> = new EventEmitter();
    @Output() ePartager: EventEmitter<any> = new EventEmitter();
    @Output() eCodeDistributor: EventEmitter<string> = new EventEmitter();
    @Output() ePriceHelpTip: EventEmitter<any> = new EventEmitter();
    @ViewChild('code') code: ElementRef;
    @ViewChild('code1') code1: ElementRef;

    public codeDistributor: string;

    // constructor() {}

    ngAfterViewInit(): void {
        fromEvent(this.code.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.code1.nativeElement.value = this.code.nativeElement.value;
                    this.eCodeDistributor.emit(this.code.nativeElement.value);
                })
            )
            .subscribe();

        fromEvent(this.code1.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.code.nativeElement.value = this.code1.nativeElement.value;
                    this.eCodeDistributor.emit(this.code1.nativeElement.value);
                })
            )
            .subscribe();
    }

    showDarkMenu(): void {
        this.eShowDarkMenu.emit();
    }

    login(): void {
        this.eLogin.emit();
    }

    emitPartager(value: string): void {
        this.ePartager.emit(value);
    }

    emitPriceHelpTip(helptip: any): void {
        this.ePriceHelpTip.emit(helptip);
    }
}
