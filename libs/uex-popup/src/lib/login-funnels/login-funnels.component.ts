import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-login-funnel',
    templateUrl: './login-funnels.component.html',
    styleUrls: ['./login-funnels.component.scss'],
})
export class LoginFunnelsComponent implements OnInit {
    public data: any;
    constructor(private matDialogRef: MatDialogRef<LoginFunnelsComponent>) {}

    ngOnInit(): void {}

    close(): void {
        this.matDialogRef.close();
    }
}
