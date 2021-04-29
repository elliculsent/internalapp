import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UexSnackbarComponent} from './uex-snackbar.component';

describe('UexSnackbarComponent', () => {
    let component: UexSnackbarComponent;
    let fixture: ComponentFixture<UexSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UexSnackbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UexSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
