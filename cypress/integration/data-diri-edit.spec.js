describe('Edit Data Diri', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/login' + pIdAndAppId);
    cy.login(true, { withLog: true });
    cy.viewport('iphone-6');
    cy.visit('/personal-information');
  });

  context('test when not on edit mode', () => {
    it('input fields should be disabled', () => {
      cy.get('[data-cy=data-diri-input-name]')
        .find('input')
        .should('be.disabled');
      cy.get('[data-cy=data-diri-dropdown-jenis-kelamin]').should('be.disabled');
      cy.get('[data-cy=data-diri-input-alamat]')
        .find('textarea')
        .should('be.disabled');
      cy.get('[data-cy=data-diri-input-nomor-telepon]')
        .find('input')
        .should('be.disabled');
    });
  });

  context('test when on edit mode', () => {
    // generate random string
    const editAlamat =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

    it('should validate mandatory field', () => {
      cy.get('[data-cy=header-icon-button')
        .find('svg')
        .click();
      cy.get('[data-cy=data-diri-input-name]')
        .find('input')
        .should('be.enabled');
      cy.get('[data-cy=data-diri-dropdown-jenis-kelamin]').should('be.enabled');
      cy.get('[data-cy=data-diri-input-alamat]')
        .find('textarea')
        .should('be.enabled');
      cy.get('[data-cy=data-diri-input-nomor-telepon]')
        .find('input')
        .should('be.enabled');
      cy.get('[data-cy=data-diri-input-name]')
        .find('input')
        .clear();
      cy.get('[data-cy=data-diri-input-alamat]')
        .find('textarea')
        .clear();
      cy.get('[data-cy=data-diri-input-nomor-telepon]')
        .find('input')
        .clear();
      cy.get('[data-cy=data-diri-button-save]').should('be.disabled');
    });

    it('should be able to edit and save', () => {
      cy.get('[data-cy=header-icon-button')
        .find('svg')
        .click();
      cy.get('[data-cy=data-diri-input-alamat]')
        .find('textarea')
        .clear()
        .type(editAlamat);
      cy.get('[data-cy=data-diri-button-save]').click();
      cy.get('[data-cy=data-diri-input-alamat]')
        .find('textarea')
        .should('have.value', editAlamat);
      cy.get('[data-cy=data-diri-button-save]').should('not.be.visible');
    });
  });
});
