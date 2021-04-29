import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UexQuoteSummaryComponent} from './uex-quote-summary.component';

describe('UexQuoteSummaryComponent', () => {
    let component: UexQuoteSummaryComponent;
    let fixture: ComponentFixture<UexQuoteSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UexQuoteSummaryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UexQuoteSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
