import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {ProductService} from '@uex/uex-services';
import {Observable} from 'rxjs';

@Injectable()
export class ComponentsResolver implements Resolve<any> {
    constructor(private productService: ProductService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const components = route.data['components'];
        const environment = route.data['environment'];
        this.productService.setBaseUrl = environment.baymax_backend_root_url;
        this.productService.setProductCode = environment.product.code;
        return this.productService.postMultiComponentDisplay(components);
    }
}
