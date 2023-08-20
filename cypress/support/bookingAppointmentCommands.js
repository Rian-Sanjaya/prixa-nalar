const doctorWithNoDate = 'Ni Made Rahmayani';
const doctorWithDateAndTime = 'Agnes Imelda Imanuel';

Cypress.Commands.add('searchDoctor', (isValid, opts = {}) => {
  if (isValid) {
    cy.getDoctor(doctorWithDateAndTime, { withLog: true });
    cy.url({ timeout: 5000 }).should('include', '/booking-date');
  } else if (isValid === false) {
    cy.getDoctor(doctorWithNoDate, { withLog: true });
    cy.get('[data-cy=doctor-not-found]');
  } else {
    throw new 'Invalid search doctor '() + isValid;
  }
});

Cypress.Commands.add('getDoctor', (doctorName, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.wait(2500);
  cy.get('[data-cy=search-doctor-trigger]').click();
  cy.wait(300);
  cy.get('input').type(doctorName);
  cy.wait(3000);
  if (doctorName === doctorWithDateAndTime) {
    cy.get('[data-cy=doctor-results]')
      .contains(doctorName)
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('Doctor ' + doctorName + ' is selected');
      });
  }
});

Cypress.Commands.add('chooseDate', (dateOption, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.wait(10000);
  cy.get('[aria-disabled=false]')
    .eq(dateOption)
    .click({ log: opts.withLog })
    .then(() => {
      cy.log('Date selected', dateOption);
    });
  cy.contains('Lanjut')
    .click({ log: opts.withLog })
    .then(() => {
      cy.log('Go to next step');
    });
});

Cypress.Commands.add('chooseTime', (timeOption, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.wait(5000);

  cy.get('[data-cy=time-slot]')
    .eq(timeOption)
    .check({ force: true, log: opts.withLog })
    .then(() => {
      cy.log('Time selected', timeOption);
    });
  cy.contains('Lanjut')
    .click({ log: opts.withLog })
    .then(() => {
      cy.log('Go to next step');
    });
});

Cypress.Commands.add('inputUserData', (opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.wait(2500);

  cy.fixture('userData').then(data => {
    cy.get('input[placeholder="Nama Pasien"]').type(data.name);
    cy.get('[data-cy=date-input]')
      .find('input')
      .first()
      .type(data.month + '{enter}', { force: true });
    cy.get('input[placeholder="Tanggal"]').type(data.date);
    cy.get('input[placeholder="Tahun"]').type(data.year);
    cy.get('input[placeholder="1234567890xxxxxx"]').type(data.nik);
    cy.get('input[placeholder="nama@mail.com"]').type(data.email);
    cy.get('input[placeholder="0812345xxxx"]').type(data.phoneNumber);
    cy.get('[data-cy=payment-method-input]')
      .find('input')
      .first()
      .type(data.paymentMethod + '{enter}', { force: true });
  });

  cy.contains('Lanjut')
    .click({ log: opts.withLog })
    .then(() => {
      cy.log('Go to next step');
    });
});

Cypress.Commands.add('createBookingAppointment', (opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.wait(2500);
  cy.contains('Buat Janji Temu')
    .click({ log: opts.withLog })
    .then(() => {
      cy.log('Submit appointment data');
    });
  cy.screenshot('Halaman Konfirmasi Janji', { capture: 'fullPage' });
  cy.wait(5000);
  cy.get('[data-cy=booking-summary-title]');
});

Cypress.Commands.add('downloadBookingAppointment', (opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.get('[data-cy=download-appointment]')
    .click({ log: opts.withLog })
    .then(() => {
      cy.log('Download button clicked');
    });
  cy.wait(10000);
});

Cypress.Commands.add('backToHome', (opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.contains('Kembali ke Beranda')
    .click({ log: opts.true })
    .then(() => {
      cy.log('Back to home button clicked');
    });
  cy.url({ timeout: 5000 }).should('include', '/');
});
