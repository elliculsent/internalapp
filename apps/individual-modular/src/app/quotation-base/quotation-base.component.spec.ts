import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuotationBaseComponent} from './quotation-base.component';

describe('QuotationBaseComponent', () => {
    let component: QuotationBaseComponent;
    let fixture: ComponentFixture<QuotationBaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuotationBaseComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(QuotationBaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
