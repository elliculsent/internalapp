import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CountryCoverageComponent} from './country-coverage.component';

describe('CountryCoverageComponent', () => {
    let component: CountryCoverageComponent;
    let fixture: ComponentFixture<CountryCoverageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CountryCoverageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CountryCoverageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
