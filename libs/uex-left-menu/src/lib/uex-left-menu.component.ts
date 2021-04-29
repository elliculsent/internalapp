import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'uex-left-menu',
    templateUrl: './uex-left-menu.component.html',
    styleUrls: ['./uex-left-menu.component.scss'],
})
export class UexLeftMenuComponent {
    @Input() isLoggedIn = false;
    @Input() username: string = null;
    @Input() menu: Array<any> = [];
    @Input() hideMenuInMobile = false;
    @Input() hideMenuItemInMobile = false;
    constructor(private sanitizer: DomSanitizer) {}

    getlink(link: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(link);
    }
}
