import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonalisationBaseComponent} from './personalisation-base.component';

describe('PersonalisationBaseComponent', () => {
    let component: PersonalisationBaseComponent;
    let fixture: ComponentFixture<PersonalisationBaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PersonalisationBaseComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PersonalisationBaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
