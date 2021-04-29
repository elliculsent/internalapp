import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[appPayment]',
})
export class PaymentDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
