import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UexDarkMenuComponent} from './uex-dark-menu.component';

describe('UexDarkMenuComponent', () => {
    let component: UexDarkMenuComponent;
    let fixture: ComponentFixture<UexDarkMenuComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UexDarkMenuComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UexDarkMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
