/// <reference types="cypress" />

import {getProfileDetailsForm, getPolicyDurationForm} from '../support/profile-details.po';
import * as moment from 'moment';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      populateContactDetails: typeof populateContactDetails;
      populateEffectiveDate: typeof populateEffectiveDate;
    }
  }
}

function populateContactDetails(contactDetail) {
  getProfileDetailsForm().within(() => {
    cy.get('#m_policy_holder_firstname').type(contactDetail.firstname).should('have.class', 'ng-valid');
    cy.get('#m_policy_holder_lastname').type(contactDetail.lastname).should('have.class', 'ng-valid');
    cy.get('#m_policy_holder_email').type(contactDetail.email_address).should('have.class', 'ng-valid');
    cy.get('input[type="tel"]').clear().type(contactDetail.phone_number);
  });
}

function populateEffectiveDate() {
  getPolicyDurationForm().within(() => {
    cy.get("#policy_start_date").click({force: true});
    let today = new Date();
    let translatedDate = moment(today, 'YYYY-MM-DD', 'fr', true);
    let todayDate = moment(today).format('DD-MM-YYYY');
    cy.get('span:contains(' + moment(translatedDate).format('D') + ')').click();
  });
}

//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => {
//   console.log('Custom command example: Login', email, password);
// });
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const compareColor = (color: string, property: keyof CSSStyleDeclaration) => (
  targetElement: JQuery
) => {
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  tempElement.style.display = 'none'; // make sure it doesn't actually render
  document.body.appendChild(tempElement); // append so that `getComputedStyle` actually works

  const tempColor = getComputedStyle(tempElement).color;
  const targetColor = getComputedStyle(targetElement[0])[property];

  document.body.removeChild(tempElement); // remove it because we're done with it

  expect(tempColor).to.equal(targetColor);
};

Cypress.Commands.overwrite('should', (originalFn: Function, subject: any, expectation: any, ...args: any[]) => {
  const customMatchers = {
    'have.backgroundColor': compareColor(args[0], 'backgroundColor'),
    'have.color': compareColor(args[0], 'color'),
  };
  // See if the expectation is a string and if it is a member of Jest's expect
  if (typeof expectation === 'string' && customMatchers[expectation]) {
    return originalFn(subject, customMatchers[expectation]);
  }

  return originalFn(subject, expectation, ...args);
});

Cypress.Commands.add('login', () => {  
  cy.request({
    method: 'POST',
    url: '/api/v2/account/login/',
    body: {
      user: {
        email: 'tech@uexglobal.com',
        password: 'testT3st',
      }
    }
  })
  .then((resp) => {
    cy.log('resp', resp);
    window.localStorage.setItem('user_data', resp.body);
  });
});

Cypress.Commands.add('populateContactDetails', populateContactDetails);
Cypress.Commands.add('populateEffectiveDate', populateEffectiveDate);