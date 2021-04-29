/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';

describe('Sign up user', () => {
    beforeEach(() => {
        sessionStorage.removeItem('entity_policy');
        cy.visit('/fr-fr/personalisation/profile-details');
    });

    it('should display a message that a verification email was sent when the user info was successfully created', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();

        let emailAddress = 'tech+new@uexglobal.com';
        let password = 'testt3st';

        cy.get('#signUpEmail').clear().type(emailAddress);
        cy.get('#signUpPassword').clear().type(password);
        cy.get('#confirmPassword').clear().type('testt3st');
        cy.contains('Créer un nouveau compte').click();

        cy.intercept('POST', '/api/v2/account/signup/',).as('signupResponse');
        cy.wait('@signupResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.oneOf([200, 201]);
            expect(response && response.body).to.have.property('success_title', 'Compte Créé');

            cy.get('div.modal-dialog').contains('Compte Créé');
            cy.get('div.modal-dialog').contains('Votre compte a été créé. Un email de verification vous a été envoyé.');
            cy.get('#close-btn').should("have.css", "cursor", "pointer");
            cy.get('span:contains("×")').should('be.visible');
            cy.get('span:contains("×")').click();
            cy.wait(100);
            cy.get('div.modal-dialog').should('not.exist');
        });
    });

    it('should display an error message when the email used to create account is existing', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();

        let emailAddress = 'tech+automation@uexglobal.com';
        let password = 'testt3st';

        cy.get('#signUpEmail').clear().type(emailAddress);
        cy.get('#signUpPassword').clear().type(password);
        cy.get('#confirmPassword').clear().type(password);
        cy.contains('Créer un nouveau compte').click();

        cy.intercept('POST', '/api/v2/account/signup/',).as('signupResponse');
        cy.wait('@signupResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.equal(400);
            expect(response && response.body).to.have.property('error_title', 'Erreur');
            cy.get('div.modal-dialog').contains('Erreur');
            cy.get('div.modal-dialog').contains('Cette adresse e-mail existe déjà');
            cy.get('#close-btn').should("have.css", "cursor", "pointer");
            cy.get('span:contains("×")').should('be.visible');

            cy.get('span:contains("×")').click();
            cy.wait(100);
            cy.get('div.modal-dialog').find('h4').contains('Créer un compte').should('be.visible');
            cy.get('#signUpEmail').should('be.empty');
            cy.get('#signUpPassword').should('be.empty');
            cy.get('#confirmPassword').should('be.empty');
            cy.get('#signUpEmail').should('have.class', 'ng-invalid');
            cy.get('#signUpPassword').should('have.class', 'ng-invalid');
            cy.get('#confirmPassword').should('have.class', 'ng-invalid');
        });
    });
});