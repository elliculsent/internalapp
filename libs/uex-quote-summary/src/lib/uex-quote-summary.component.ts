import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'uex-quote-summary',
    templateUrl: './uex-quote-summary.component.html',
    styleUrls: ['./uex-quote-summary.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UexQuoteSummaryComponent {
    @Input() quoteSummary: any;
    @Input() summary: any;
    @Output() modify: EventEmitter<boolean> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer) {}

    edit(): void {
        this.modify.emit(true);
    }

    safeHtml(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
