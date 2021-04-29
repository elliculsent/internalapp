import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PaymentAprilComponent} from './payment-april.component';

describe('PaymentComponent', () => {
    let component: PaymentAprilComponent;
    let fixture: ComponentFixture<PaymentAprilComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PaymentAprilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentAprilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
