import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {SpinnerService} from '@uex/uex-services';

@Component({
    selector: 'uex-browser-not-supported',
    templateUrl: './uex-browser-not-supported.component.html',
    styleUrls: ['./uex-browser-not-supported.component.scss'],
})
export class UexBrowserNotSupportedComponent implements OnInit {
    constructor(private dialogRef: MatDialog, private uexSpinnerService: SpinnerService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.uexSpinnerService.emitSpinner.emit({
                showSpinner: false,
                spinnerMessage: null,
            });
            this.dialogRef.closeAll();
        });
    }
}
