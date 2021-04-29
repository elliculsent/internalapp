/// <reference types="cypress" />

import {getContinueBtn, getProfileDetailsForm, getMenu} from '../../support/profile-details.po';
import {getDetail, getPolicyDurationForm, getPolicyDurationContinueBtn} from '../../support/policy-duration.po';
import "../../support/commands"
import * as moment from 'moment';


describe('Component - Profile duration', () => {
    beforeEach(() => { 
        cy.visit('/fr-fr/personalisation/profile-details');
        sessionStorage.removeItem('entity_policy');
    });

    it('should display selection of effective date detail', () => {
        //used custom function to login
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        expect(cy.url().should('contain', '/fr-fr/personalisation/policy-duration'));
        getDetail().contains('Veuillez choisir la date d\'effet souhaitée :');
    });


    it('should display Date d’effet on the left side menu', () => {
        //used custom function to login
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("div.position-fixed.menu-links").contains("Date d’effet").should('exist');
    });


    it('should display date picker when clicking on the field', () => {

        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});
        cy.get('.myDpSelector').should('be.visible');

        cy.get("#policy_start_date").click({force: true});
        cy.get('.myDpSelector').should('not.exist');
    });


    it('should not be able to enter preferred start date by default', () => {

        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").should('have.attr', 'readonly');
    });


    it('should display calendar of the month', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});
        
        let today = new Date();
        let translatedDate = moment(today, 'YYYY-MM-DD', 'fr', true);
        cy.log('today, day', moment(translatedDate).format('D'));
        cy.log('today, month', moment(translatedDate).format('MMM'));
        cy.log('today, year', moment(translatedDate).format('YYYY'));

        let monthFR = moment(translatedDate).format('MMM').split('.');
        let strMonth = monthFR[0].charAt(0).toUpperCase() + monthFR[0].slice(1);
        cy.get('div.myDpMonthYearText:contains(' + strMonth + ')')
            .should('be.visible')
            .then(($button) => {
                cy.get("#policy_start_date").click({force: true});
                cy.get('.myDpSelector').should('not.exist');
            });
    });


    it('should display indicate the day of the month', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});
        let today = new Date();
        cy.get('span.myDpMarkCurrDay:contains(' + moment(today).format('D') + ')')
            .should('be.visible')
            .then(($button) => {
                cy.get("#policy_start_date").click({force: true});
                cy.get('.myDpSelector').should('not.exist');
            });
    });

    
    it('should display 12 months when current month is clicked', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});

        let today = new Date();
        let translatedDate = moment(today, 'YYYY-MM-DD', 'fr', true);
        cy.log('today, day', moment(translatedDate).format('D'));
        cy.log('today, month', moment(translatedDate).format('MMM'));
        cy.log('today, year', moment(translatedDate).format('YYYY'));

        let monthFR = moment(translatedDate).format('MMM').split('.');
        let strMonth = monthFR[0].charAt(0).toUpperCase() + monthFR[0].slice(1);
        cy.get('button.myDpMonthLabel:contains(' + strMonth + ')').click();

        function getMonthNames(lang, frmt) {
            let userLang = moment.locale();                   // Save user language
            moment.locale(lang);                              // Switch to specified language
            let months = [];                                    // Months array
            let m = moment(moment(today).format('YYYY'));       // Create a moment in 2011
            for (let i = 0; i < 12; i++)                        // Loop from 0 to 12 (exclusive)
                months.push(m.month(i).format(frmt));           // Append the formatted month
            moment.locale(userLang);                          // Restore user language
            return months;                                  // Return the array of months
        }

        let monthArray = getMonthNames('fr', 'MMM');

        monthArray.forEach(month => {
            let monthFR = month.match(/.{1,3}/g)
            console.log('monthFR', monthFR);
            let strMonth = monthFR[0].charAt(0).toUpperCase() + monthFR[0].slice(1);
            console.log('strMonth', strMonth);
            cy.get('div.myDpSelector:contains(' + strMonth + ')').should('be.visible');
        });
    });

    it('should display arrow right to navigate to the next month', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});

        let today = new Date();
        let translatedDate = moment(today, 'YYYY-MM-DD', 'fr', true).add(1, 'month');
        let nextMonthFR = moment(translatedDate).format('MMM').split('.');
        let strMonth = nextMonthFR[0].charAt(0).toUpperCase() + nextMonthFR[0].slice(1);
        cy.get('button.myDpIconRightArrow').click();
        cy.get('div.myDpSelector:contains(' + strMonth + ')').should('be.visible');
    });

    it('should display the date selected', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});

        let today = new Date();
        let translatedDate = moment(today, 'YYYY-MM-DD', 'fr', true);
        let todayDate = moment(today).format('DD-MM-YYYY');
        cy.get('span:contains(' + moment(translatedDate).format('D') + ')').click();
        cy.get("#policy_start_date").should('have.class', 'ng-valid');
        cy.get("#policy_start_date").should('have.value', todayDate);
    });

    it('should redirect to Mon Profil component', () => {
        cy.fixture("baymax-user.json").then((baymaxUser) => {
            let mockContact = baymaxUser.mockPolicy;
            cy.populateContactDetails(mockContact);
        });
        getContinueBtn().click();
        cy.get("#policy_start_date").click({force: true});

        let today = new Date();
        let translatedDate = moment(today, 'YYYY-MM-DD', 'fr', true);
        let todayDate = moment(today).format('DD-MM-YYYY');
        cy.get('span:contains(' + moment(translatedDate).format('D') + ')').click();
        cy.get("#policy_start_date").should('have.class', 'ng-valid');
        cy.get("#policy_start_date").should('have.value', todayDate);
        getContinueBtn().click({force: true});

        expect(cy.url().should('contain', '/fr-fr/personalisation/profile-customisation'));
        getDetail().contains('Qui souhaitez-vous couvrir ?');
    });


    it.skip('should disable the continue button', () => {
        getContinueBtn().click();
        getPolicyDurationForm().within(() => {
            cy.get('#policy_start_date').should('have.class', 'ng-invalid');
        });

        expect(getPolicyDurationContinueBtn().should('be.disabled'));
    });

    it.skip('should enable the continue button', () => {
        getContinueBtn().click();
        getPolicyDurationForm().within(() => {
            cy.get('#policy_start_date').click({force: true});
            cy.get('.myDpMarkCurrDay').click();
        });
        
        expect(getPolicyDurationContinueBtn().should('be.enabled'));
    });

    it.skip('should redirect to profile customisation component', () => {

        getContinueBtn().click();
        // getPolicyDurationContinueBtn().click();
        cy.get('.personnaliser-container').find('#continueBtn').click();

        expect(cy.url().should('contain', '/fr-fr/personalisation/profile-customisation'));
        // getDetail().contains('Qui souhaitez-vous couvrir ?');
    });
});
