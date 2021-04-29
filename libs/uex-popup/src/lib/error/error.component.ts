import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
    public title: string;
    public htmlContent: string;

    // constructor() {}

    ngOnInit(): void {
        if (this.title === null || this.title === '') {
            this.title = 'Error';
        }
    }
}
