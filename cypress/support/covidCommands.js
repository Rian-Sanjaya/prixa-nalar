// Cypress custom commands.
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands

// import '@percy/cypress'

Cypress.Commands.add('preconditionsInfectionHistory', (userInfectionHistory = {}, opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.preconditionsUserCharacteristics(opts.userCharacteristics, {
      ...opts,
      withLog: false,
      continuity: true,
      dontWait: true,
      isCovid: opts.isCovid,
    });
    cy.get('.prixa-right-button', { timeout: 3000, log: false })
      .contains('Lanjut', { log: false })
      .click({ log: false });

    cy.inputInfectionHistory(userInfectionHistory);
    cy.get('.prixa-right-button', { log: opts.withLog })
      .find('button', { log: opts.withLog })
      .click({ log: false });
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }
});

Cypress.Commands.add('inputInfectionHistory', (userInfectionHistory, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (userInfectionHistory.contactHistory && userInfectionHistory.localTransmission) {
    cy.get('.prixa-radio-normal > input[name=contactHistory]', { log: opts.withLog })
      .siblings('label')
      .contains(userInfectionHistory.contactHistory, { log: opts.withLog })
      .click({ log: opts.withLog });
    cy.get('.prixa-radio-normal > input[name=localTransmission]', { log: opts.withLog })
      .siblings('label')
      .contains(userInfectionHistory.localTransmission, { log: opts.withLog })
      .click({ log: opts.withLog });

    cy.get('.prixa-right-button', { log: opts.withLog })
      .find('button', { log: opts.withLog })
      .should('be.enabled');
  } else if (userInfectionHistory.contactHistory) {
    cy.get('.prixa-radio-normal > input[name=contactHistory]', { log: opts.withLog })
      .siblings('label')
      .contains(userInfectionHistory.contactHistory, { log: opts.withLog })
      .click({ log: opts.withLog });

    cy.get('.prixa-right-button', { log: opts.withLog })
      .find('button', { log: opts.withLog })
      .should('be.disabled');
  } else if (userInfectionHistory.localTransmission) {
    cy.get(`.prixa-radio-normal > input[name=localTransmission]`, {
      log: opts.withLog,
    })
      .siblings('label')
      .contains(userInfectionHistory.localTransmission, { log: opts.withLog })
      .click({ log: opts.withLog });

    cy.get('.prixa-right-button', { log: opts.withLog })
      .find('button', { log: opts.withLog })
      .should('be.disabled');
  }
});

Cypress.Commands.add('diagnoseResult', opts => {
  if (opts.continuity && opts.continuity === true) {
    cy.thankYouPage({ ...opts, withLog: false, continuity: true, dontWait: true });
    cy.get('.prixa-right-button', { log: opts.withLog })
      .contains('Lihat Hasil', { log: opts.withLog })
      .click({ log: opts.withLog });
  }
  cy.fixture(opts.chiefComplaintFixture).as('chiefComplaintFixture');
  cy.get('@chiefComplaintFixture').then(data => {
    data.diagnose.forEach(diseaseName => {
      cy.get('div.prixa-list-title')
        .find('span')
        .contains(diseaseName)
        .should('be.exist');
    });
  });
});

Cypress.Commands.add('fillSelfForm', opts => {
  if (opts.continuity && opts.continuity === true) {
    cy.diagnoseResult({ ...opts, withLog: false, continuity: true, dontWait: true });
    cy.get('[data-cy=button-summary-form-self]', { log: opts.withLog })
      .contains('Isi Data Diri', { log: opts.withLog })
      .click({ log: opts.withLog });
  }

  if (!opts.dontWait) {
    cy.wait(500);
  }
  cy.get('[data-cy=text-form-explanation]', { timeout: 5000, log: opts.withLog }).should('be.exist');

  cy.get('[data-cy=button-agree_and_continue]', { timeout: 5000, log: opts.withLog })
    .contains('Setuju dan Lanjutkan', { log: opts.withLog })
    .should('be.exist');
  // .click({ log: opts.withLog });

  // cy.fixture(opts.chiefComplaintFixture).as('chiefComplaintFixture');
  // cy.get('@chiefComplaintFixture').then(data => {
  //   data.diagnose.forEach(diseaseName => {
  //     cy.get('div.prixa-list-title')
  //       .find('span')
  //       .contains(diseaseName)
  //       .should('be.exist');
  //   });
  // });
});
