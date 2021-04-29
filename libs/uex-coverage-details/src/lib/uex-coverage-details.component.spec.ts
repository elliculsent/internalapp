import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UexCoverageDetailsComponent} from './uex-coverage-details.component';

describe('UexCoverageDetailsComponent', () => {
    let component: UexCoverageDetailsComponent;
    let fixture: ComponentFixture<UexCoverageDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UexCoverageDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UexCoverageDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
