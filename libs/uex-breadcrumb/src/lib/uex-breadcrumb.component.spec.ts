import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UexBreadcrumbComponent} from './uex-breadcrumb.component';

describe('UexBreadcrumbComponent', () => {
    let component: UexBreadcrumbComponent;
    let fixture: ComponentFixture<UexBreadcrumbComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UexBreadcrumbComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UexBreadcrumbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
