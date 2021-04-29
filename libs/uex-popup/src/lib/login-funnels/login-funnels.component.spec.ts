import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LoginFunnelsComponent} from './login-funnels.component';

describe('LoginFunnelsComponent', () => {
    let component: LoginFunnelsComponent;
    let fixture: ComponentFixture<LoginFunnelsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LoginFunnelsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginFunnelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
