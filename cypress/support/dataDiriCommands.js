Cypress.Commands.add('changeGender', (opts = {}) => {
  cy.visit('/personal-information');
  cy.get('[data-cy=header-icon-button')
    .find('svg')
    .click();
  cy.get('[Data-cy=data-diri-dropdown-jenis-kelamin]').click();
  if (opts.gender === 'female') cy.get('.sc-dxgOiQ > :nth-child(2)').click();
  else cy.get('.sc-dxgOiQ > :nth-child(1)').click();
});
