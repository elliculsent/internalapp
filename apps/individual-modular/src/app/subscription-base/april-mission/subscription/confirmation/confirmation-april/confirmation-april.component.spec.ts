import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ConfirmationAprilComponent} from './confirmation-april.component';

describe('ConfirmationComponent', () => {
    let component: ConfirmationAprilComponent;
    let fixture: ComponentFixture<ConfirmationAprilComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmationAprilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationAprilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
