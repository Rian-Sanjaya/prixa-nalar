import React, { useEffect, Fragment, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Text, Paragraph, Card, Accordion, IconSolid } from 'prixa-design-kit/dist';
import { IconHabitHistory } from '../../components/statuslist/IconHabitHistory';
import { IconChronicDiseases } from '../../components/statuslist/IconChronicDiseases';
import { IconPregnancy } from '../../components/statuslist/IconPregnancy';
import CtaFeature from '../../components/cta-feature/CtaFeature';
import { isCovid, showUserManagement } from '../../utils/constant';
import { HeaderContext } from '../../components/header/HeaderContext';

const SummaryPage = (props: any) => {
  const { setHeader } = useContext(HeaderContext);
  const location = useLocation();
  const { user, profiles, symptoms, userDetails }: any = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeader('Rangkuman Keluhan');
  }, [setHeader]);

  const findInProfiles = (name: any) => {
    const profile = profiles.find((element: any) => element.type === name);
    if (profile) {
      return profile.nameIndo;
    } else {
      return '';
    }
  };

  const bmi = userDetails.isObese;

  const height = user.height + ' cm';
  const weight = user.weight + ' kg';

  const gender = user.gender === 'Female' ? 'Perempuan' : 'Laki-Laki';

  const age = userDetails.ageYear;
  const month = userDetails.ageMonth ? userDetails.ageMonth + ' bulan' : '';

  const isCanDrinkAndSmoke = !(age < 17);
  const isCanMenopause = age > 35;
  const isCanPregnant = !(age < 17 || age > 65);

  const ageResult = age ? age + ' tahun ' : '' + month;

  const contactHistoryCovid19 = findInProfiles('contact history COVID19');
  const localTransmissionCovid19 = findInProfiles('local transmission COVID19');

  type PrecondIconsType = {
    [key: string]: boolean;
  };
  const precondIcons: PrecondIconsType = {
    darahTinggi: false,
    diabetes: false,
    merokok: false,
    minumAlkohol: false,
    menopause: false,
    hamil: false,
    kanker: false,
    sakitJantung: false,
    gagalGinjal: false,
  };

  const precondShowIcon: PrecondIconsType = {
    showDrinkAndSmoke: isCanDrinkAndSmoke,
    showMenopause: gender !== 'Perempuan' || !isCanMenopause ? false : true,
    showPregnancy: gender !== 'Perempuan' || !isCanPregnant ? false : true,
  };
  interface HelperType {
    nameIndo: string;
    stateName: string;
  }

  const helperStatus: Array<HelperType> = [
    { nameIndo: 'Gangguan Pembuluh Darah Jantung', stateName: 'sakitJantung' },
    { nameIndo: 'Kanker atau Keganasan', stateName: 'kanker' },
    { nameIndo: 'Gagal Ginjal', stateName: 'gagalGinjal' },
    { nameIndo: 'Hamil', stateName: 'hamil' },
    { nameIndo: 'Menopause', stateName: 'menopause' },
    { nameIndo: 'Diabetes', stateName: 'diabetes' },
    { nameIndo: 'Minum Alkohol', stateName: 'minumAlkohol' },
    { nameIndo: 'Hipertensi', stateName: 'darahTinggi' },
    { nameIndo: 'Perokok', stateName: 'merokok' },
  ];

  profiles.forEach((status: any) => {
    const isHavePrecondition: HelperType | undefined = helperStatus.find(
      (helper: HelperType) => helper.nameIndo === status.nameIndo,
    );
    if (isHavePrecondition) {
      precondIcons[isHavePrecondition.stateName] = true;
      if (isHavePrecondition.nameIndo === 'Hamil' || !isCanMenopause) precondShowIcon['showMenopause'] = false;
      if (isHavePrecondition.nameIndo === 'Menopause') precondShowIcon['showPregnancy'] = false;
    }
  });

  const mainComplaintFiltered = symptoms.filter((element: any) => {
    const isMainComplaint = element.chief === true && element.answer === 'yes';
    return isMainComplaint;
  });
  const mainComplaints = mainComplaintFiltered.map((element: any) => {
    if (element.propNames && element.propNames.length) {
      const propArray = element.propNames.map(({ nameIndo }: any) => nameIndo);
      return [element.symptomName, ...propArray].join(', ');
    }
    return element.symptomName;
  });
  const otherComplaintFiltered = symptoms.filter((element: any) => {
    const isOtherComplaint = element.chief === null && element.answer === 'yes';
    return isOtherComplaint;
  });
  const otherComplaints = otherComplaintFiltered.map((element: any) => {
    if (element.propNames && element.propNames.length) {
      const propArray = element.propNames.map(({ nameIndo }: any) => nameIndo);
      return [element.symptomName, ...propArray].join(', ');
    }
    return element.symptomName;
  });
  const notShowingUpComplaintFiltered = symptoms.filter((element: any) => {
    const isNotShowingUp = element.chief === null && element.answer === 'no';
    return isNotShowingUp;
  });
  const notShowingUpComplaints = notShowingUpComplaintFiltered.map((element: any) => {
    return element.symptomName;
  });
  const unknownComplaintFiltered = symptoms.filter((element: any) => {
    const isUnknown = element.chief === null && element.answer === 'unknown';
    return isUnknown;
  });
  const unknownComplaints = unknownComplaintFiltered.map((element: any) => {
    return element.symptomName;
  });

  return (
    <div className="prixa-container is-top">
      <Card>
        <div className="prixa-summary-section columned">
          <div className="prixa-summary-subsection">
            <span className="color-disabled font-12">Jenis Kelamin</span>
            <br />
            <Text scale="headerSubtitle">{gender}</Text>
          </div>
          <div className="prixa-summary-subsection">
            <span className="color-disabled font-12">Umur</span>
            <br />
            <Text scale="headerSubtitle">{ageResult}</Text>
          </div>
        </div>
        <div className="prixa-summary-section">
          <span className="color-disabled font-12">Status Kesehatan & Kebiasaan</span>
          <br />
          <StatAndPrecond data={precondIcons} showStatus={precondShowIcon} />
        </div>
        <div className="prixa-summary-section columned">
          <div className="prixa-summary-subsection">
            <span className="color-disabled font-12">Tinggi</span>
            <br />
            <Text scale="headerSubtitle">{height}</Text>
          </div>
          <div className="prixa-summary-subsection">
            <span className="color-disabled font-12">Berat</span>
            <br />
            <Text scale="headerSubtitle">{weight}</Text>
          </div>
          <div className="prixa-summary-subsection">
            <span className="color-disabled font-12">BMI</span>
            <br />
            <Text scale="headerSubtitle">{bmi ? 'Obesitas' : 'Normal'}</Text>
          </div>
        </div>
      </Card>

      <div className="margin-largeT margin-baseB">
        <Text scale="question" data-cy="summary-keluhan">
          Keluhan
        </Text>
      </div>
      <Text scale="content">{mainComplaints}</Text>

      <Accordion title="Keluhan lain:" className="margin-baseY" data-cy="summary-keluhan-lain">
        <SummaryList complaints={otherComplaints} />
      </Accordion>

      <Accordion title="Tidak ada:" className="margin-baseB" data-cy="summary-keluhan-tidak-ada">
        <SummaryList complaints={notShowingUpComplaints} />
      </Accordion>

      <Accordion title="Tidak tahu:" className="margin-largeB" data-cy="summary-keluhan-tidak-tahu">
        <SummaryList complaints={unknownComplaints} />
      </Accordion>
      {isCovid ? (
        <Fragment>
          <div className="margin-largeT margin-baseB">
            <Text scale="question" data-cy="summary-covid-risk-label">
              Riwayat Terkait <br /> Risiko Covid-19
            </Text>
          </div>
          <Card>
            <CovidRiskHistory
              haveHistory={contactHistoryCovid19}
              text="Melakukan kontak fisik atau berada di satu ruangan dengan orang yang positif Covid-19?"
            />
            <div className="margin-tinyB"></div>
            <CovidRiskHistory
              haveHistory={localTransmissionCovid19}
              text="Bepergian/tinggal di kota yang menjadi transmisi lokal virus Corona?"
            />
          </Card>
        </Fragment>
      ) : (
        ''
      )}
      {showUserManagement() ? (
        <div className="margin-largeY">
          <CtaFeature />
        </div>
      ) : (
        <span />
      )}
    </div>
  );
};

