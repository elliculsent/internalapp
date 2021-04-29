import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {UexSidenavService} from '@uex/uex-sidenav';
import {PROFILE_DETAILS} from '@uex/uex-constants';
import {EntityPolicy, Factor} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';
import {ProductService} from '@uex/uex-services';
import {combineLatest} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
    private entityPolicy: EntityPolicy = null;
    public entityFormValue: EntityPolicy = null;
    public factors: Factor[] = null;
    public profilForm: FormGroup;
    public subFlow: any = null;
    public selectedCountry: string;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private productService: ProductService,
        private store: Store<State>,
        private uexPopup: UexPopupService,
        private uexSidenavService: UexSidenavService
    ) {
        this.store.pipe(select(selectors.getFactor)).subscribe((data) => {
            this.factors = data;
        });

        combineLatest([
            this.store.pipe(select(selectors.selectEntityPolicy)),
            this.store.pipe(select(selectors.selectPersonalisationSubFlow, PROFILE_DETAILS)),
        ]).subscribe(([dataEntity, dataSubFlow]) => {
            if (dataSubFlow && dataSubFlow.fields && dataEntity) {
                this.subFlow = dataSubFlow.fields;
                this.entityFormValue = dataEntity;
                this.buildForm();
            }
        });

        this.store.pipe(select(selectors.getSelectedCountry)).subscribe((data) => {
            this.selectedCountry = data;
        });

        this.store.pipe(select(selectors.isLeftMenuSet)).subscribe((isSet) => {
            if (isSet) {
                this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: PROFILE_DETAILS}));
            }
        });
    }

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((entityPolicy) => {
            this.entityPolicy = entityPolicy;
        });
    }

    private buildForm(): void {
        this.profilForm = this.fb.group({});
        this.subFlow.form_controls.map((formControl) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityFormValue);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.profilForm.addControl(formControl.id, control);
        });

        this.subFlow.agreement.map((formControl) => {
            const value = this.formService.findValueWithObjectReference(formControl, this.entityFormValue);
            const validators = this.formService.buildValidators(formControl);
            const control = this.fb.control(value, validators);
            this.profilForm.addControl(formControl.id, control);
        });
    }

    setControlValueById(type: string, formControlName: string): void {
        const control = this.profilForm.get(formControlName);
        control.setValue(type);
    }

    getNumber(value: string, id: string): void {
        this.setControlValueById(value, id);
    }

    isValidNumber(isValid: boolean, id: string): void {
        if (!isValid) {
            this.profilForm.get(id).setErrors({invalidPhone: !isValid});
        } else {
            this.profilForm.get(id).setErrors(null);
        }
    }

    openHelptip(id: string): void {
        const healthTips = this.subFlow.help_tips[id];
        this.uexSidenavService.setSidenavData(healthTips.title, healthTips.content);
        this.uexSidenavService.open();
    }

    continue(): void {
        if (this.profilForm.invalid) {
            return;
        }
        const entityPolicyPayload = this.getUpdatedEntitiyPolicy(this.entityPolicy);
        this.store
            .pipe(take(1), select(selectors.getOfferId))
            .subscribe((offerId) => {
                if (!offerId) {
                    this.productService
                        .getOfferId()
                        .then((data) => {
                            this.store.dispatch(actions.setOfferId({offer_id: data}));
                            this.store.dispatch(
                                actions.postPersonalisation({
                                    entity_policy: entityPolicyPayload,
                                    currentFlow: PROFILE_DETAILS,
                                    offerId: data,
                                })
                            );
                        })
                        .catch(() => {
                            this.uexPopup.error(
                                null,
                                'Unable to get offer id. Please contact the administrator. Thank you.'
                            );
                        });
                } else {
                    this.store.dispatch(
                        actions.postPersonalisation({
                            entity_policy: entityPolicyPayload,
                            currentFlow: PROFILE_DETAILS,
                            offerId,
                        })
                    );
                }
            })
            .unsubscribe();
    }

    getUpdatedEntitiyPolicy(entitiyPolicy: any): any {
        let newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectPersonalisationFormControls(PROFILE_DETAILS)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            formControl.object_reference.map((objectReference: any) => {
                const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                    objectReference,
                    newEntityPolicy,
                    this.profilForm.get(formControl.id).value
                );
                _.set(newEntityPolicy, newPath, updatedValue);
            });
        });

        newEntityPolicy = this.setAgreementValue(newEntityPolicy);

        this.store.dispatch(
            actions.setEntityPolicy({
                entity_policy: newEntityPolicy,
            })
        );
        return newEntityPolicy;
    }

    setAgreementValue(payload: any): any {
        const result = {...payload};
        this.subFlow.agreement.map((item) => {
            if ('object_reference' in item) {
                item.object_reference.map((objectReference) => {
                    const reference = objectReference.reference;
                    const existingValue = this.formService.getPathWithReference(reference, result);
                    if (reference !== undefined) {
                        const newPath = this.formService.createNewPathForArrayIndex(reference);
                        const updatedValue = this.formService.updateValueByType(existingValue, {
                            [objectReference.name]: this.profilForm.value[item.id],
                        });
                        _.set(result, newPath, updatedValue);
                    }
                });
            }
        });
        return result;
    }
}
