import {EventEmitter, Injectable} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({providedIn: 'root'})
export class UexSidenavService {
    private sidenav: MatSidenav;
    public emitSidenavData: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.setSidenavData();
    }

    public setSidenavData(title: string = null, htmlContent: string = null): void {
        this.emitSidenavData.emit({
            title,
            htmlContent,
        });
    }

    public setSidenav(sidenav: MatSidenav): void {
        this.sidenav = sidenav;
    }

    public open(): any {
        return this.sidenav.open();
    }

    public close(): any {
        return this.sidenav.close();
    }

    public toggle(): void {
        this.sidenav.toggle();
    }
}
