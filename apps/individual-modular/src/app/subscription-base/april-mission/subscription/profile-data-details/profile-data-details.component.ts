import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {select, Store} from '@ngrx/store';
import {map, startWith} from 'rxjs/operators';

import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {INSURED_DETAILS_LINK, PROFILE_DATA_DETAILS, SUBSCRIPTION_LINK} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';

@Component({
    selector: 'app-profile-data-details',
    templateUrl: './profile-data-details.component.html',
    styleUrls: ['./profile-data-details.component.scss'],
})
export class ProfileDataDetailsComponent implements OnInit {
    public nafCodes: Array<any> = [];
    public options: {[key: string]: any[]} = {};
    public detailsForm: FormGroup;
    public subFlow: any = null;
    public filteredOptions: {[key: string]: Observable<any[]>} = {};
    public entityPolicy: EntityPolicy;
    private selectedLanguageCountry: string;
    private offerId: string | number;
    public fieldMasks: {[key: string]: string[]} = {};

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService
    ) {
        this.store.dispatch(actions.setSubscriptionActiveSubFlow({sub_flow: PROFILE_DATA_DETAILS}));
        this.store
            .pipe(select(selectors.selectSubscriptionSubFlow, PROFILE_DATA_DETAILS))
            .subscribe((data) => {
                this.subFlow = data;

                if (this.subFlow && this.subFlow.fields.form_controls) {
                    this.nafCodes = this.subFlow.fields.form_controls[0].options;
                }
            })
            .unsubscribe();
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.pipe(select(selectors.getSelectedCountryLanguage)).subscribe((data) => {
            this.selectedLanguageCountry = data;
        });
        this.store.pipe(select(selectors.getOfferId)).subscribe((data) => {
            this.offerId = data;
        });
    }

    ngOnInit(): void {
        this.buildForm();
    }

    displayFn(item: any): string {
        // prettier-ignore
        return item && item.name ? item.name : '';
    }

    buildForm(): void {
        this.detailsForm = this.fb.group({});
        this.subFlow.fields.form_controls.map((formControl: any) => {
            const validators = this.formService.buildValidators(formControl);
            let formBuilderControl: FormControl;

            if (formControl.type === 'dropdown') {
                this.options[formControl.id] = formControl.options;
                const foundValue = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                const foundOptionValue = foundValue
                    ? _.find(this.options[formControl.id], ['value', foundValue])
                    : null;
                validators.push(this.formService.findFromListValidator(this.options[formControl.id], 'value'));
                formBuilderControl = this.fb.control(foundOptionValue, validators);
                this.filteredOptions[formControl.id] = formBuilderControl.valueChanges.pipe(
                    startWith(''),
                    map((option) => (typeof option === 'string' ? option : option.name)),
                    map(
                        (controlValue) =>
                            controlValue
                                ? this.formService.filterAutoCompleteList(controlValue, this.options[formControl.id])
                                : this.options[formControl.id].slice()
                    )
                );
            } else {
                const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                formBuilderControl = this.fb.control(value, validators);
            }
            this.fieldMasks[formControl.id] = this.formService.buildMask(formControl);
            this.detailsForm.addControl(formControl.id, formBuilderControl);
        });
    }

    openHelptip(id: string): void {
        const healthTips = this.subFlow.fields.help_tips[id];
        this.uexSidenavService.setSidenavData(healthTips.title, healthTips.content);
        this.uexSidenavService.open();
    }

    continue(): void {
        if (this.detailsForm.valid) {
            let payload = JSON.parse(JSON.stringify(this.entityPolicy));
            payload = this.setFormControlsValue(payload);
            this.store.dispatch(actions.setEntityPolicy({entity_policy: payload}));
            if (this.offerId) {
                this.store.dispatch(
                    actions.postSubscription({
                        entity_policy: this.entityPolicy,
                        currentFlow: PROFILE_DATA_DETAILS,
                        offerId: this.offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        }
    }

    back(): void {
        this.router.navigateByUrl(`${this.selectedLanguageCountry}/${SUBSCRIPTION_LINK}/${INSURED_DETAILS_LINK}`);
    }

    setFormControlsValue(payload: any): any {
        const result = {...payload};
        this.subFlow.fields.form_controls.map((formControl: any) => {
            if ('object_reference' in formControl) {
                formControl.object_reference.map((objectReference: any) => {
                    let updatedValue: any;
                    const newPath = this.formService.createNewPathForArrayIndex(objectReference.reference);
                    const newPathArray = newPath.split('.');
                    const existingValue = this.formService.getPathWithReference(objectReference.reference, result);
                    const formValue = this.detailsForm.get(formControl.id).value;
                    if (formControl.type === 'dropdown' && newPathArray[newPathArray.length - 1] !== 'factor') {
                        updatedValue = this.formService.updateValueByType(existingValue, {
                            [objectReference.name]: formValue.value,
                        });
                    } else {
                        updatedValue = this.formService.getUpdateValue(
                            objectReference,
                            result,
                            this.detailsForm.get(formControl.id).value
                        );
                    }
                    _.set(result, newPath, updatedValue);
                });
            }
        });
        return result;
    }
}
