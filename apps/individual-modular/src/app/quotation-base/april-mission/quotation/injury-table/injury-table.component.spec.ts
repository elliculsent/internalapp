import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {InjuryTableComponent} from './injury-table.component';

describe('InjuryTableComponent', () => {
    let component: InjuryTableComponent;
    let fixture: ComponentFixture<InjuryTableComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [InjuryTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InjuryTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
