const passwordValid = 'Prixa#123';
const passwordInvalid = 'Prixa#12345';
const newPassword = 'Prixa#123';

Cypress.Commands.add('changePassword', (isValid, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (isValid === true) {
    cy.get('[data-cy=old-password]').type(passwordValid);
    cy.get('[data-cy=new-password]').type(newPassword);
    cy.get('[data-cy=password-confirmation]').type(newPassword);
    cy.get('[data-cy=submit-new-password]', { timeout: 10000, log: opts.withLog })
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('Old password is valid:', isValid);
      });
    cy.wait(5000);
    cy.get('[data-cy=change-password-success-message]').contains('Password akun Anda telah berhasil diganti.');
  } else if (isValid === false) {
    cy.get('[data-cy=old-password]').type(passwordInvalid);
    cy.get('[data-cy=new-password]').type(newPassword);
    cy.get('[data-cy=password-confirmation]').type(newPassword);
    cy.get('[data-cy=submit-new-password]', { timeout: 10000, log: opts.withLog })
      .click({ log: opts.withLog })
      .then(() => {
        cy.get('.Toastify');
        cy.log('Old password is valid:', isValid);
      });
  } else {
    throw new 'Invalid login '() + isValid;
  }
});
