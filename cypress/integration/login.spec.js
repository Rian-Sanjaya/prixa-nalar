describe('Login', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  context('test "login" page', () => {
    beforeEach(() => {
      cy.visit('/login' + pIdAndAppId);
      cy.viewport('iphone-6');
    });

    it('should show error toast if login invalid', () => {
      cy.login(false, { withLog: true });
      cy.screenshot('Halaman Login', { capture: 'fullPage' });
    });

    it('should continue to beranda page if login valid', () => {
      cy.login(true, { withLog: true });
      cy.screenshot('Halaman Beranda', { capture: 'fullPage' });
      // cy.wait(2500);
      // cy.url({ timeout: 5000 }).should('include', '/');
      // cy.screenshot('Halaman Beranda', { capture: 'fullPage' });
    });
  });
});
