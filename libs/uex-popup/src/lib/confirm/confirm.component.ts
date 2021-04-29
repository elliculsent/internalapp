import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
    public htmlContent: string;

    constructor(private dialogRef: MatDialogRef<ConfirmComponent>) {}

    ngOnInit(): void {}

    confirm(choice: boolean): void {
        this.dialogRef.close(choice);
    }
}
