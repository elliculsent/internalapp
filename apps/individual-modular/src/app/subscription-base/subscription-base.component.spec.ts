import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubscriptionBaseComponent} from './subscription-base.component';

describe('SubscriptionBaseComponent', () => {
    let component: SubscriptionBaseComponent;
    let fixture: ComponentFixture<SubscriptionBaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubscriptionBaseComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SubscriptionBaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
