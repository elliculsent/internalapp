import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromActions from '@individual-modular/actions';
import {
    CHILD,
    COUPLE,
    DEPENDANT,
    FAMILY,
    MYSELF,
    PERSONALISATION_LINK,
    POLICY_HOLDER_AND_CHILD,
    POLICY_HOLDER_ONLY,
    PROFILE_CUSTOMISATION,
} from '@uex/uex-constants';
import {State} from '@individual-modular/reducers';
import * as selectors from '@individual-modular/selectors';

@Injectable()
export class ProfileCustomisationEffects {
    constructor(private actions: Actions, private store: Store<State>, private router: Router) {}

    setProfileCustomisation$: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.setProfileCustomisation),
            switchMap((action) =>
                of(action).pipe(
                    withLatestFrom(this.store.select(selectors.getFamilyComposition)),
                    // tslint:disable-next-line:cyclomatic-complexity
                    map(([{currentFlow, offerId}, familyComposition]) => {
                        const actions = [];
                        actions.push(
                            fromActions.setPersonalisationValidSubflow({
                                sub_flow: currentFlow,
                            })
                        );
                        if (currentFlow === MYSELF) {
                            if (familyComposition === POLICY_HOLDER_ONLY) {
                                actions.push(fromActions.removeInsured({insured_type: ['SPOUSE', 'CHILD']}));
                                actions.push(
                                    fromActions.postPersonalisation({
                                        currentFlow: PROFILE_CUSTOMISATION,
                                        offerId,
                                    })
                                );
                            } else if (familyComposition === COUPLE || familyComposition === FAMILY) {
                                actions.push(
                                    fromActions.setNextProfileCustomisation({
                                        nextFlow: DEPENDANT,
                                    })
                                );
                            } else if (familyComposition === POLICY_HOLDER_AND_CHILD) {
                                actions.push(
                                    fromActions.setNextProfileCustomisation({
                                        nextFlow: CHILD,
                                    })
                                );
                            }
                        } else if (currentFlow === DEPENDANT) {
                            if (familyComposition === FAMILY) {
                                actions.push(
                                    fromActions.setNextProfileCustomisation({
                                        nextFlow: CHILD,
                                    })
                                );
                            } else {
                                if (familyComposition === COUPLE) {
                                    actions.push(fromActions.removeInsured({insured_type: ['CHILD']}));
                                }
                                actions.push(
                                    fromActions.postPersonalisation({
                                        currentFlow: PROFILE_CUSTOMISATION,
                                        offerId,
                                    })
                                );
                            }
                        } else if (currentFlow === CHILD) {
                            if (familyComposition === POLICY_HOLDER_AND_CHILD) {
                                actions.push(fromActions.removeInsured({insured_type: ['SPOUSE']}));
                            }
                            actions.push(
                                fromActions.postPersonalisation({
                                    currentFlow: PROFILE_CUSTOMISATION,
                                    offerId,
                                })
                            );
                        }
                        return actions;
                    })
                )
            ),
            mergeMap((allActions) => allActions)
        )
    );

    setNextProfileCustomisation$: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.setNextProfileCustomisation),
            switchMap((action) =>
                of(action).pipe(
                    withLatestFrom(
                        this.store.select(selectors.getSelectedCountryLanguage),
                        this.store.select(selectors.getSubflowLink, {
                            mainflow: 'personalisation',
                            subflow: action.nextFlow,
                        })
                    ),
                    map(([{nextFlow}, selectedLanguageCountry, link]) => {
                        const actions = [];
                        this.router.navigateByUrl(`${selectedLanguageCountry}/${PERSONALISATION_LINK}/${link}`);
                        actions.push(
                            fromActions.setPersonalisationNextSubflow({
                                sub_flow: nextFlow,
                            })
                        );
                        return actions;
                    })
                )
            ),
            mergeMap((allActions) => allActions)
        )
    );
}
