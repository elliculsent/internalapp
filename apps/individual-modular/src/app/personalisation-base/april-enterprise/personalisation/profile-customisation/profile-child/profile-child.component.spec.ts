import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileChildComponent} from './profile-child.component';

describe('ProfileChildComponent', () => {
    let component: ProfileChildComponent;
    let fixture: ComponentFixture<ProfileChildComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileChildComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileChildComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
