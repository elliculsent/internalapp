/// <reference types="cypress" />
import {getDetail} from '../../support/policy-duration.po';
import {getContinueBtn, getProfileDetailsForm, getMenu} from '../../support/profile-details.po';

describe('Component - Profile customisation', () => {
    beforeEach(() => { 
        cy.visit('/fr-fr/personalisation/profile-details');
        sessionStorage.removeItem('entity_policy');
    });

    it('should display Mon Profil in the left side menu', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
            getContinueBtn().click();
        });

        cy.populateEffectiveDate();
        getContinueBtn().click({force: true});
        
        expect(cy.url().should('contain', '/fr-fr/personalisation/profile-customisation'));
        cy.get("div.position-fixed.menu-links").contains("Mon profil").should('exist');
        getDetail().contains('Qui souhaitez-vous couvrir ?');
    });

});