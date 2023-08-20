describe('Booking Appointment', () => {
  const pIdAndAppId = '?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=8d257560-2977-11eb-ab1d-0571246b4bff';

  beforeEach(() => {
    cy.visit('/login' + pIdAndAppId);
    cy.login(true, { withLog: true });

    cy.viewport('iphone-6');
    cy.visit('/booking');
  });

  context('test "booking appointment" with invalid doctor', () => {
    it('should not be able to create appointment booking', () => {
      cy.searchDoctor(false, { withLog: true });
      cy.screenshot('Halaman Cari Dokter', { capture: 'fullPage' });
    });
  });

  context('test "booking appointment" with valid doctor (with schedule)', () => {
    it('should be able to create appointment booking', () => {
      cy.searchDoctor(true, { withLog: true });
      cy.screenshot('Halaman Booking', { capture: 'fullPage' });
      cy.chooseDate(1, { withLog: true });
      cy.screenshot('Halaman Booking Step 1', { capture: 'fullPage' });
      cy.chooseTime(0, { withLog: true });
      cy.screenshot('Halaman Booking Step 2', { capture: 'fullPage' });
      cy.inputUserData({ withLog: true });
      cy.screenshot('Halaman Booking Step 3', { capture: 'fullPage' });
      cy.createBookingAppointment({ withLog: true });
      cy.screenshot('Halaman Ringkasan Janji', { capture: 'fullPage' });
      cy.downloadBookingAppointment({ withLog: true });
      cy.backToHome({ withLog: true });
      cy.screenshot('Halaman Home', { capture: 'fullPage' });
    });
  });
});