const StatAndPrecond = ({ data, showStatus }: { data: any; showStatus: any }) => {
  const isHavePrecond = Object.values(data).some(item => item);
  if (isHavePrecond) {
    return (
      <div className="prixa-status-summary">
        <IconHabitHistory statusListProps={{ ...data, ...showStatus }} disabled={true} />
        <IconChronicDiseases statusListProps={{ ...data, ...showStatus }} disabled={true} />
        <IconPregnancy statusListProps={{ ...data, ...showStatus }} disabled={true} />
      </div>
    );
  } else {
    return <Text scale="headerSubtitle">Tidak memiliki riwayat</Text>;
  }
};

const SummaryList = (props: any) => {
  const { complaints } = props;
  if (complaints.length) {
    return (
      <ul style={{ paddingLeft: 'inherit' }}>
        {complaints.map((complaint: any, i: number) => {
          return (
            <li key={i}>
              <Text scale="content">{complaint}</Text>
            </li>
          );
        })}
      </ul>
    );
  } else {
    return <Paragraph scale="content">-</Paragraph>;
  }
};

const CovidRiskHistory = ({ haveHistory, text }: { haveHistory: boolean; text: string }) => {
  return (
    <div style={{ display: 'flex' }}>
      <IconSolid
        backgroundColor={haveHistory ? 'danger' : 'primary'}
        backgroundSize="24px"
        color="white"
        margin="0px"
        type={haveHistory ? 'check' : 'times'}
        width="16px"
      />
      <div className="margin-smallL" style={{ display: 'flex', flexDirection: 'column' }}>
        <Text scale="content" data-cy="summary-covid-risk-text">
          {text}
        </Text>
        <Text scale="questionLink2" className={haveHistory ? 'color-danger' : 'color-primary'}>
          {haveHistory ? 'Iya' : 'Tidak'}
        </Text>
      </div>
    </div>
  );
};

export default SummaryPage;
