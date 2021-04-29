import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileSpouseComponent} from './profile-spouse.component';

describe('ProfileSpouseComponent', () => {
    let component: ProfileSpouseComponent;
    let fixture: ComponentFixture<ProfileSpouseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileSpouseComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileSpouseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
