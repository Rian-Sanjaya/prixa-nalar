describe('Sign Up Verification Link', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/sign-up' + pIdAndAppId);
    cy.viewport('iphone-6');
  });

  context('test signup verification email link', () => {
    it('should visit the verification email link, and get the verification success page', () => {
      cy.visitVerificationEmailLink();
    });

    it('can log in with the verified account', () => {
      cy.loginWithVerifiedAccount(pIdAndAppId);
    });
  });
});
