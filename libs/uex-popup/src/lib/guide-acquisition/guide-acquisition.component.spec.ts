import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {GuideAcquisitionComponent} from './guide-acquisition.component';

describe('LeadAcquisitionComponent', () => {
    let component: GuideAcquisitionComponent;
    let fixture: ComponentFixture<GuideAcquisitionComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [GuideAcquisitionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideAcquisitionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
