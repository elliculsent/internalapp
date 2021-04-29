import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UexLeftMenuComponent} from './uex-left-menu.component';

describe('UexLeftMenuComponent', () => {
    let component: UexLeftMenuComponent;
    let fixture: ComponentFixture<UexLeftMenuComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UexLeftMenuComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UexLeftMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
