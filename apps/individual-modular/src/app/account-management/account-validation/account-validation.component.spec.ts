import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AccountValidationComponent} from './account-validation.component';

describe('AccountValidationComponent', () => {
    let component: AccountValidationComponent;
    let fixture: ComponentFixture<AccountValidationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AccountValidationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountValidationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
