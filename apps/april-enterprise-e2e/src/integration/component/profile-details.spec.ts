/// <reference types="cypress" />

import {getContinueBtn, getProfileDetailsForm} from '../../support/profile-details.po';

describe('Component - Profile details', () => {
    beforeEach(() => {
        cy.visit('/fr-fr/personalisation/profile-details')
        sessionStorage.removeItem('entity_policy');
    });

    it('should see Mes coordonnées in the left side menu', () => {
        cy.get("div.position-fixed.menu-links").contains("Mes coordonnées").should('exist');
    });


    it('should disable the continue button', () => {
        getProfileDetailsForm().within(() => {
            cy.get('#m_policy_holder_firstname').should('have.class', 'ng-invalid');
            cy.get('#m_policy_holder_lastname').should('have.class', 'ng-invalid');
            cy.get('#m_policy_holder_email').should('have.class', 'ng-invalid');
            cy.get('#policy_holder_phone_number').should('have.value', '');
        });
        expect(getContinueBtn().should('be.disabled'));
        cy.get("div.position-fixed.menu-links").contains("Mes coordonnées").should('exist');
    });

    it('should enable the continue button', () => {
        getProfileDetailsForm().within(() => {
            cy.get('#m_policy_holder_firstname').type('test').should('have.class', 'ng-valid');
            cy.get('#m_policy_holder_lastname').type('test').should('have.class', 'ng-valid');
            cy.get('#m_policy_holder_email').type('test@test.com').should('have.class', 'ng-valid');
            cy.get('input[type="tel"]').clear().type('612345678');
            cy.get('input[type="tel"]').should('have.value', '+33 6 12 34 56 78');
        });
        expect(getContinueBtn().should('be.enabled'));
    });

    it('should redirect to date d effect component', () => {
        getProfileDetailsForm().within(() => {
            cy.get('#m_policy_holder_firstname').clear().type('Dummy data').should('have.class', 'ng-valid');
            cy.get('#m_policy_holder_lastname').clear().type('Dummy data').should('have.class', 'ng-valid');
            cy.get('#m_policy_holder_email').type('test@test.com').should('have.class', 'ng-valid');
            cy.get('input[type="tel"]').clear().type('612345678');
            cy.get('input[type="tel"]').should('have.value', '+33 6 12 34 56 78');
        });

        getContinueBtn().click();
        expect(cy.url().should('contain', '/fr-fr/personalisation/policy-duration'));
    });
});
