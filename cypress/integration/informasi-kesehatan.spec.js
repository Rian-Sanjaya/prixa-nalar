describe('Informasi Kesehatan', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';
  const email = 'kapiten.2@yopmail.com';
  const password = 'Prixa@123';

  beforeEach(() => {
    cy.visit('/login' + pIdAndAppId);
    cy.viewport('iphone-6');
    cy.get('[data-cy=login-email-input] > input').type(email);
    cy.get('input[placeholder="Tulis Password"]').type(password);
    cy.get('button')
      .contains('Masuk')
      .click();
    cy.wait(5000);
    cy.get('[data-cy=beranda-greeting-message]').contains('Selamat datang');
    cy.visit('/precondition-info');
  });

  context('validate when data diri is not completed filled', () => {
    it('should not be able to edit informasi kesehatan', () => {
      cy.wait(1000);
      cy.get('[data-cy=header-icon-button]')
        .find('svg')
        .click();
      cy.get('.Toastify').contains('Jenis Kelamin atau Umur belum diisi. Silahkan isi terlebih dahulu di Data Diri');
    });
  });
});

describe('Informasi Kesehatan', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/login' + pIdAndAppId);
    cy.login(true, { withLog: true });
    cy.viewport('iphone-6');
    cy.visit('/precondition-info');
  });

  context('test gender characteristics', () => {
    it('should see all available characterstic for FEMALE', () => {
      cy.changeGender({ gender: 'female' });
      cy.get('[data-cy=data-diri-button-save]').click();
      cy.wait(3000);
      cy.visit('/precondition-info');
      cy.get('img[alt="Status Darah Tinggi"]').should('be.visible');
      cy.get('img[alt="Status Diabetes"]').should('be.visible');
      cy.get('img[alt="Status Merokok"]').should('be.visible');
      cy.get('img[alt="Status Minum Alkohol"]').should('be.visible');
      cy.get('img[alt="Status Kanker"]').should('be.visible');
      cy.get('img[alt="Status Gangguan Jantung"]').should('be.visible');
      cy.get('img[alt="Status Gagal Ginjal"]').should('be.visible');
      cy.get('img[alt="Status Hamil"]').should('be.visible');
      cy.get('img[alt="Status Menopause"]').should('be.visible');
    });

    it('should not see pregnancy when gender is a MALE', () => {
      cy.changeGender({ gender: 'male' });
      cy.get('[data-cy=data-diri-button-save]').click();
      cy.wait(3000);
      cy.visit('/precondition-info');
      cy.get('img[alt="Status Hamil"]').should('not.be.visible');
    });
  });

  context('test when not on edit mode', () => {
    it('fields should be disabled', () => {
      cy.get('[data-cy=health-info-height-input]').should('be.disabled');
      cy.get('[data-cy=health-info-weight-input]').should('be.disabled');
    });
  });

  context('test when on edit mode', () => {
    it('cannot save when mandatory fields is not be filled', () => {
      cy.wait(1000);
      cy.get('[data-cy=header-icon-button]')
        .find('svg')
        .click({ force: true });
      cy.get('[data-cy=health-info-height-input]').clear();
      cy.get('[data-cy=health-info-weight-input]').clear();
      cy.get('[data-cy=health-info-save-button]').should('be.disabled');
    });

    it('validate fields', () => {
      cy.wait(1000);
      cy.get('[data-cy=header-icon-button]')
        .find('svg')
        .click({ force: true });
      cy.get('[data-cy=health-info-height-input]')
        .clear()
        .type(301);
      cy.get('[data-cy=health-info-weight-input]')
        .clear()
        .type(501);
      cy.get('[data-cy=health-info-save-button]').should('be.disabled');
    });

    it('should be able to edit and save', () => {
      cy.wait(1000);
      cy.get('[data-cy=header-icon-button]')
        .find('svg')
        .click({ force: true });
      cy.get('[data-cy=health-info-height-input]')
        .clear()
        .type(160);
      cy.get('[data-cy=health-info-weight-input]')
        .clear()
        .type(62);
      cy.get('img[alt="Status Darah Tinggi"]').click();
      cy.get('img[alt="Status Diabetes"]').click();
      cy.get('img[alt="Status Merokok"]').click();
      cy.get('img[alt="Status Minum Alkohol"]').click();
      cy.get('img[alt="Status Kanker"]').click();
      cy.get('img[alt="Status Gangguan Jantung"]').click();
      cy.get('img[alt="Status Gagal Ginjal"]').click();
      cy.get('[data-cy=health-info-save-button]').click();
      cy.wait(3000);
      cy.get('[data-cy=health-info-height-input]').should('be.disabled');
      cy.get('[data-cy=health-info-weight-input]').should('be.disabled');
      cy.get('[data-cy=health-info-save-button]').should('not.be.visible');
    });
  });
});
