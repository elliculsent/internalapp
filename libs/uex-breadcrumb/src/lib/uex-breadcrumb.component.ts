import {Component, Input} from '@angular/core';

import {Breadcrumb} from '@uex/uex-models';

@Component({
    selector: 'uex-breadcrumb',
    templateUrl: './uex-breadcrumb.component.html',
    styleUrls: ['./uex-breadcrumb.component.scss'],
})
export class UexBreadcrumbComponent {
    @Input() data: Array<Breadcrumb> = [];
    // constructor() { }
}
