import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CoverageCardComponent} from './coverage-card.component';

describe('CoverageCardComponent', () => {
    let component: CoverageCardComponent;
    let fixture: ComponentFixture<CoverageCardComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CoverageCardComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoverageCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
