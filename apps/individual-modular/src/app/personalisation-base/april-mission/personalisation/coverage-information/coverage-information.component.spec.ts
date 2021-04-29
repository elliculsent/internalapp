import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CoverageInformationComponent} from './coverage-information.component';

describe('CoverageInformationComponent', () => {
    let component: CoverageInformationComponent;
    let fixture: ComponentFixture<CoverageInformationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CoverageInformationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoverageInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
