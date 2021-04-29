import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileCustomisationComponent} from './profile-customisation.component';

describe('ProfileCustomisationComponent', () => {
    let component: ProfileCustomisationComponent;
    let fixture: ComponentFixture<ProfileCustomisationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileCustomisationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileCustomisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
