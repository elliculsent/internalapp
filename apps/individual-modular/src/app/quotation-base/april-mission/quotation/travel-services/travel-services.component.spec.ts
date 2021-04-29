import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TravelServicesComponent} from './travel-services.component';

describe('TravelServicesComponent', () => {
    let component: TravelServicesComponent;
    let fixture: ComponentFixture<TravelServicesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TravelServicesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TravelServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
