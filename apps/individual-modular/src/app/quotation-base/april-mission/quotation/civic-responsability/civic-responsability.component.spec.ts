import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CivicResponsabilityComponent} from './civic-responsability.component';

describe('CivicResponsabilityComponent', () => {
    let component: CivicResponsabilityComponent;
    let fixture: ComponentFixture<CivicResponsabilityComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CivicResponsabilityComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CivicResponsabilityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
