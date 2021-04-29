/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';

describe('Component - Forgot password', () => {
    beforeEach(() => {
        cy.visit('/fr-fr/personalisation/profile-details');
        
    });

    it('should display email does not exist error message when trying to reset not existing email', () => {

        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.get('div.modal-dialog').find('h4').contains('Connexion').should('be.visible');
        cy.contains('Mot de passe oublié?').click();

        cy.get('div.modal-content').contains('Mot de passe oublié').should('be.visible');
        cy.get('#forgotPasswordEmail').clear().type("tech+notexisting@uexglobal.com");
        cy.get('button:contains("Envoyer")').click();

        cy.intercept('POST', '/api/v2/account/password/forgots/',).as('forgotPasswordResponse');
        cy.wait('@forgotPasswordResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.equal(404)
            expect(response && response.body).to.have.property('error_message', 'Cet email n\'existe pas');

            cy.get('div.modal-dialog').contains('Error');
            cy.get('div.modal-dialog').contains('Cet email n\'existe pas');
            cy.get('#close-btn').should("have.css", "cursor", "pointer");
            cy.get('span:contains("×")').should('be.visible');

            cy.get('span:contains("×")').click();
            cy.wait(100);
            cy.get('div.modal-content').contains('Mot de passe oublié').should('be.visible');
            cy.get('#forgotPasswordEmail').should('be.empty');
            cy.get('#forgotPasswordEmail').should('have.class', 'ng-invalid');
            cy.get('#close-btn').click();
            cy.wait(100);
            cy.get('div.modal-dialog').should('not.exist');
        });
    });

    it('should display a message that a forgot password email was sent when email is existing', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').find('h4').contains('Connexion').should('be.visible');
        cy.contains('Mot de passe oublié?').click();

        cy.get('div.modal-content').contains('Mot de passe oublié').should('be.visible');
        cy.get('#forgotPasswordEmail').clear().type("tech+automation@uexglobal.com");
        cy.get('button:contains("Envoyer")').click();

        cy.intercept('POST', '/api/v2/account/password/forgots/',).as('forgotPasswordResponse');
        cy.wait('@forgotPasswordResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.oneOf([200, 202]);
            expect(response && response.body).to.have.property('success_title', 'Mot de passe oublié?');

            cy.get('div.modal-dialog').contains('Mot de passe oublié?');
            cy.get('div.modal-dialog').contains('Un email vous a été envoyé afin de changer votre mot de passe');
            cy.get('#close-btn').should("have.css", "cursor", "pointer");
            cy.get('span:contains("×")').should('be.visible');
            cy.get('span:contains("×")').click();
            cy.wait(100);
            cy.get('div.modal-dialog').should('not.exist');
        });
    });

});