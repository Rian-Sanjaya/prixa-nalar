// // Cypress custom commands.
// // For more comprehensive examples of custom
// // commands please read more here:
// // https://on.cypress.io/custom-commands

// // import '@percy/cypress'

// Cypress.Commands.add('createPartner', name => {
//   // TODO
// });

// Cypress.Commands.add('createPartnerApp', name => {
//   // TODO
// });

Cypress.Commands.add('startPrixa', (opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (!opts.isCovid) {
    cy.get('[data-cy=banner-prixa-sekarang]', { log: opts.withLog })
      .contains('Prixa Sekarang', { log: opts.withLog })
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('Prixa sekarang started!');
      });
  } else {
    cy.get('[data-cy=banner-prixa-gejala]', { log: opts.withLog })
      .contains('Prixa Gejala', { log: opts.withLog })
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('Prixa gejala started!');
      });
  }
});

Cypress.Commands.add('mockGeolocation', (latitude = 30, longitude = -98) => {
  cy.window().then($window => {
    cy.stub($window.navigator.geolocation, 'getCurrentPosition', callback => {
      return callback({ coords: { latitude, longitude } });
    });
  });
});

Cypress.Commands.add('askMethod', (opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.startPrixa({ withLog: false, isCovid: opts.isCovid });
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (opts.nantiSaja && opts.nantiSaja === true) {
    cy.get('[data-cy="button-nanti-saja"]')
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('Button Nanti Saja clicked');
      });
  }
});

Cypress.Commands.add('consent', (approved, opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.askMethod({ continuity: true, withLog: false, nantiSaja: true, isCovid: opts.isCovid });
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (approved === true) {
    cy.wait(300);
    cy.get('[data-cy=button-option]', { timeout: 10000, log: opts.withLog })
      .contains('Setuju', { log: opts.withLog })
      .click({ log: opts.withLog, force: true })
      .then(() => {
        cy.log('User consent approved', approved);
      });
  } else if (approved === false) {
    cy.get('[data-cy=button-option]', { timeout: 10000, log: opts.withLog })
      .contains('Tidak Setuju', { log: opts.withLog })
      .click({ log: opts.withLog })
      .then(() => {
        cy.log('User consent declined', approved);
      });
  } else {
    throw new 'Invalid approved '() + approved;
  }
});

Cypress.Commands.add('usageFor', (isForSelf, opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.consent(true, { withLog: false, continuity: true, isCovid: opts.isCovid });
    cy.get('[data-cy=button-option]')
      .contains('Lanjut', { log: true })
      .click({ log: true })
      .then(() => {
        cy.log('Button Lanjut clicked');
      });
  }
  // if (!opts.withLog) {
  //   opts.withLog = false;
  // }

  // cy.get('[data-cy=button-option]', { timeout: 3000, log: opts.withLog })
  //   .contains('Lanjut', { log: opts.withLog })
  //   .click({ log: opts.withLog });

  // if (isForSelf === true) {
  //   cy.get('[data-cy=button-option]', { timeout: 3000, log: opts.withLog })
  //     .contains('Diri Sendiri', { log: opts.withLog })
  //     .click({ log: opts.withLog })
  //     .then(() => {
  //       cy.log('User usage selected', 'Diri Sendiri');
  //     });
  // } else if (isForSelf === false) {
  //   cy.get('[data-cy=button-option]', { timeout: 3000, log: opts.withLog })
  //     .contains('Orang Lain', { log: opts.withLog })
  //     .click({ log: opts.withLog })
  //     .then(() => {
  //       cy.log('User usage selected', 'Orang Lain');
  //     });
  // } else {
  //   throw new 'Invalid isForSelf param value'();
  // }
});

