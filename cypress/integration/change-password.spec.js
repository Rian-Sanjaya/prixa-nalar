describe('Change Password', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=8d257560-2977-11eb-ab1d-0571246b4bff';

  beforeEach(() => {
    cy.visit('/login' + pIdAndAppId);
    cy.login(true, { withLog: true });

    cy.viewport('iphone-6');
    cy.visit('/change-password');
  });

  context('test "change password" with valid password', () => {
    it('should be able to change password', () => {
      cy.changePassword(true, { withLog: true });
      cy.screenshot('Change Password Success', { capture: 'fullPage' });
    });
  });

  context('test "change password" with invalid password but same password confirmation', () => {
    it('should not be able to change password', () => {
      cy.changePassword(false, { withLog: true });
      cy.screenshot('Change Password Fail', { capture: 'fullPage' });
    });
  });
});
