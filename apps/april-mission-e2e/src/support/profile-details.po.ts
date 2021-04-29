export const getGreeting = () => cy.get('.personnaliser-container').find('h1');
export const getContinueBtn = () => cy.get('.personnaliser-container').find('#continueBtn');
export const getProfileDetailsForm = () => cy.get('.personnaliser-container').find('#profileDetailsForm');
