import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UexDarkMenuService} from './uex-dark-menu.service';

@Component({
    selector: 'uex-dark-menu',
    templateUrl: './uex-dark-menu.component.html',
    styleUrls: ['./uex-dark-menu.component.scss'],
})
export class UexDarkMenuComponent implements AfterViewInit {
    @Input() isLoggedIn = false;
    @Output() eLogin: EventEmitter<boolean> = new EventEmitter();
    @Output() eLogout: EventEmitter<boolean> = new EventEmitter();
    public menuData: any;

    constructor(private darkMenuService: UexDarkMenuService, private sanitizer: DomSanitizer) {}

    ngAfterViewInit(): void {
        this.darkMenuService.emitDarkSidenavData.subscribe((data: any) => {
            this.menuData = data.data;
        });
    }

    close(): void {
        this.darkMenuService.close();
    }

    getlink(link: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(link);
    }

    login(): void {
        this.darkMenuService.close();
        this.eLogin.emit(true);
    }

    logout(): void {
        this.darkMenuService.close();
        this.eLogout.emit(true);
    }
}
