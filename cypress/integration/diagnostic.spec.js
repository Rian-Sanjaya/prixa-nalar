describe('Diagnostic Web', () => {
  beforeEach(() => {
    cy.visit('?pId=bd20b190-ff7d-11e9-8afe-5f43b258d9a7&appId=2c2cfb80-dde6-11ea-8fb5-bbd96ff72a6f');
    cy.viewport('iphone-6');
  });

  it('should load prixa landing page', () => {
    cy.get('.prixa').should('exist');
    cy.get('#root').should('exist');
  });

  it('should continue to ask method page after clicking Prixa Sekarang', () => {
    cy.startPrixa({ withLog: true });
    cy.get('[data-cy=button-nanti-saja]').contains('Nanti Saja');
    cy.screenshot('Halaman ask method', { capture: 'fullPage' });
  });

  context('test "ask method page"', () => {
    it('should continue to consent page after clicking Nanti Saja', () => {
      cy.askMethod({ continuity: true, withLog: true, nantiSaja: true });
      cy.get('[data-cy=text-title-question]').contains(
        'Data yang Anda masukkan akan direkam dan dipelajari oleh Prixa',
      );
      cy.screenshot('Halaman consent', { capture: 'fullPage' });
    });
  });

  context('test "user consent" page', () => {
    it('should continue to user usage question if consent approved', () => {
      cy.consent(true, { continuity: true, withLog: true });
      cy.get('.prixa-title > :nth-child(1)').contains('Terima kasih untuk persetujuannya');
      cy.screenshot('Halaman user usage', { capture: 'fullPage' });
    });

    it('should continue to reject confirmation page if consent declined', () => {
      cy.consent(false, { continuity: true, withLog: true });
      cy.get('[data-cy=text-title-question]').contains(
        'Prixa memerlukan persetujuan Anda untuk dapat memberikan hasil prediksi berdasarkan keluhan yang Anda berikan',
      );
      cy.screenshot('Halaman reject confirmation', { capture: 'fullPage' });
    });
  });

  context('test "preconditions" page', () => {
    beforeEach(() => {
      cy.usageFor(true, { continuity: true, withLog: false });
    });

    it('should be able to choose MALE as gender', () => {
      cy.inputGender('MALE', { withLog: true });
      cy.screenshot('Preconditions - [MALE] User Input', { capture: 'fullPage' });
    });

    it('should be able to choose FEMALE as gender', () => {
      cy.inputGender('FEMALE', { withLog: true });
      cy.screenshot('Preconditions - [FEMALE] User Input', { capture: 'fullPage' });
    });

    it('should be able to input DAY as age', () => {
      cy.inputAge(0, 0, 11, { withLog: true });
      cy.screenshot('Preconditions - [DAY] User Input', { capture: 'fullPage' });
    });

    it('should be able to select MONTH as age', () => {
      cy.inputAge(0, 2, 0, { withLog: true });
      cy.screenshot('Preconditions - [MONTH] User Input', { capture: 'fullPage' });
    });

    it('should be able to input YEAR as age', () => {
      cy.inputAge(2000, 0, 0, { withLog: true });
      cy.screenshot('Preconditions - [YEAR] User Input', { capture: 'fullPage' });
    });

    it('should be able to input HEIGHT and WEIGHT', () => {
      cy.inputHeightWeight(175, 72, { withLog: true });
      cy.screenshot('Preconditions - [HEIGHT_WEIGHT] User Input', { capture: 'fullPage' });
    });

    it('should pass all user preconditions requirement', () => {
      cy.preconditionsUserInfo(
        { gender: 'MALE', year: '2000', month: '2', day: '10', height: '130', weight: '40' },
        { withLog: true },
      );
      cy.screenshot('Preconditions - [FULL] User Input', { capture: 'fullPage' });
    });
  });

  context('test "user characteristics" page', () => {
    it('should see all available user characterstic for FEMALE', () => {
      const userPreconditions = {
        gender: 'FEMALE',
        year: String(new Date().getFullYear() - 25),
        month: '2',
        day: '10',
        height: '130',
        weight: '40',
      };
      const userCharacteristics = {
        isDiabetic: true,
        HasHighBloodPressure: true,
        isSmoker: true,
        isAlcoholic: true,
      };
      cy.preconditionsUserCharacteristics(userCharacteristics, { userPreconditions, continuity: true, withLog: true });
      cy.get('img[alt="Status Hamil"]').should('exist');
      cy.screenshot('Preconditions - [Characteristics][FEMALE_AT_25] User Input', { capture: 'fullPage' });
    });

    it('should not see pregnancy when gender is a MALE', () => {
      const userPreconditions = {
        gender: 'MALE',
        year: String(new Date().getFullYear() - 25),
        month: '2',
        day: '10',
        height: '130',
        weight: '40',
      };
      const userCharacteristics = { isDiabetic: true, HasHighBloodPressure: true, isSmoker: true, isAlcoholic: true };
      cy.preconditionsUserCharacteristics(userCharacteristics, { userPreconditions, continuity: true, withLog: true });
      cy.get('img[alt="Status Hamil"]').should('not.exist');
      cy.screenshot('Preconditions - [Characteristics][MALE_AT_25] User Input', { capture: 'fullPage' });
    });

    it('should not see pregnancy, smoker, and alcohol when a female and age is below 15', () => {
      const userPreconditions = {
        gender: 'FEMALE',
        year: String(new Date().getFullYear() - 15),
        month: '2',
        day: '10',
        height: '130',
        weight: '40',
      };
      const userCharacteristics = { isDiabetic: true, HasHighBloodPressure: true };
      cy.preconditionsUserCharacteristics(userCharacteristics, { userPreconditions, continuity: true, withLog: true });
      cy.get('img[alt="Status Hamil"]').should('not.exist');
      cy.get('img[alt="Status Merokok"]').should('not.exist');
      cy.get('img[alt="Status Minum Alkohol"]').should('not.exist');
      cy.screenshot('Preconditions - [Characteristics][FEMALE_AT_15] User Input', { capture: 'fullPage' });
    });

    it('should not see pregnancy when a female and age is above or equal to 70', () => {
      const userPreconditions = {
        gender: 'FEMALE',
        year: String(new Date().getFullYear() - 70),
        month: '2',
        day: '10',
        height: '130',
        weight: '40',
      };
      const userCharacteristics = { isDiabetic: true, HasHighBloodPressure: true, isSmoker: true, isAlcoholic: true };
      cy.preconditionsUserCharacteristics(userCharacteristics, { userPreconditions, continuity: true, withLog: true });
      cy.get('img[alt="Status Hamil"]').should('not.exist');
      cy.screenshot('Preconditions - [Characteristics][FEMALE_AT_65] User Input', { capture: 'fullPage' });
    });

    it('should only see high blood pressure and diabets when a male and age is 10', () => {
      const userPreconditions = {
        gender: 'MALE',
        year: String(new Date().getFullYear() - 10),
        month: '2',
        day: '10',
        height: '130',
        weight: '40',
      };
      const userCharacteristics = { isDiabetic: true, HasHighBloodPressure: true };
      cy.preconditionsUserCharacteristics(userCharacteristics, { userPreconditions, continuity: true, withLog: true });
      cy.get('img[alt="Status Hamil"]').should('not.exist');
      cy.get('img[alt="Status Merokok"]').should('not.exist');
      cy.get('img[alt="Status Minum Alkohol"]').should('not.exist');
      cy.screenshot('Preconditions - [Characteristics][MALE_AT_10] User Input', { capture: 'fullPage' });
    });
  });

  context('test "sariawan" as chief complaint', () => {
    it('should be able to input chief complaint', () => {
      cy.fixture('sariawan').as('sariawan');
      cy.get('@sariawan').then(data => {
        const opts = {
          withLog: true,
          continuity: true,
          isWillingToHave: true,
          userPreconditions: data.preconditions,
          userCharacteristics: data.userCharacteristics,
        };
        cy.inputChiefComplaint(data.chiefComplaint, opts);
        cy.screenshot('Chief complaint - User Input', { capture: 'fullPage' });
      });
    });

    it('should be able to select chief complaint', () => {
      cy.selectChiefComplaint({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
      cy.get('@chiefComplaintFixture').then(() => {
        cy.screenshot('Chief complaint - Select chief complaint', { capture: 'fullPage' });
      });
    });

    it('should be able to answer the questions', () => {
      cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
    });

    it('should be able to see diagnose result page', () => {
      cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });

      cy.fixture('diagnostic.json').then(data => {
        cy.get('div.prixa-container')
          .find('button')
          .contains(data.page.lihatRangkumanKeluhan)
          .should('be.exist');
        cy.get('div.prixa-result-content')
          .find('button')
          .contains(data.page.kirimHasilPrixa)
          .should('be.exist');
        cy.get('div.prixa-container')
          .find('span')
          .contains(data.page.surveyLayanan)
          .should('be.exist');
      });
    });
  });

  context('test "send result email" page', () => {
    beforeEach(() => {
      cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
    });

    it('should display correct email page', () => {
      // cy.get('button')
      //   .contains('Kirim Hasil Prixa ke Email')
      //   .click();
      // cy.screenshot('Bottomsheet kirim email - [Before] User Input', { capture: 'fullPage' });
      cy.get('[data-cy=send-result-button]').should('be.disabled');
      cy.get('[data-cy=send-result-name-input] > input').type('Rian Sanjaya');
      cy.get('[data-cy=send-result-email-input] > input').type('rian@prixa.ai');
      cy.get('[data-cy=send-result-button]').should('be.enabled');
      cy.screenshot('Bottomsheet kirim email - [After] User Input', { capture: 'fullPage' });
      cy.get('[data-cy=send-result-button]').click();
    });
  });

  context('test "rangkuman keluhan" page', () => {
    beforeEach(() => {
      cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
    });

    it('should be able to see complaint summary page', () => {
      cy.get('@chiefComplaintFixture').then(data => {
        cy.get('button')
          .contains('Lihat Rangkuman Keluhan')
          .click();
        cy.screenshot('Halaman rangkuman keluhan', { capture: 'fullPage' });
        cy.get('div.prixa-caption')
          .find('span')
          .contains('Rangkuman Keluhan');
        cy.get('div.prixa-summary-subsection')
          .find('span')
          .contains('Laki-Laki');
        cy.get('div.prixa-summary-subsection')
          .find('span')
          .contains(
            `${String(
              new Date(
                new Date() -
                  new Date(data.preconditions.year, Number(data.preconditions.month) - 1, data.preconditions.day),
              ).getFullYear() - 1970,
            )} tahun`,
          );
        cy.get('div.prixa-summary-section')
          .find('span')
          .contains('Status Kesehatan & Kebiasaan')
          .should('be.exist');
        cy.get('div.prixa-summary-section')
          .find('span')
          .contains('Tidak memiliki riwayat')
          .should('be.exist');
        cy.get('div.prixa-summary-subsection')
          .find('span')
          .contains(`${data.preconditions.height} cm`)
          .should('be.exist');
        cy.get('div.prixa-summary-subsection')
          .find('span')
          .contains(`${data.preconditions.weight} kg`)
          .should('be.exist');
        cy.get('div.prixa-summary-subsection')
          .find('span')
          .contains('BMI')
          .should('be.exist');
        cy.get('[data-cy="summary-keluhan"]')
          .contains('Keluhan')
          .should('be.exist');
        cy.get('[data-cy=summary-keluhan-lain]')
          .find('span')
          .contains('Keluhan lain')
          .should('be.exist');
        cy.get('[data-cy=summary-keluhan-tidak-ada]')
          .find('span')
          .contains('Tidak ada')
          .should('be.exist');
        cy.get('[data-cy=summary-keluhan-tidak-tahu]')
          .find('span')
          .contains('Tidak tahu')
          .should('be.exist');

        cy.get('.prixa-menuback > div > .svg-inline--fa').click();
      });
    });
  });

  context('test "diagnose result servey feedback"', () => {
    beforeEach(() => {
      cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
    });

    it('should have survey layanan title', () => {
      cy.get('[data-cy="survey-title"]').contains('Survey Layanan');
    });

    it('should be able to choose rating star and send it', () => {
      cy.get('.rating-start-5').click();
      cy.get('[data-cy="survey-rating-star-label"').contains('Sangat Terbantu');
      cy.get('[data-cy="rating-send-button"]').click();
      cy.get('[data-cy="survey-rating-finish-desc"').contains(
        'Saran Anda akan membantu Prixa untuk dapat memberi layanan yang lebih baik lagi',
      );
      cy.screenshot('Halaman Diagnosa Result - Selesai Rating', { capture: 'fullPage' });
    });
  });

  context('test return to landing page after diagnose complete', () => {
    beforeEach(() => {
      cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
    });

    it('should return to landing page upon completion', () => {
      cy.get('[data-cy="result-finish-button"]').click();
      cy.wait(3000);
      cy.get('[data-cy=banner-prixa-sekarang]').contains('Prixa Sekarang');
    });
  });

  // context('test continue next diagnose after completion', () => {
  //   beforeEach(() => {
  //     cy.diagnose({ chiefComplaintFixture: 'sariawan', withLog: true, continuity: true });
  //     cy.get('button')
  //       .contains('Selesai')
  //       .click();
  //     cy.get('button')
  //       .contains('Sangat terbantu')
  //       .click();
  //   });

  //   it('should see thank you page upon diagnose result survey completion', () => {
  //     cy.screenshot('Halaman survey thank you', { capture: 'fullPage' });
  //     cy.fixture('diagnostic.json').then(data => {
  //       cy.get('div.prixa-caption')
  //         .find('span')
  //         .contains(data.page.surveyLayananTopTitle)
  //         .should('be.exist');
  //       cy.get('div.prixa-title')
  //         .find('p')
  //         .contains(data.page.surveyLayananTitle)
  //         .should('be.exist');
  //       cy.get('div.prixa-title')
  //         .find('span')
  //         .contains(data.page.surveyLayananContent)
  //         .should('be.exist');
  //     });
  //   });

  //   it('should get back to home page upon completion', () => {
  //     cy.get('button')
  //       .contains('Tutup')
  //       .click();
  //     cy.wait(3000);
  //     cy.get('button')
  //       .contains('Prixa Sekarang')
  //       .should('be.exist');
  //   });
  // });
});
