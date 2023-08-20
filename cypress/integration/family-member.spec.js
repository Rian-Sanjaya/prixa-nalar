describe('Booking Appointment', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f';

  beforeEach(() => {
    cy.visit('/login' + pIdAndAppId);
    cy.login(true, { withLog: true });

    cy.viewport('iphone-6');
    cy.visit('/family-member');
  });

  context('test "family member" valid)', () => {
    it('should be able to add family member (Female)', () => {
      cy.addFamilyMember(true, 'female', { withLog: true });
    });

    it('should be able to add family member (Male)', () => {
      cy.addFamilyMember(true, 'male', { withLog: true });
    });

    it('should be able to edit family member', () => {
      cy.editFamilyMember(true, { withLog: true });
    });
  });

  context('test add "family member" max 5)', () => {
    it('should be able to add another 3 family members', () => {
      cy.addFamilyMember(true, 'female', { withLog: true });
      cy.addFamilyMember(true, 'male', { withLog: true });
      cy.addFamilyMember(true, 'female', { withLog: true });
    });
  });

  context('test add "family member" more than 5)', () => {
    it('should not be able to add another family member', () => {
      cy.addFamilyMember(false, 'female', { withLog: true });
    });
  });

  context('test delete "family member" valid)', () => {
    it('should be able to delete all family member', () => {
      cy.deleteFamilyMembers(true, { withLog: true });
    });
  });
});
