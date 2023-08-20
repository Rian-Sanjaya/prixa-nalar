describe('Sign Up Verification', () => {
  context('test signup verification', () => {
    it('should visit the verification email, get the verification link', () => {
      cy.signupVerification();
    });
  });
});
