import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LeadAcquisitionComponent} from './lead-acquisition.component';

describe('LeadAcquisitionComponent', () => {
    let component: LeadAcquisitionComponent;
    let fixture: ComponentFixture<LeadAcquisitionComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LeadAcquisitionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeadAcquisitionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
