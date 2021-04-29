import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UexSidenavComponent} from './uex-sidenav.component';

describe('UexSidenavComponent', () => {
    let component: UexSidenavComponent;
    let fixture: ComponentFixture<UexSidenavComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UexSidenavComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UexSidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
