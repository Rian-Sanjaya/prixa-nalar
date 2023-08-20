import React, { Fragment } from 'react';
import { Box, Button, Sidesheet, openSideSheet, closeSideSheet } from 'prixa-design-kit/dist';
import UserDataFormSideSheet from './sidesheets/UserDataFormSheet';
import UseTracking from '../../../utils/useTracking';
import TelemedicineButton from '../../diagnostic/result-page/TelemedicineButton';

interface SummaryMessageType {
  showRDTForm: boolean;
  rdtUrl?: string;
  showSelfForm: boolean;
  formUrl?: string;
  sessionId: string;
}
export const SummaryMessage = ({
  showRDTForm,
  rdtUrl,
  showSelfForm,
  formUrl,
  sessionId,
}: SummaryMessageType): JSX.Element => {
  const [sideSheet, setSideSheet] = React.useState<boolean>(false);

  let titleSummary = 'Pasien dengan keluhan seperti anda biasanya tidak memerlukan pemeriksaan langsung oleh dokter.';
  let detailSummary =
    'Isolasi mandiri di rumah dan jaga jarak aman dengan orang lain. Gunakan layanan konsultasi online   untuk mendapatkan saran perawatan lebih lanjut.';
  let buttonText = '';
  let linkUrl = '';
  let boxColor = 'secondary';
  let onClickCallback;
  let dataCy = 'button-summary-form';

  if (showRDTForm && rdtUrl) {
    titleSummary =
      'Anda masuk dalam kriteria resiko COVID-19, mohon isi data diri Anda di bawah untuk registrasi tes masif.';
    detailSummary =
      'Prixa akan meneruskan data Anda ke pemerintah setempat untuk keperluan daftar prioritas tes masif dan tidak akan menggunakannya untuk keperluan lain. Kami mengapresiasi partisipasi aktif Anda dalam membantu memperlambat laju penyebaran virus n-CoV dan penyakit COVID-19.';
    buttonText = 'Daftar Tes COVID-19';
    linkUrl = `${rdtUrl}`;
    boxColor = 'danger';
    onClickCallback = (): void => {
      UseTracking({ event: '[CLICK]-[FORM][RDT]', properties: { sessionId } });
      window.open(linkUrl, '_blank');
    };
    dataCy = dataCy + '-rdt';
  }

  if ((!showRDTForm && showSelfForm) || (showRDTForm && !rdtUrl)) {
    titleSummary = 'Pasien dengan keluhan seperti anda biasanya memerlukan pemeriksaan langsung oleh dokter.';
    detailSummary =
      'Untuk memudahkan pemantauan kondisi Anda terkait kasus COVID-19, mohon isi data diri anda di bawah. Prixa akan meneruskan data Anda ke pemerintah setempat untuk keperluan pemetaan lokasi pantauan dan tidak akan menggunakannya untuk keperluan lain. Kami mengapresiasi partisipasi aktif Anda.';
    buttonText = 'Isi Data Diri';
    linkUrl = formUrl || '/';
    dataCy = dataCy + '-self';
    onClickCallback = (): void => {
      setSideSheet(true);
      openSideSheet();
      UseTracking({ event: '[CLICK]-[FORM][SELF]', properties: { sessionId } });
    };
  }

  const doSetSideSheet = (val: boolean) => {
    setSideSheet(val);
    if (!val) closeSideSheet();
  };

  return (
    <Fragment>
      <Box bordered variant={boxColor} className="margin-largeX margin-baseT margin-largeB" style={{ padding: '24px' }}>
        <div className={`text-center color-${boxColor}`}>
          <span className="prixa-summary-message-title" data-cy="result-covid-message">
            {titleSummary}
          </span>
          <p className="prixa-summary-message-detail">{detailSummary}</p>

          {buttonText && linkUrl && (
            <>
              <Button
                onClick={onClickCallback}
                size="large"
                variant="outline"
                color={boxColor === 'danger' ? 'var(--alert)' : 'var(--secondary)'}
                className={`dav-special margin-smallT color-${boxColor}`}
                data-cy={dataCy}
              >
                {buttonText}
              </Button>
              <TelemedicineButton sessionId={sessionId} boxColor={boxColor} />
            </>
          )}
        </div>
      </Box>
      <Sidesheet
        setModal={setSideSheet}
        show={sideSheet}
        title="Isi Data Diri"
        content={<UserDataFormSideSheet setModal={doSetSideSheet} sessionId={sessionId} />}
      ></Sidesheet>
    </Fragment>
  );
};
