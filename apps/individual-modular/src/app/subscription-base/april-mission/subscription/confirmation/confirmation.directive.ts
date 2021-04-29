import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[appConfirmation]',
})
export class ConfirmationDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
