import {EventEmitter, Injectable} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({providedIn: 'root'})
export class UexDarkMenuService {
    private sidenav: MatSidenav;
    public emitDarkSidenavData: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.setDarkMenuData();
    }

    public setDarkMenuData(data: any = null): void {
        this.emitDarkSidenavData.emit({
            data,
        });
    }

    public setDarkSidenav(sidenav: MatSidenav): void {
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
