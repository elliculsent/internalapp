import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OfferSummaryComponent} from './offer-summary.component';

describe('OfferSummaryComponent', () => {
    let component: OfferSummaryComponent;
    let fixture: ComponentFixture<OfferSummaryComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OfferSummaryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfferSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
