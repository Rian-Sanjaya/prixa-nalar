const email = 'rian.sj32@yopmail.com';
const passwordValid = 'Prixa#123';
const passwordInvalid = 'Prixa#12345';

Cypress.Commands.add('login', (isValid, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (isValid === true) {
    cy.get('[data-cy=login-email-input] > input').type(email);
    cy.get('input[type=password]').type(passwordValid);
    cy.get('button', { timeout: 10000, log: opts.withLog })
      .contains('Masuk')
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('User login is valid', isValid);
      });
    cy.wait(5000);
    cy.get('[data-cy=beranda-greeting-message]').contains('Selamat datang');
  } else if (isValid === false) {
    cy.get('[data-cy=login-email-input] > input').type(email);
    cy.get('input[type=password]').type(passwordInvalid);
    cy.get('button', { timeout: 10000, log: opts.withLog })
      .contains('Masuk')
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('User login is invalid', isValid);
      });
    cy.wait(5000);
    cy.get('.Toastify');
  } else {
    throw new 'Invalid login '() + isValid;
  }
});
