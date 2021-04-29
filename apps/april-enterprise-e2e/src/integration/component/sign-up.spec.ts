/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';
// import baymaxUser from '../../fixtures/baymax-user.json';

describe('Component - Sign up', () => {
    beforeEach(() => {
        cy.visit('/fr-fr/personalisation/profile-details');
    });
    
    it('should display create account form', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte')
            .should("have.class", "c-pointer")
            .should("have.css", "cursor", "pointer")
            .click();
        cy.get('div.modal-content').contains('Créer un compte').should('be.visible');
    });

    it('should have empty fields in the create account pop up', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.contains('Créer un compte').click();
        cy.get('#email').should('be.empty');
        cy.get('#signUpPassword').should('be.empty');
        cy.get('#confirmPassword').should('be.empty');
    });

    it('should display link to login user and create account button with blue color', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();
        cy.contains('Créer un compte').click();
        cy.get('div.modal-content').contains('Créer un compte').should('be.visible');

        cy.get('#signUpBtn').contains('Créer un nouveau compte')
            .should("have.class", "btn-info")
            .should("have.css", "border-color", "rgb(33, 136, 230)")
            .should("have.css", "background-color", "rgb(33, 136, 230)");

        cy.contains('Êtes-vous déjà un utilisateur?').should('be.visible');
        cy.contains('Connectez-vous')
            .should("have.class", "c-pointer")
            .should("have.css", "cursor", "pointer")
            .should('be.visible');
    });

    it('should display invalid password field and error message below email field when only confirm password is entered', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();
        cy.get('#confirmPassword').clear().type('testtest');

        cy.contains('Créer un nouveau compte').click();

        cy.get('#signUpEmail')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
        cy.get('#signUpPassword')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
        cy.get('div.modal-dialog').contains('L\'Email est obligatoire').should('be.visible');
    });

    it('should display invalid field for email and confirm password when only password is entered', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();
        cy.get('#signUpPassword').clear().type('testtest');

        cy.contains('Créer un nouveau compte').click();

        cy.get('#signUpPassword').should('have.class', 'ng-valid').should('have.class', 'is-invalid');
        cy.get('#signUpEmail')
            .should('have.class', 'ng-invalid')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)")
            .should("have.css", "background-image", 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\' viewBox=\'0 0 12 12\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")');
        cy.get('#confirmPassword')
            .should('have.class', 'ng-invalid')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
        cy.get('div.modal-dialog').contains('L\'Email est obligatoire').should('be.visible');
    });

    it('should display invalid field for password and confirm password when only email address is entered', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();
        cy.get('#signUpEmail').clear().type('dummy@test.com').should('have.class', 'ng-valid');

        cy.contains('Créer un nouveau compte').click();

        cy.get('#signUpEmail').should('not.have.class', 'ng-invalid');
        cy.get('#signUpPassword')
            .should('have.class', 'ng-invalid')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
        cy.get('#confirmPassword')
            .should('have.class', 'ng-invalid')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
    });
    
    it('should display invalid field when password and confirm password do not match', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();

        cy.get('#signUpEmail').clear().type('dummy@test.com');
        cy.get('#signUpPassword').type('testtest');
        cy.get('#confirmPassword').type('testt3st');
        cy.contains('Créer un nouveau compte').click();

        cy.get('#signUpEmail').should('not.have.class', 'ng-invalid');
        cy.get('#signUpPassword')
            .should('have.class', 'is-invalid')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");
        cy.get('#confirmPassword')
            .should('have.class', 'is-invalid')
            .should('have.class', 'is-invalid')
            .should("have.css", "border-color", "rgb(220, 53, 69) rgb(220, 53, 69) rgb(220, 53, 69) rgb(73, 80, 87)");;
    });
    
    it('should display error message when passwords do not match', () => {
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();
        cy.contains('Créer un nouveau compte').click();

        cy.fixture('baymax-user.json').then((baymaxUser) => {

            cy.log('baymaxUser', baymaxUser);
            cy.get('#signUpEmail').type(baymaxUser.valid_email_address).should('have.class', 'ng-valid');
            cy.get('#signUpPassword').type(baymaxUser.password).should('have.class', 'ng-valid');
            cy.get('#confirmPassword').type('incorrectpassword').should('have.class', 'ng-valid');
        });

        cy.contains('Créer un nouveau compte').click();
        cy.get('#signUpPassword').should('have.class', 'is-invalid');
        cy.get('#confirmPassword').should('have.class', 'is-invalid');
    });

    it('should display error pop up when password is too common', () => {
        cy.fixture("baymax-user").as("baymaxUser");
        getMenu().click(); 
        cy.get('.dark-sidenav-container').contains('Connexion').click();
        cy.get('div.modal-dialog').contains('Créer un compte').click();
        cy.contains('Créer un nouveau compte').click();

        cy.fixture("baymax-user.json").then((baymaxUser) => {
            cy.get('#signUpEmail').type(baymaxUser.valid_email_address).should('have.class', 'ng-valid');
            cy.get('#signUpPassword').type(baymaxUser.common_password).should('have.class', 'ng-valid');
            cy.get('#confirmPassword').type(baymaxUser.common_password).should('have.class', 'ng-valid');
            cy.contains('Créer un nouveau compte').click();
        });

        cy.intercept('POST', '/api/v2/account/signup/',).as('signupResponse');
        cy.wait('@signupResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.equal(400);
            expect(response && response.body).to.have.property('error_title', 'Erreur');
            cy.get('div.modal-dialog').contains('Erreur');
            expect(cy.get('div.modal-content').should('contain.text', 'Ce mot de passe est trop courant.'));
            cy.get('#close-btn').should("have.css", "cursor", "pointer");
            cy.get('span:contains("×")').should('be.visible');
            cy.get('span:contains("×")').click();
            cy.wait(100);
            cy.get('div.modal-dialog').contains('Créer un compte').should('be.visible');
        });
    });
});