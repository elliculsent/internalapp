import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import * as fromActions from '@uex/uex-store/actions';
import {GoogleTagManagerService} from '@uex/uex-services';
import {UtilsService} from '@individual-modular/services/utils.service';

@Injectable()
export class LeadAcquisitionEffects {
    constructor(
        private actions: Actions,
        private gtmService: GoogleTagManagerService,
        private utilsService: UtilsService
    ) {}

    postLeadAcquisition: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofType(fromActions.postLeadAcquisition),
            map(({lead_acquisition, intermediaryCode}) => {
                this.utilsService.postLeadAcquisition(lead_acquisition, intermediaryCode).subscribe(() => {
                    this.gtmService.pushToDataLayer({event: 'leadGenerated'});
                });
                return fromActions.setLeadAcquisition({lead_acquisition});
            })
        )
    );
}
