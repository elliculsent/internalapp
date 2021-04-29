import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MedicalFeesComponent} from './medical-fees.component';

describe('MedicalFeesComponent', () => {
    let component: MedicalFeesComponent;
    let fixture: ComponentFixture<MedicalFeesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MedicalFeesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MedicalFeesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