Cypress.Commands.add('preconditionsUserInfo', (userPreconditions = {}, opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.usageFor(true, { withLog: false, continuity: true, isCovid: opts.isCovid });
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.get('[data-cy="basic-precondition-lanjut-button"]', { log: opts.withLog }).should('be.disabled');

  cy.inputGender(userPreconditions.gender, opts);
  cy.inputAge(userPreconditions.year, userPreconditions.month, userPreconditions.day, opts);
  cy.inputHeightWeight(userPreconditions.height, userPreconditions.weight, opts);

  if (!opts.dontWait) {
    cy.wait(2000);
  }

  cy.get('[data-cy="basic-precondition-lanjut-button"]', { log: opts.withLog }).should('be.enabled');
  cy.get('[data-cy="basic-precondition-lanjut-button"]', { log: opts.withLog })
    .click({ log: opts.withLog })
    .then(() => cy.log('Basic Precondition button lanjut clicked'));
});

Cypress.Commands.add('preconditionsUserCharacteristics', (userCharacteristics = {}, opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.preconditionsUserInfo(opts.userPreconditions, {
      withLog: false,
      continuity: true,
      dontWait: true,
      isCovid: opts.isCovid,
    });
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (userCharacteristics.isSmoker === true) {
    cy.get('img[alt="Status Merokok"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.HasHighBloodPressure === true) {
    cy.get('img[alt="Status Darah Tinggi"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.isAlcoholic === true) {
    cy.get('img[alt="Status Minum Alkohol"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.isDiabetic === true) {
    cy.get('img[alt="Status Diabetes"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.isCancer === true) {
    cy.get('img[alt="Status Kanker"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.isKidney === true) {
    cy.get('img[alt="Status Gagal Ginjal"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.isHeartDisease === true) {
    cy.get('img[alt="Status Gangguan Jantung"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
  if (userCharacteristics.isPregnant === true) {
    cy.get('img[alt="Status Hamil"]', { log: opts.withLog }).click({ log: opts.withLog });
  }
});

Cypress.Commands.add('inputGender', (gender, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (gender === 'FEMALE') {
    cy.get('label', { log: opts.withLog })
      .contains('Perempuan', { log: opts.withLog })
      .click({ log: opts.withLog });
  } else if (gender === 'MALE') {
    cy.get('label', { log: opts.withLog })
      .contains('Laki-laki', { log: opts.withLog })
      .click({ log: opts.withLog });
  } else {
    throw new 'Invalid gender value'();
  }
});

Cypress.Commands.add('inputAge', (year = 0, month = 0, day = 0, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (year > 0) cy.get('.year', { log: opts.withLog }).type(`${year}`, { log: opts.withLog });
  if (month > 0) {
    cy.get('.css-yk16xz-control').click();
    cy.get('.css-26l3qy-menu')
      .contains('Februari')
      .click();
  }
  if (day > 0) cy.get('.day', { log: opts.withLog }).type(`${day}`, { log: opts.withLog });
  if (year <= 0 && month <= 0 && day <= 0) throw new 'Invalid age value'();
});

Cypress.Commands.add('inputHeightWeight', (height, weight, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }

  if (!height || !weight) {
    throw new 'Invalid age value'();
  }

  if (height > 0) {
    cy.get('[data-cy=diagnostic-height-input]', { log: opts.withLog }).type(`${height}`, { log: opts.withLog });
  }
  if (weight > 0) {
    cy.get('[data-cy=diagnostic-weight-input]', { log: opts.withLog }).type(`${weight}`, { log: opts.withLog });
  }
});

Cypress.Commands.add('fillInputText', (label, value, opts = {}) => {
  cy.contains(label, { log: opts.withLog })
    .siblings('input', { log: opts.withLog })
    .focus()
    .type(`${value}`, { log: opts.withLog })
    .scrollIntoView();
});

Cypress.Commands.add('selectDropdown', (element, value, opts = {}) => {
  cy.get(element, { log: opts.withLog }).click();
  // .type(`${value}{enter}`, { log: opts.withLog })
  // .blur();
  cy.get('li[role=option]', { log: opts.withLog })
    .contains(value)
    .click();
});
Cypress.Commands.add('askInsurance', (hasInsurance, isWillingToHave, opts = {}) => {
  if (!opts.withLog) {
    opts.withLog = false;
  }
  if (opts.continuity && opts.continuity === true) {
    cy.preconditionsUserCharacteristics(opts.userCharacteristics, { ...opts, withLog: false, continuity: true });
    cy.wait(2000);
    cy.get('.prixa-right-button', { timeout: 3000, log: opts.withLog })
      .contains('Lanjut', { log: opts.withLog })
      .click({ log: opts.withLog });
  }

  if (hasInsurance === true) {
    cy.get('.prixa-right-button', { log: opts.withLog })
      .contains('Ya', { log: opts.withLog })
      .click({ log: opts.withLog });
  } else if (hasInsurance === false) {
    cy.get('.prixa-right-button', { log: opts.withLog })
      .contains('Tidak', { log: opts.withLog })
      .click({ log: opts.withLog });

    if (isWillingToHave === true) {
      cy.get('.prixa-right-button', { log: opts.withLog })
        .contains('Ya', { log: opts.withLog })
        .click({ log: opts.withLog });
    } else if (isWillingToHave === false) {
      cy.get('.prixa-right-button', { log: opts.withLog })
        .contains('Tidak', { log: opts.withLog })
        .click({ log: opts.withLog });
    }
  } else {
    throw new 'Invalid has insurance'();
  }
});

Cypress.Commands.add('inputChiefComplaint', (chiefComplaint, opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    // if (Cypress.env('covid'))
    if (opts.isCovid)
      cy.preconditionsInfectionHistory(opts.userInfectionHistory, { ...opts, withLog: false, continuity: true });
    else {
      // cy.askInsurance(opts.isWillingToHave, false, { ...opts, withLog: false, continuity: true });
      cy.preconditionsUserCharacteristics(opts.userCharacteristics, { ...opts, withLog: false, continuity: true });
      cy.wait(2000);
      cy.get('.prixa-right-button', { log: opts.withLog })
        .contains('Lanjut', { log: opts.withLog })
        .click({ log: opts.withLog });
    }
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.get('form', { timeout: 10000, log: opts.withLog })
    .find('input', { log: opts.withLog })
    .type(chiefComplaint, { log: opts.withLog });
});

Cypress.Commands.add('selectChiefComplaint', (opts = {}) => {
  const isCovid = opts.isCovid;
  cy.fixture(opts.chiefComplaintFixture).as('chiefComplaintFixture');
  cy.get('@chiefComplaintFixture').then(data => {
    const opts = {
      withLog: true,
      continuity: true,
      isWillingToHave: true,
      userPreconditions: data.preconditions,
      userCharacteristics: data.userCharacteristics,
      userInfectionHistory: data.userInfectionHistory,
      isCovid,
    };

    if (opts.continuity && opts.continuity === true) {
      cy.inputChiefComplaint(data.chiefComplaint, { ...opts, withLog: false, continuity: true });
    }
    if (!opts.withLog) {
      opts.withLog = false;
    }

    cy.get('form', { log: opts.withLog })
      .find('button', { log: opts.withLog })
      .click({ log: opts.withLog });
    cy.get('div.prixa-list-title', { timeout: 5000, log: opts.withLog })
      .first({ log: opts.withLog })
      .contains(data.selectChiefComplaint, { log: opts.withLog });
  });
});

Cypress.Commands.add('thankYouPage', opts => {
  if (opts.continuity && opts.continuity === true) {
    cy.diagnose({ ...opts, withLog: false, continuity: true, dontWait: true });
  }

  cy.fixture(opts.thankYouPageFixture).as('thankYouPageFixture');
  cy.get('@thankYouPageFixture').then(data => {
    cy.get('div.prixa-title', { log: opts.withLog })
      .find('p', { log: opts.withLog })
      .contains(data.page.thankYouTitle, { log: opts.withLog })
      .should('be.exist', { log: opts.withLog });
    cy.get('div.prixa-title', { log: opts.withLog })
      .find('p', { log: opts.withLog })
      .contains(data.page.thankYouContent, { log: opts.withLog })
      .should('be.exist', { log: opts.withLog });
    if (opts.enableScreenshot === true) {
      cy.screenshot('Halaman terima kasih', { capture: 'fullPage' });
    }
    cy.get('.prixa-right-button', { log: opts.withLog })
      .contains('Lanjut', { log: opts.withLog })
      .click({ log: opts.withLog });

    cy.get('div.prixa-title', { log: opts.withLog })
      .find('p', { log: opts.withLog })
      .contains(data.page.rememberTitle, { log: opts.withLog })
      .should('be.exist', { log: opts.withLog });
    cy.get('div.prixa-title', { log: opts.withLog })
      .find('p', { log: opts.withLog })
      .contains(data.page.rememberContent, { log: opts.withLog })
      .should('be.exist', { log: opts.withLog });
    if (opts.enableScreenshot === true) {
      cy.screenshot('Halaman lihat hasil nav', { capture: 'fullPage' });
    }
    // cy.get('.prixa-right-button', { log: opts.withLog })
    //   .contains('Lihat Hasil', { log: opts.withLog })
    //   .click({ log: opts.withLog });
  });
});

Cypress.Commands.add('diagnose', (opts = {}) => {
  if (opts.continuity && opts.continuity === true) {
    cy.selectChiefComplaint({ ...opts, withLog: false, continuity: true, isCovid: opts.isCovid });
  }
  if (!opts.withLog) {
    opts.withLog = false;
  }

  cy.get('@chiefComplaintFixture').then(data => {
    cy.get('div.prixa-list-button', { log: opts.withLog })
      .first({ log: opts.withLog })
      .contains('Pilih', { log: opts.withLog })
      .click({ log: opts.withLog });

    data.answers.forEach((el, idx, arr) => {
      cy.get('div.prixa-title', { timeout: 5000, log: opts.withLog })
        .find('p', { log: opts.withLog })
        .invoke('text')
        .then(text => {
          const isHasAnswer = arr.find(({ question }) => question === text);

          if (isHasAnswer) {
            if (opts.enableScreenshot === true) {
              cy.screenshot('Sesak Nafas - ' + isHasAnswer.title, { capture: 'fullPage' });
            }
            cy.get('div.prixa-right-button', { timeout: 5000, log: opts.withLog })
              .contains(isHasAnswer.answer, { log: opts.withLog })
              .click({ log: opts.withLog });
          }
          cy.wait(1000);
        });
    });

    //   data.answers.forEach(({ question, answer }) => {
    //     if (!opts.dontWait) {
    //       cy.wait(1000);
    //     }

    //     cy.get('div.prixa-title', { timeout: 5000, log: opts.withLog })
    //       .find('p', { log: opts.withLog })
    //       .contains(question, { log: opts.withLog })
    //       .should('be.exist');

    //     if (opts.enableScreenshot === true) {
    //       cy.screenshot('Sesak Nafas - ' + title, { capture: 'fullPage' });
    //     }

    //     cy.get('div.prixa-right-button', { timeout: 5000, log: opts.withLog })
    //       .contains(answer, { log: opts.withLog })
    //       .click({ log: opts.withLog });
    //   });

    cy.get('div.prixa-right-button button')
      .contains('Lanjut')
      .click();
    cy.get('div.prixa-right-button button')
      .contains('Lihat Hasil')
      .click();
    cy.get('@chiefComplaintFixture').then(data => {
      data.diagnose.forEach(diseaseName => {
        cy.get('div.prixa-list-title')
          .find('span')
          .contains(diseaseName)
          .should('be.exist');
      });
    });
  });
});

// Cypress.Commands.add('login', (email, password) => {
//   // TODO: Perform login
// });

// Cypress.Commands.add('forgetPassword', () => {
//   // TODO: Perform login
// });
