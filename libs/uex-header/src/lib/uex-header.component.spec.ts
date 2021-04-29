import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UexHeaderComponent} from './uex-header.component';

describe('UexHeaderComponent', () => {
    let component: UexHeaderComponent;
    let fixture: ComponentFixture<UexHeaderComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UexHeaderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UexHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
