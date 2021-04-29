import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LanguageNCountryComponent} from './language-n-country.component';

describe('LanguageNCountryComponent', () => {
    let component: LanguageNCountryComponent;
    let fixture: ComponentFixture<LanguageNCountryComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LanguageNCountryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageNCountryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
