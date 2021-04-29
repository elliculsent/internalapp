import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileFamilyCompositionComponent} from './profile-family-composition.component';

describe('ProfileFamilyCompositionComponent', () => {
    let component: ProfileFamilyCompositionComponent;
    let fixture: ComponentFixture<ProfileFamilyCompositionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileFamilyCompositionComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileFamilyCompositionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
