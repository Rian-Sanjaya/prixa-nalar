describe('Sign Up', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/sign-up' + pIdAndAppId);
    cy.viewport('iphone-6');
  });

  context('test sign up page', () => {
    const name = 'prixatest';
    const password = 'Prixa@123';
    const confirmPassword = 'Prixa@123';
    const email = 'test@prixa.ai';

    it('should show error toast if signup fail', () => {
      cy.get('input[placeholder="Nama Lengkap"]').type(name);
      cy.get('input[placeholder="nama@email.com"]').type(email);
      cy.get('input[placeholder="Tulis Password"]').type(password);
      cy.get('input[placeholder="Tulis Ulang Password"]').type(confirmPassword);
      cy.get('button')
        .contains('Daftar')
        .click();
      cy.wait(5000);
      cy.get('.Toastify');
    });

    it('can write form sign up, click daftar, and continue to verification sent page', () => {
      cy.signup();
    });
  });
});
