import {AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {environment} from '@individual-modular/environment/environment';
import {GoogleTagManagerService, SpinnerService} from '@uex/uex-services';
import {ConfirmationAprilComponent} from './confirmation-april/confirmation-april.component';
import {ConfirmationDirective} from './confirmation.directive';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, AfterViewInit {
    @ViewChild(ConfirmationDirective, {static: true})
    confirmation: ConfirmationDirective;
    public subFlow: any;
    public subFlowName: string;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private gtmService: GoogleTagManagerService,
        private aRoute: ActivatedRoute,
        private uexSpinnerService: SpinnerService
    ) {}
    ngOnInit(): void {
        this.switchComponent();
        // TODO : once price selector is complete, update revenue
        const price = this.aRoute.snapshot.data.price;
        this.gtmService.pushToDataLayer({
            event: 'PurchaseConfirmation',
            revenue: price.price_display.price_value,
        });
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
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
                    ConfirmationAprilComponent
                );
                this.injectComponent(componentFactory);
                break;

            default:
                break;
        }
    }

    private injectComponent<T>(componentFactory: ComponentFactory<T>): void {
        const viewContainerRef = this.confirmation.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createComponent(componentFactory);
    }
}
