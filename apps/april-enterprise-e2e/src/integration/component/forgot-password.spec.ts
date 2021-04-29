/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';

describe('Component - Forgot password', () => {
    beforeEach(() => {
        cy.visit('/fr-fr/personalisation/profile-details');
    });

    it('should display forgot password modal', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.get('div.modal-dialog').find('h4').contains('Connexion').should('be.visible');
        cy.contains('Mot de passe oublié?').click();


        cy.get('div.modal-content').contains('Mot de passe oublié').should('be.visible');
        cy.get('#close-btn').should("have.css", "cursor", "pointer");
        cy.get('span:contains("×")').should('be.visible');
        cy.get('#forgotPasswordEmail').should('be.empty');
        cy.get('#forgotPasswordEmail').should('have.class', 'ng-invalid');
        cy.get('button:contains("Envoyer")').should('be.visible');
    });

    it('should display an error message and email address is not entered', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.get('div.modal-dialog').find('h4').contains('Connexion').should('be.visible');
        cy.contains('Mot de passe oublié?').click();
        cy.get('div.modal-content').contains('Mot de passe oublié').should('be.visible');
        cy.get('button:contains("Envoyer")').click();

        cy.get('div.modal-dialog').contains('L\'Email est obligatoire').should('be.visible');
        cy.get('#forgotPasswordEmail')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)")       // asserting top, right, bottom and left 
            .should("have.css", "background-image", 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\' viewBox=\'0 0 12 12\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")')
            .should('be.visible');
    });
});