/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';

describe('Burger Menu - Login', () => {
    beforeEach(() => {
        cy.visit('/fr-fr/personalisation/profile-details');
        
    });

     it('should display login modal', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click()
        cy.get('div.modal-dialog').find('h4').contains('Connexion').should('be.visible');
    });

    it('should have empty email and password fields', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.get('#email').should('be.empty');
        cy.get('#password').should('be.empty');
        cy.get('#email').should('have.class', 'ng-invalid');
        cy.get('#password').should('have.class', 'ng-invalid');
    });

    it('should have a clickable forgot password link', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click()

        cy.contains('Mot de passe oublié?')
            .should("have.class", "c-pointer")
            .should("have.css", "cursor", "pointer")
            .should("have.css", "color", "rgb(33, 136, 230)")
            .should('be.visible');
        cy.contains('Je suis un nouvel utilisateur.').should('be.visible');
        cy.contains('Créer un compte ici').should('be.visible');
    });

    it('should have a clickable login button', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click()
        cy.get('button:contains("Connexion")')
        .should("have.class", "btn")
        .should("have.css", "cursor", "pointer")
        .should('be.visible')
        .click();
    });

    it('should have a sentence at the bottom of the login modal', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.contains('Je suis un nouvel utilisateur.').should('be.visible');
        cy.contains('Créer un compte').should('be.visible');
    });

    it('should display an error message and invalid fields with icon when nothing is entered', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.get('button:contains("Connexion")').click();
        cy.get('div.modal-dialog').contains('L\'Email est obligatoire').should('be.visible');
        cy.get('#email')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)")       // asserting top, right, bottom and left 
            .should("have.css", "background-image", 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\' viewBox=\'0 0 12 12\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")')
            .should('be.visible');
        cy.get('#password')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)")       // asserting top, right, bottom and left 
            .should("have.css", "background-image", 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\' viewBox=\'0 0 12 12\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")')
            .should('be.visible');
    });

    it('should display password as invalid field', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click()
        cy.contains('Je suis un nouvel utilisateur.').should('be.visible');
        cy.contains('Créer un compte').should('be.visible');
        cy.get('#email').clear().type('dummy@test.com');
        cy.get('button:contains("Connexion")').click();

        cy.get('#email').should('not.have.class', 'ng-invalid');
        cy.get('#password').should('have.class', 'ng-invalid').should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
    });
});