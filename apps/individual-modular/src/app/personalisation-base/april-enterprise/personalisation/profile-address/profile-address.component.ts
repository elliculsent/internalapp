import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, of, timer} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';
import * as _ from 'lodash';

import * as actions from '@individual-modular/actions';
import {UexPopupService} from '@uex/uex-popup';
import {DANGER_ZONE, PERSONALISATION_LINK, PROFILE_ADDRESS, PROFILE_CUSTOMISATION_LINK} from '@uex/uex-constants';
import {EntityPolicy} from '@uex/uex-models';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';
import {FormService, UtilsService} from '@individual-modular/services/index';

@Component({
    selector: 'app-profile-address',
    templateUrl: './profile-address.component.html',
    styleUrls: ['./profile-address.component.scss'],
})
export class ProfileAddressComponent implements OnInit {
    public entityPolicy: EntityPolicy = null;
    public filteredCodes$: Observable<string[]>;
    public addressForm: FormGroup;
    public subFlowFields$: Observable<any>;

    constructor(
        private fb: FormBuilder,
        private formService: FormService,
        private store: Store<State>,
        private router: Router,
        private uexPopup: UexPopupService,
        private utilsService: UtilsService
    ) {}

    ngOnInit(): void {
        this.store.pipe(select(selectors.selectEntityPolicy)).subscribe((data) => {
            this.entityPolicy = data;
        });
        this.store.dispatch(actions.setPersonalisationActiveSubflow({sub_flow: PROFILE_ADDRESS}));
        this.store
            .pipe(selectors.selectPersonalisationFields(PROFILE_ADDRESS))
            .subscribe((data) => {
                this.subFlowFields$ = of(data);
            })
            .unsubscribe();
        this.buildForm();
    }

    buildForm(): void {
        this.subFlowFields$.subscribe((fields) => {
            this.addressForm = this.fb.group({});
            fields.form_controls.map((formControl: any) => {
                const value = this.formService.findValueWithObjectReference(formControl, this.entityPolicy);
                const validators = this.formService.buildValidators(formControl);
                const control = this.fb.control(value, validators);

                if (formControl.id === 'address_postcode') {
                    control.setAsyncValidators(this.validatePostalViaServer.bind(this));
                }
                this.addressForm.addControl(formControl.id, control);
            });
        });
    }

    validatePostalViaServer({value}: AbstractControl): Observable<ValidationErrors | null> {
        return timer(400).pipe(
            switchMap(() => this.utilsService.isPostalExist(value)),
            map((response: any) => {
                const foundPostalCode = response.data.filter(
                    (postalCodeData: {[key: string]: any}) => postalCodeData.name === value
                );
                if (foundPostalCode.length) {
                    this.addressForm.get(DANGER_ZONE.toLowerCase()).patchValue(foundPostalCode[0].value);
                    return null;
                }
                return {
                    isExists: false,
                };
            })
        );
    }

    private getUpdatedEntitiyPolicy(): void {
        const newEntityPolicy = JSON.parse(JSON.stringify(this.entityPolicy));
        const entitiyPolicyControls = this.store.pipe(
            take(1),
            selectors.selectPersonalisationFormControls(PROFILE_ADDRESS)
        );
        entitiyPolicyControls.subscribe((formControl: any) => {
            formControl.object_reference.map((objectReference: any) => {
                const formValue = this.formService.getValueByControlType(
                    formControl.type,
                    this.addressForm.get(formControl.id).value
                );
                if (formControl.id === DANGER_ZONE.toLowerCase()) {
                    const insuredCopy: any[] = newEntityPolicy.policy.group[0].insured.slice(0);
                    for (let index = 0; index < insuredCopy.length; index++) {
                        const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                            objectReference,
                            newEntityPolicy,
                            formValue,
                            index
                        );
                        _.set(newEntityPolicy, newPath, updatedValue);
                    }
                } else {
                    const {newPath, updatedValue}: any = this.formService.getUpdatedPathValue(
                        objectReference,
                        newEntityPolicy,
                        formValue
                    );
                    _.set(newEntityPolicy, newPath, updatedValue);
                }
            });

            this.store.dispatch(
                actions.setEntityPolicy({
                    entity_policy: newEntityPolicy,
                })
            );
        });
    }

    continue(): void {
        if (this.addressForm.invalid) {
            return;
        }
        this.getUpdatedEntitiyPolicy();

        this.store.pipe(select(selectors.getOfferId)).subscribe((offerId) => {
            if (offerId) {
                this.store.dispatch(
                    actions.postPersonalisation({
                        currentFlow: PROFILE_ADDRESS,
                        offerId,
                    })
                );
            } else {
                this.uexPopup.error(null, 'Unable to get offer id. Please contact the administrator. Thank you.');
            }
        });
    }

    back(): void {
        this.store.select(selectors.getSelectedCountryLanguage).pipe(take(1)).subscribe((selectedLanguageCountry) => {
            this.router.navigateByUrl(
                `${selectedLanguageCountry}/${PERSONALISATION_LINK}/${PROFILE_CUSTOMISATION_LINK}`
            );
        });
    }
}
