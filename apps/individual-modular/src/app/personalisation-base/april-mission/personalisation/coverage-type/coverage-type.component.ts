import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import * as constants from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';

@Component({
    selector: 'app-coverage-type',
    templateUrl: './coverage-type.component.html',
    styleUrls: ['./coverage-type.component.scss'],
})
export class CoverageTypeComponent implements OnInit {
    public entityPolicy: EntityPolicy = null;
    public coverTypeForm: FormGroup;
    public annualContract: string = constants.ANNUAL_CONTRACT;
    public temporaryContract: string = constants.TEMPORARY_CONTRACT;
    public subFlow: any = null;
    private offerId: string | number;
    private selectedLanguageCountry: string;
    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private uexSidenavService: UexSidenavService,
        public store: Store<State>,
        private uexPopup: UexPopupService,
        private router: Router
    ) {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: constants.COVERAGE_TYPE}));
        this.store.pipe(select(selectors.selectPersonalisationSubFlow, constants.COVERAGE_TYPE)).subscribe((data) => {
            this.subFlow = data.fields;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
    }

    ngOnInit(): void {
        this.buildForm();
    }
    private buildForm(): void {
        this.coverTypeForm = this.fb.group({});
        this.subFlow.form_controls.map((formControl: any) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.coverTypeForm.addControl(formControl.id, control);
        });
    }

    selectRadioButton(controlId: string, value: string): void {
        const control = this.coverTypeForm.get(controlId);
        control.setValue(value);
    }

    openHelptip(id: string): void {
        const helpTip = this.subFlow.help_tips[id];
        this.uexSidenavService.setSidenavData(helpTip.title, helpTip.content);
        this.uexSidenavService.open();
    }

    continue(): void {
        if (this.coverTypeForm.valid) {
            let payload = JSON.parse(JSON.stringify(this.entityPolicy));
            payload = this.setFormControlsValue(payload);
            this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
            if (this.offerId) {
                this.store.dispatch(
                    actions.postPersonalisation({
                        entity_policy: this.entityPolicy,
                        currentFlow: constants.COVERAGE_TYPE,
                        offerId: this.offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        }
    }

    back(): void {
        this.router.navigateByUrl(
            `${this.selectedLanguageCountry}/${constants.PERSONALISATION_LINK}/${constants.PROFILE_DETAILS_LINK}`
        );
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
                        let updatedValue;
                        if (newPathArray[newPathArray.length - 1] === 'factor') {
                            const uniqueExisting = _.reject(existingValue, ['name', objectReference.name]);
                            updatedValue = this.formService.updateValueByType(uniqueExisting, {
                                code: this.coverTypeForm.value[item.id],
                                name: objectReference.name,
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
