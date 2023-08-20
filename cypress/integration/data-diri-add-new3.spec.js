describe('Add Data Diri For New Account', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/sign-up' + pIdAndAppId);
    cy.viewport('iphone-6');
  });

  it('should visit the verification email link, and get the verification success page', () => {
    cy.visitVerificationEmailLink();
  });

  it('can log in with the verified account and add data diri', () => {
    cy.loginWithVerifiedAccount(pIdAndAppId);
    cy.visit('/personal-information');
    cy.get('[data-cy=header-icon-button')
      .find('svg')
      .click();
    cy.get('[data-cy="data-diri-add-dob"]').click();
    cy.get('[data-cy=data-diri-input-date-dob]').type('10');
    cy.get('[data-cy=data-diri-input-month-dob]').click();
    cy.get('.sc-dxgOiQ > :nth-child(3)').click();
    cy.get('[data-cy=data-diri-input-year-dob]').type('2000');
    cy.get('[data-cy=data-diri-button-save-dob]').click();
    cy.get('[Data-cy=data-diri-dropdown-jenis-kelamin]').click();
    cy.get('.sc-dxgOiQ > :nth-child(1)').click();
    cy.get('[data-cy=data-diri-input-alamat]')
      .find('textarea')
      .clear()
      .type('Jl. Berliku Panjang');
    cy.get('[data-cy=data-diri-input-nomor-telepon]')
      .find('input')
      .clear()
      .type('0812345678');
    cy.get('[data-cy=data-diri-button-save]').click();
    cy.get('[data-cy=data-diri-button-save]').should('not.be.visible');
  });
});
