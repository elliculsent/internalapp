import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
    selector: 'uex-coverage-details',
    templateUrl: './uex-coverage-details.component.html',
    styleUrls: ['./uex-coverage-details.component.scss'],
})
export class UexCoverageDetailsComponent implements OnChanges {
    @Input() coverageDetails: any;
    @Input() helpTips: any;
    @Output() eHelptip: EventEmitter<any> = new EventEmitter();

    public selectedMain = 0;
    public selectedSub = 0;

    // constructor() {}

    ngOnChanges(): void {
        if (this.helpTips) {
            setTimeout(() => {
                const keys = Object.keys(this.helpTips);
                this.addHelptipEvent(keys);
            }, 1000);
        }
    }

    addHelptipEvent(keys: Array<string>): void {
        keys.forEach((val) => {
            const el = document.getElementsByClassName(`${val}`);
            Array.from(el).forEach((element) => {
                element.addEventListener('click', this.emitHelptip.bind(this, val));
            });
        });
    }

    emitHelptip(id: string): any {
        this.eHelptip.emit(this.helpTips[id]);
    }
}
