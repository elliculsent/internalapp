import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {
    CIVIC_RESPONSABILITY_LINK,
    COVERAGE_CARD_LINK,
    CUSTOMISATION_CIVIC_RESPONSABILITY,
    CUSTOMISATION_COVERAGE_CARD,
    CUSTOMISATION_DEATH_AND_INVALIDITY,
    CUSTOMISATION_INJURY_TABLE,
    CUSTOMISATION_MEDICAL_FEES,
    CUSTOMISATION_SECURITY_TABLE,
    CUSTOMISATION_TRAVEL_SERVICES,
    DEATH_AND_INVALIDITY_LINK,
    INJURY_TABLE_LINK,
    MEDICAL_FEES_LINK,
    QUOTATION,
    SECURITY_TABLE_LINK,
    TRAVEL_SERVICES_LINK,
} from '@uex/uex-constants';
import {ProductService} from '@uex/uex-services';
import {environment} from '@individual-modular/environment/environment';

@Injectable()
export class QuotationContentResolver implements Resolve<any> {
    private subFlow: string;

    constructor(private productService: ProductService) {
        this.productService.setBaseUrl = environment.baymax_backend_root_url;
        this.productService.setProductCode = environment.product.code;
    }

    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        switch (route.url[0].path) {
            case COVERAGE_CARD_LINK:
                this.subFlow = CUSTOMISATION_COVERAGE_CARD;
                return this.getSubflowContent();

            case SECURITY_TABLE_LINK:
                this.subFlow = CUSTOMISATION_SECURITY_TABLE;
                return this.getSubflowContent();

            case DEATH_AND_INVALIDITY_LINK:
                this.subFlow = CUSTOMISATION_DEATH_AND_INVALIDITY;
                return this.getSubflowContent();

            case CIVIC_RESPONSABILITY_LINK:
                this.subFlow = CUSTOMISATION_CIVIC_RESPONSABILITY;
                return this.getSubflowContent();

            case INJURY_TABLE_LINK:
                this.subFlow = CUSTOMISATION_INJURY_TABLE;
                return this.getSubflowContent();

            case TRAVEL_SERVICES_LINK:
                this.subFlow = CUSTOMISATION_TRAVEL_SERVICES;
                return this.getSubflowContent();

            case MEDICAL_FEES_LINK:
                this.subFlow = CUSTOMISATION_MEDICAL_FEES;
                return this.getSubflowContent();
        }
    }

    private getSubflowContent(): Promise<any> {
        return this.productService.getSubflowContent(QUOTATION, this.subFlow);
    }
}
