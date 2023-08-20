import { MailSlurp } from 'mailslurp-client';

const getDateToMilli = () => {
  const d = new Date();
  return `${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
};

Cypress.Commands.add('createInbox', () => {
  // instantiate MailSlurp
  const mailslurp = new MailSlurp({ apiKey: Cypress.env('API_KEY') });
  // return { id, emailAddress } or a new randomly generated inbox
  return mailslurp.createInbox();
});

Cypress.Commands.add('waitForLatestEmail', inboxId => {
  const mailslurp = new MailSlurp({ apiKey: Cypress.env('API_KEY') });

  return mailslurp.waitForLatestEmail(inboxId);
});

Cypress.Commands.add('signup', () => {
  const name = 'prixatst';
  const password = 'Prixa@123';
  const confirmPassword = 'Prixa@123';
  let email;

  cy.fixture('signupData').then(signup => {
    const emailSeq = getDateToMilli();
    email = 'prixatst' + emailSeq + '@yopmail.com';
    cy.get('input[placeholder="Nama Lengkap"]').type(name);
    cy.get('input[placeholder="nama@email.com"]').type(email);
    cy.get('input[placeholder="Tulis Password"]').type(password);
    cy.get('input[placeholder="Tulis Ulang Password"]').type(confirmPassword);
    cy.get('button')
      .contains('Daftar')
      .click();
    cy.wait(5000);
    cy.get('[data-cy=signup-verification-sent-text]').contains('Email verifikasi telah dikirim');
    const signupData = { ...signup, emailSequence: emailSeq };
    cy.writeFile('cypress/fixtures/signupData.json', signupData);
    cy.wait(60000);
  });
});

Cypress.Commands.add('signupVerification', () => {
  cy.visit('http://www.yopmail.com/en/');
  cy.fixture('signupData').then(signup => {
    const emailSeq = signup.emailSequence;
    cy.get('#login').type('prixatst' + emailSeq);
    cy.get('.sbut').click();
    cy.get('#ifmail')
      .its('0.contentDocument.body')
      .should('not.be.empty');
    cy.get('#ifmail')
      .its('0.contentDocument.body')
      .find('a')
      .contains('https://dev.')
      .then(val => {
        const vLink = val[0].outerText;
        const vLinkSplit = vLink.split('/verification-check/');
        let verificationLink;
        if (Cypress.env('ENV') === 'development') {
          verificationLink = vLink;
        } else {
          verificationLink = 'http://localhost:3000/verification-check/' + vLinkSplit[1];
        }
        const signupData = { ...signup, verificationLink };
        cy.writeFile('cypress/fixtures/signupData.json', signupData);
      });
  });
});

Cypress.Commands.add('visitVerificationEmailLink', () => {
  cy.fixture('signupData').then(signup => {
    cy.visit(signup.verificationLink);
    cy.wait(5000);
    cy.get('[data-cy=verification-check-success]').contains('Verifikasi berhasil');
  });
});

Cypress.Commands.add('loginWithVerifiedAccount', pIdAndAppId => {
  let email;
  const password = 'Prixa@123';

  cy.fixture('signupData').then(signup => {
    const emailSeq = signup.emailSequence;
    email = 'prixatst' + emailSeq + '@yopmail.com';
    cy.visit('/login' + pIdAndAppId);
    cy.get('[data-cy=login-email-input] > input').type(email);
    cy.get('input[placeholder="Tulis Password"]').type(password);
    cy.get('button')
      .contains('Masuk')
      .click();
    cy.wait(5000);
    cy.get('[data-cy=beranda-greeting-message]').contains('Selamat datang');
  });
});
