import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DeathInvalidityComponent} from './death-invalidity.component';

describe('DeathInvalidityComponent', () => {
    let component: DeathInvalidityComponent;
    let fixture: ComponentFixture<DeathInvalidityComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [DeathInvalidityComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeathInvalidityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
