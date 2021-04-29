import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MutualHealthComponent} from './mutual-health.component';

describe('MutualHealthComponent', () => {
    let component: MutualHealthComponent;
    let fixture: ComponentFixture<MutualHealthComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MutualHealthComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MutualHealthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
