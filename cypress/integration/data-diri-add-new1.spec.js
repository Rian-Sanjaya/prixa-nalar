describe('Add Data Diri For New Account', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/sign-up' + pIdAndAppId);
    cy.viewport('iphone-6');
  });

  context('test add data diri for new account', () => {
    it('can write form sign up, click daftar, and continue to verification sent page', () => {
      cy.signup();
    });
  });
});
