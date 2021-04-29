import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ProfileDataDetailsComponent} from './profile-data-details.component';

describe('ProfileDataDetailsComponent', () => {
    let component: ProfileDataDetailsComponent;
    let fixture: ComponentFixture<ProfileDataDetailsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ProfileDataDetailsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileDataDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
