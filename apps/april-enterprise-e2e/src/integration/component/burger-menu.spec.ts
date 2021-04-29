/// <reference types="cypress" />

import {getMenu, getLogin} from '../../support/profile-details.po';

describe('Component - Burger menu', () => {
    beforeEach(() => {
        cy.visit('/fr-fr/personalisation/profile-details');
    });

    it('should display side menu', () => {
        getMenu().click();
        cy.get('.dark-sidenav-container').should('be.visible');
    });

});