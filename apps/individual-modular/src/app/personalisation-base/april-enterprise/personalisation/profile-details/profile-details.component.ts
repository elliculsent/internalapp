import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {PROFILE_DETAILS} from '@uex/uex-constants';
import {EntityPolicy, SubFlow} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService} from '@individual-modular/services/form.service';
import {ProductService} from '@uex/uex-services';

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
    private entityPolicy: EntityPolicy = null;
    public profileDetailsForm: FormGroup;
    public selectedCountry$: Observable<string>;
    public subFlow$: Observable<SubFlow>;
    public subFlowFields$: Observable<any>;
    private subscription: Subscription;
    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private productService: ProductService,
        private store: Store<State>,
        private uexPopup: UexPopupService
    ) {}

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((entityPolicy) => {
            this.entityPolicy = entityPolicy;
        });
        this.selectedCountry$ = this.store.pipe(select(selectors.getSelectedCountry));
        this.subFlowFields$ = this.store.pipe(selectors.selectPersonalisationFields(PROFILE_DETAILS));

        this.buildForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    buildForm(): void {
        this.subscription = this.subFlowFields$.subscribe((fields) => {
            this.profileDetailsForm = this.fb.group({});
            fields.form_controls.map((formControl: any) => {
                const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                const validators = this.formService.buildValidators(formControl);
                const control = this.fb.control(value, validators);
                this.profileDetailsForm.addControl(formControl.id, control);
            });
        });
    }

    getNumber(value: string, id: string): void {
        const control = this.profileDetailsForm.get(id);
        control.setValue(value);
    }

    isValidNumber(isValid: boolean, id: string): void {
        if (!isValid) {
            this.profileDetailsForm.get(id).setErrors({invalidPhone: !isValid});
        } else {
            this.profileDetailsForm.get(id).setErrors(null);
        }
    }

    getUpdatedEntitiyPolicy(entitiyPolicy: any): any {
        const newEntityPolicy = JSON.parse(JSON.stringify(entitiyPolicy));
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectPersonalisationFormControls(PROFILE_DETAILS)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            formControl.object_reference.map((objectReference: any) => {
                const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                    objectReference,
                    newEntityPolicy,
                    this.profileDetailsForm.get(formControl.id).value
                );
                _.set(newEntityPolicy, newPath, updatedValue);
            });
        });
        this.store.dispatch(
            actions.setEntityPolicy({
                entity_policy: newEntityPolicy,
            })
        );
        return newEntityPolicy;
    }

    continue(): void {
        if (this.profileDetailsForm.invalid) {
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
}
