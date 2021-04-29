import {Component, Inject} from '@angular/core';
import {MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
    selector: 'uex-snackbar',
    templateUrl: './uex-snackbar.component.html',
    styleUrls: ['./uex-snackbar.component.scss'],
})
export class UexSnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar: MatSnackBar) {}
}
