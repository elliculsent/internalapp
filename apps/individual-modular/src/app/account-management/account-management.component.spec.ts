import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AccountManagementComponent} from './account-management.component';

describe('AccountManagementComponent', () => {
    let component: AccountManagementComponent;
    let fixture: ComponentFixture<AccountManagementComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AccountManagementComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
