import {AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';

import {environment} from '@individual-modular/environment/environment';
import {SpinnerService} from '@uex/uex-services';
import {PaymentAprilComponent} from './payment-april/payment-april.component';
import {PaymentDirective} from './payment.directive';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
    @ViewChild(PaymentDirective, {static: true})
    payment: PaymentDirective;
    public subFlow: any;
    public subFlowName: string;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private uexSpinnerService: SpinnerService
    ) {}

    ngOnInit(): void {
        this.switchComponent();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.uexSpinnerService.emitSpinner.emit({
                showSpinner: false,
                spinnerMessage: null,
            });
        });
    }

    private switchComponent(): void {
        switch (environment.product.code) {
            case 'APRIL_MISSION':
                // eslint-disable-next-line no-case-declarations
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaymentAprilComponent);
                this.injectComponent(componentFactory);
                break;

            default:
                break;
        }
    }

    private injectComponent<T>(componentFactory: ComponentFactory<T>): void {
        const viewContainerRef = this.payment.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createComponent(componentFactory);
    }
}
