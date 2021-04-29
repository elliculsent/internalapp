import {getContinueBtn, getGreeting, getProfileDetailsForm} from '../support/profile-details.po';

describe('profile-details', () => {
    beforeEach(() => cy.visit('/fr-fr/personalisation/profile-details'));

    it('should display welcome message', () => {
        // Custom command example, see `../support/commands.ts` file
        // cy.login('my-email@something.com', 'myPassword');

        // Function helper example, see `../support/app.po.ts` file
        getGreeting().contains('Bienvenue!');
    });

});
