import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileMyselfComponent} from './profile-myself.component';

describe('ProfileMyselfComponent', () => {
    let component: ProfileMyselfComponent;
    let fixture: ComponentFixture<ProfileMyselfComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileMyselfComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileMyselfComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
