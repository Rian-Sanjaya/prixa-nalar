describe('Add Data Diri For New Account', () => {
  context('test add data diri for new account', () => {
    it('hould visit the verification email, get the verification link', () => {
      cy.signupVerification();
    });
  });
});
