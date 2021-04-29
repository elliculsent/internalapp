import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable()
export class BrowserNotSupportedGuard implements CanActivate {
    constructor(private deviceService: DeviceDetectorService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return this.checkIE(route);
    }

    private checkIE(route: ActivatedRouteSnapshot): boolean {
        // IE feature dectection
        const isIE = /*@cc_on!@*/ false || !!document['documentMode'];
        const deviceInfo = this.deviceService.getDeviceInfo();
        if (deviceInfo.browser === 'IE' || isIE) {
            if (route.routeConfig.path !== 'browser-not-supported') {
                this.router.navigateByUrl('browser-not-supported');
            } else {
                return true;
            }
        } else {
            if (route.routeConfig.path === 'browser-not-supported') {
                this.router.navigateByUrl('/');
                return false;
            } else {
                return true;
            }
        }
    }
}
