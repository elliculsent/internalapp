/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';

describe('Login user', () => {
    beforeEach(() => {
        sessionStorage.removeItem('entity_policy');
        cy.visit('/fr-fr/personalisation/profile-details');
    });

    it('should display error pop up mesage when password entered is not correct', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();

        cy.fixture("baymax-user.json").then((baymaxUser) => {

            cy.get('#email').clear().type(baymaxUser.valid_email_address);
            cy.get('#password').clear().type(baymaxUser.common_password);
            cy.get('button:contains("Connexion")').click();

            cy.intercept('POST', '/api/v2/account/login/',).as('loginResponse');
            cy.wait('@loginResponse').should(({ request, response }) => {
                console.log(response);
                expect(response.statusCode).to.be.equal(400)
                expect(response && response.body).to.have.property('error_title', 'Erreur')

                cy.get('div.modal-dialog').contains('Erreur');
                cy.get('div.modal-dialog').contains('Email ou mot de passe incorrect.');
                cy.get('#close-btn').should("have.css", "cursor", "pointer");
                cy.get('span:contains("×")').should('be.visible');

                cy.get('span:contains("×")').click();
                cy.wait(100);
                cy.get('div.modal-dialog').find('h4').contains('Connexion').should('be.visible');
                cy.get('#email').should('be.empty');
                cy.get('#password').should('be.empty');
                cy.get('#email').should('have.class', 'ng-invalid');
                cy.get('#password').should('have.class', 'ng-invalid');
            });
        });
    });

    it('should login with a valid account', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();

        let emaillAddress = "tech+automation@uexglobal.com";
        let password = "testT3st";
        cy.get('#email').clear().type(emaillAddress);         //TO IMPROVE: move this test account to fixture
        cy.get('#password').type(password);
        cy.get('button:contains("Connexion")').click();

        cy.intercept('POST', '/api/v2/account/login/').as('loginResponse');
        cy.wait('@loginResponse').should(({ request, response }) => {
            console.log(response);
            expect(response.statusCode).to.be.equal(200);
            expect(response && response.body).to.have.property('token');
            expect(response && response.body).to.have.property('user');
        });

        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        cy.contains('Déconnexion').should('be.visible');

        cy.intercept('POST', '/api/v2/account/logout/').as('logoutResponse');
        cy.contains('Déconnexion').click();

        cy.wait('@logoutResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.equal(200);
            expect(response && response.body).to.be.equal('User has been logout successfully!');
        });
    });

    it('should login with a valid account and redirect to policy duration component', () => {

        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
        getLogin().click();

        // 1. Login with existing account
        let emaillAddress = "tech+automation@uexglobal.com";
        let password = "testT3st";
        cy.get('#email').clear().type(emaillAddress);         //TO IMPROVE: move this test account to fixture
        cy.get('#password').type(password);
        cy.get('button:contains("Connexion")').click();

        cy.intercept('POST', '/api/v2/account/login/',).as('loginResponse');
        cy.wait('@loginResponse').should(({ request, response }) => {
            expect(response.statusCode).to.be.equal(200);
            expect(response && response.body).to.have.property('token');

            // 2. Enter details
            cy.get('.personnaliser-container').find('#profileDetailsForm').within(() => {
                cy.get('#m_policy_holder_firstname').clear().type('Dummy data').should('have.class', 'ng-valid');
                cy.get('#m_policy_holder_lastname').clear().type('Dummy data').should('have.class', 'ng-valid');
                cy.get('#m_policy_holder_email').type('test@test.com').should('have.class', 'ng-valid');
                cy.get('input[type="tel"]').clear().type('612345678');
                cy.get('input[type="tel"]').should('have.value', '+33 6 12 34 56 78');
            });

            // 3. Go to next component
            cy.get('.personnaliser-container').find('#continueBtn').click();
            expect(cy.url().should('contain', '/fr-fr/personalisation/policy-duration'));

            // 4. Logout
            getMenu().click();
            cy.get('.dark-sidenav-container').should('be.visible');
            cy.contains('Déconnexion').click();

            // 5. Login again
            getMenu().click();
            cy.get('.dark-sidenav-container').should('be.visible');
            getLogin().click();
            cy.get('#email').clear().type(emaillAddress);
            cy.get('#password').type(password);
            cy.get('button:contains("Connexion")').click();

            cy.intercept('POST', '/api/v2/account/login/',).as('loginResponse');
            cy.wait('@loginResponse').should(({ request, response }) => {
                expect(response.statusCode).to.be.equal(200);
                expect(response && response.body).to.have.property('token');

                // Assert that the user will be redirected to the component where the user stopped before
                expect(cy.url().should('contain', '/fr-fr/personalisation/policy-duration'));
            });

            getMenu().click();
            cy.get('.dark-sidenav-container').should('be.visible');
            cy.contains('Déconnexion').should('be.visible');

            cy.intercept('POST', '/api/v2/account/logout/').as('logoutResponse');
            cy.contains('Déconnexion').click();

            cy.wait('@logoutResponse').should(({ request, response }) => {
                expect(response.statusCode).to.be.equal(200);
                expect(response && response.body).to.be.equal('User has been logout successfully!');
            });
        });
    });
});