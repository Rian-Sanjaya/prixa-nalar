const validData = {
  female: {
    name: 'Cia',
    date: '15',
    month: 'Februari',
    year: '1988',
    gender: 'Perempuan',
  },
  male: {
    name: 'Dodi',
    date: '15',
    month: 'Februari',
    year: '1988',
    gender: 'Laki-laki',
  },
};

Cypress.Commands.add('addFamilyMember', (isValid, gender, opts = {}) => {
  if (isValid === true) {
    cy.get('[data-cy=header-icon-button')
      .find('svg')
      .click();
    cy.fillStep1(gender);
    cy.fillStep2(gender);
  } else if (isValid === false) {
    cy.wait(3000);
    cy.get('[data-cy=header-icon-button')
      .find('svg')
      .click({ log: opts.withLog })
      .then(() => {
        cy.get('.Toastify').contains('Penambahan Daftar Keluarga maximum 5');
        cy.screenshot('Cannot delete a family member', { capture: 'fullPage' });
      });
  } else {
    throw new 'Add new family member'() + isValid;
  }
});

Cypress.Commands.add('editFamilyMember', (isValid, opts = {}) => {
  if (isValid === true) {
    cy.get('[data-cy=family-member]')
      .first()
      .click();
    cy.get('[data-cy=height]')
      .clear()
      .type(170);
    cy.get('[data-cy=weight]')
      .clear()
      .type(60);
    cy.get('img[alt="Status Merokok"]').click();
    cy.get('[data-cy=save-modified-family-member]').click();
    cy.wait(2500);
    cy.get('.Toastify').contains('berhasil diubah');
    cy.screenshot('Success edit a family member', { capture: 'fullPage' });
  } else {
    throw new 'Edit family member'() + isValid;
  }
});

Cypress.Commands.add('fillStep1', gender => {
  cy.get('[data-cy=family-name-input]').type(validData[gender].name);
  cy.get('[data-cy=date]').type(validData[gender].date);
  cy.get('[data-cy=month]').type(validData[gender].month);
  cy.get('ol > :nth-child(1)').click();
  cy.get('[data-cy=year]').type(validData[gender].year);
  cy.get('[data-cy=family-gender-input]').type(validData[gender].gender);
  cy.get('ol > :nth-child(1)').click();
  cy.get('[data-cy=next-to-step2]').click();
});

Cypress.Commands.add('fillStep2', gender => {
  cy.get('[data-cy=height]').type(168);
  cy.get('[data-cy=weight]').type(56);
  cy.get('img[alt="Status Darah Tinggi"]').click();
  cy.get('img[alt="Status Diabetes"]').click();
  cy.get('img[alt="Status Merokok"]').click();
  cy.get('img[alt="Status Minum Alkohol"]').click();
  cy.get('img[alt="Status Kanker"]').click();
  cy.get('img[alt="Status Gangguan Jantung"]').click();
  cy.get('img[alt="Status Gagal Ginjal"]').click();
  if (gender === 'female') {
    cy.get('img[alt="Status Hamil"]').click();
  }
  cy.get('[data-cy=submit-family-member]').click();
  cy.wait(2500);
  cy.get('.Toastify').contains('telah ditambahkan sebagai anggota keluarga');
  cy.screenshot('Success add a new family member', { capture: 'fullPage' });
});

Cypress.Commands.add('deleteFamilyMembers', (isValid, opts = {}) => {
  if (isValid === true) {
    cy.get('[data-cy=family-member]').each(() => {
      cy.get('[data-cy=family-member]')
        .first()
        .click();
      cy.get('[data-cy=header-icon-button')
        .find('svg')
        .click();
      cy.wait(2000);
      cy.get('button')
        .contains('Hapus')
        .click();
      cy.wait(2000);
      cy.get('.Toastify').contains('telah dihapus sebagai anggota keluarga');
      cy.screenshot('Success delete a family member', { capture: 'fullPage' });
    });
    cy.get('[data-cy=no-family-member]');
  }
});
