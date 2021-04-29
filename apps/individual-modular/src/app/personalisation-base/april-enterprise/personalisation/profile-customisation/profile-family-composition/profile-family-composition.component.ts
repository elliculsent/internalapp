import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {pluck, take} from 'rxjs/operators';

import * as actions from '@individual-modular/actions';
import {UexSidenavService} from '@uex/uex-sidenav';
import {
    FAMILY_COMPOSITION,
    MYSELF,
    PERSONALISATION,
    PERSONALISATION_LINK,
    POLICY_DURATION,
    PROFILE_CUSTOMISATION,
} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';

@Component({
    selector: 'app-profile-family-composition',
    templateUrl: './profile-family-composition.component.html',
    styleUrls: ['./profile-family-composition.component.scss'],
})
export class ProfileFamilyCompositionComponent implements OnInit {
    private entityPolicy: EntityPolicy = null;
    public customisationForm: FormGroup;
    public subFlowFields$: Observable<any>;
    public familyCompositionFields$: Observable<any>;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private uexSidenavService: UexSidenavService
    ) {}

    ngOnInit(): void {
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: PROFILE_CUSTOMISATION}));
        this.subFlowFields$ = this.store.pipe(selectors.selectPersonalisationFields(PROFILE_CUSTOMISATION));
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((entityPolicy) => {
            this.entityPolicy = entityPolicy;
        });
        this.buildForm();
    }

    buildForm(): void {
        this.customisationForm = this.fb.group({});
        this.store
            .pipe(selectors.selectPersonalisationFormControls(PROFILE_CUSTOMISATION))
            .subscribe((formControl: any) => {
                switch (formControl.id) {
                    case FAMILY_COMPOSITION.toLowerCase():
                        this.familyCompositionFields$ = of(formControl);
                        this.buildCustomisationControls(formControl);
                        break;
                }
            });

        this.store.pipe(take(1), select(selectors.getFamilyComposition)).subscribe((cover) => {
            if (cover) {
                this.customisationForm.get('personalise_for').setValue(cover);
            }
        });
    }

    buildCustomisationControls(formControl: any): void {
        formControl.controls.map((control: any) => {
            const foundValue = this.formService.findValueWithObjectReference(control, this.entityPolicy);
            const value = this.buildValue(control, foundValue);
            const validators = this.formService.buildValidators(control);
            const fbControl = this.fb.control(value, validators);
            this.customisationForm.addControl(control.id, fbControl);
        });
    }

    buildValue(control: any, value: any = null): any {
        let newValue = value;
        if (control.type === 'dropdown') {
            newValue = newValue ? newValue.toLowerCase() : control.options[0].value;
            return newValue;
        } else {
            return newValue;
        }
    }

    openHelptip(id: string): void {
        this.subFlowFields$.pipe(pluck('help_tips'), take(1)).subscribe((helpTips) => {
            const helpTip = helpTips[id];
            this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
            this.uexSidenavService.open();
        });
    }

    continue(): void {
        if (this.customisationForm.invalid) {
            return;
        }
        combineLatest([
            this.store.pipe(take(1), select(selectors.getSelectedCountryLanguage)),
            this.store.select(selectors.getSubflowLink, {
                mainflow: 'personalisation',
                subflow: MYSELF,
            }),
            this.store.pipe(take(1), select(selectors.getFamilyComposition)),
            this.store.pipe(take(1), select(selectors.getOfferId)),
        ]).subscribe(([selectedLanguageCountry, link, currentFamilyComposition]) => {
            const familyComposition = this.customisationForm.get('personalise_for').value;
            if (currentFamilyComposition !== familyComposition) {
                this.store.dispatch(
                    actions.resetLeftMenuFlow({
                        flow: {
                            main_flow: PERSONALISATION,
                            sub_flow_name: PROFILE_CUSTOMISATION,
                        },
                    })
                );
                this.store.dispatch(actions.resetBreadcrumb({main_flow: PERSONALISATION}));
                this.store.dispatch(actions.resetProfileCustomisationSubmenu());
            }

            this.store.dispatch(
                actions.setFamilyComposition({
                    familyComposition,
                })
            );

            this.store.dispatch(
                actions.setPersonalisationNextSubflow({
                    sub_flow: MYSELF,
                })
            );
            this.router.navigateByUrl(`${selectedLanguageCountry}/${PERSONALISATION_LINK}/${link}`);
        });
    }

    back(): void {
        this.store.select(selectors.getSelectedCountryLanguage).pipe(take(1)).subscribe((selectedLanguageCountry) => {
            this.router.navigateByUrl(`${selectedLanguageCountry}/${PERSONALISATION_LINK}/${POLICY_DURATION}`);
        });
    }
}
