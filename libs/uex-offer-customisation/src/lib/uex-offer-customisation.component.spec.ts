import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UexOfferCustomisationComponent} from './uex-offer-customisation.component';

describe('UexOfferCustomisationComponent', () => {
    let component: UexOfferCustomisationComponent;
    let fixture: ComponentFixture<UexOfferCustomisationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UexOfferCustomisationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UexOfferCustomisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
