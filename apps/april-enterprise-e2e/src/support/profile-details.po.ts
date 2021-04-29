export const getGreeting = () => cy.get('.personnaliser-container').find('h1');
export const getContinueBtn = () => cy.get('.personnaliser-container').find('#continueBtn');
export const getProfileDetailsForm = () => cy.get('.personnaliser-container').find('#profileDetailsForm');
export const getMenu = () => cy.get('.container-fluid').find('.fa-uex-bars');
export const getLogin = () => cy.contains('Connexion');
export const getPolicyDurationForm = () => cy.get('.personnaliser-container').find('#policyDurationForm');