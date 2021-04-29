import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PolicyDurationComponent} from './policy-duration.component';

describe('PolicyDurationComponent', () => {
    let component: PolicyDurationComponent;
    let fixture: ComponentFixture<PolicyDurationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PolicyDurationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PolicyDurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
