import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';

import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {COUNTRY_COVERAGE, COVERAGE_INFORMATION_LINK, PERSONALISATION_LINK} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';

@Component({
    selector: 'app-country-coverage',
    templateUrl: './country-coverage.component.html',
    styleUrls: ['./country-coverage.component.scss'],
})
export class CountryCoverageComponent implements OnInit {
    public entityPolicy: EntityPolicy = null;
    public countriesCoveredForm: FormGroup;
    public countriesCoveredValue: string;
    public subFlow: any = null;

    private offerId: string | number;
    private selectedLanguageCountry: string;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private router: Router,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService
    ) {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });

        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: COUNTRY_COVERAGE}));
        this.store.pipe(select(selectors.selectPersonalisationSubFlow, COUNTRY_COVERAGE)).subscribe((data) => {
            this.subFlow = data.fields;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    ngOnInit(): void {
        this.buildForm();
    }

    openHelptip(id: string): void {
        const helpTip = this.subFlow.help_tips[id];
        this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
        this.uexSidenavService.open();
    }

    buildForm(): void {
        // prettier-ignore
        this.countriesCoveredForm = this.fb.group({});
        this.subFlow.form_controls.map((formControl: any) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.countriesCoveredForm.addControl(formControl.id, control);
        });
    }

    selectRadioButton(controlId: string, value: string): void {
        const control = this.countriesCoveredForm.get(controlId);
        control.setValue(value);
    }

    back(): void {
        this.router.navigateByUrl(
            `${this.selectedLanguageCountry}/${PERSONALISATION_LINK}/${COVERAGE_INFORMATION_LINK}`
        );
    }

    checkCountry(): boolean {
        if (
            this.countriesCoveredForm.get('country_coverage') &&
            this.countriesCoveredForm.get('country_coverage').value === 'YES'
        ) {
            this.openHelptip(this.subFlow.country_coverage_help_tips.id);
            return false;
        } else {
            return true;
        }
    }

    continue(): void {
        if (this.countriesCoveredForm.valid && this.checkCountry()) {
            let payload = JSON.parse(JSON.stringify(this.entityPolicy));
            payload = this.setFormControlsValue(payload);
            this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
            if (this.offerId) {
                this.store.dispatch(
                    actions.postPersonalisation({
                        entity_policy: this.entityPolicy,
                        currentFlow: COUNTRY_COVERAGE,
                        offerId: this.offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        }
    }

    setFormControlsValue(payload: any): any {
        const result = {...payload};
        this.subFlow.form_controls.map((item) => {
            if ('object_reference' in item) {
                item.object_reference.map((objectReference) => {
                    const reference = objectReference.reference;
                    const existingValue = this.formService.getPathWithReference(reference, result);
                    if (reference !== undefined) {
                        const newPath = this.formService.createNewPathForArrayIndex(reference);
                        const newPathArray = newPath.split('.');
                        let updatedValue: any;
                        if (newPathArray[newPathArray.length - 1] === 'policy_custom_data') {
                            updatedValue = this.formService.updateValueByType(existingValue, {
                                [objectReference.name]: this.countriesCoveredForm.get(item.id).value,
                            });
                        }
                        _.set(result, newPath, updatedValue);
                    }
                });
            }
        });
        return result;
    }
}
