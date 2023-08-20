import React, { useState } from 'react';
import { Card, Text } from 'prixa-design-kit/dist';
import { DaftarInssuranceForm } from './DaftarInssuranceForm';

import './bannerInssurance.scss';

const inssuranceImage = `${process.env.REACT_APP_ASSET_URL}/insurance/Cover%20Asuransi.png`;

const BannerInssurance = (props: any): JSX.Element => {
  const [isLoad, setLoad] = useState(false);
  const [emailRegistered, setEmailRegistered] = useState(false);

  return (
    <section id="inssurance-section" style={{ padding: '0 40px', marginBottom: '40px' }}>
      <Card className="inssurance-container">
        <InsuranceTitle />
        <BannerImage />
        <InsuranceDescription />
        {emailRegistered ? (
          <RegisConfirmed />
        ) : (
          <div>
            {isLoad ? (
              <div className="insurance-loader-box">
                <div className="insurance-loader"></div>
              </div>
            ) : (
              <DaftarInssuranceForm
                setLoad={setLoad}
                setEmailRegistered={setEmailRegistered}
                setErrMessage={props.setErrMessage}
              />
            )}
            <RegisConfirmation />
          </div>
        )}
      </Card>
    </section>
  );
};

const InsuranceTitle = (): JSX.Element => {
  return (
    <>
      <div className="text-center" style={{ marginTop: '6px' }}>
        <Text scale="pagesubtitle">SEGERA HADIR</Text>
      </div>
      <div className="text-center margin-tinyT">
        <Text scale="heroTitle" style={{ display: 'inline-block', width: '155px' }}>
          Asuransi Rawat Jalan
        </Text>
      </div>
    </>
  );
};

const BannerImage = (): JSX.Element => {
  return (
    <div className="text-center margin-smallT">
      <img loading="lazy" alt="Inssurance banner" src={inssuranceImage} style={{ height: '140.2px' }} />
    </div>
  );
};

const InsuranceDescription = (): JSX.Element => {
  return (
    <div className="text-center margin-smallT">
      <Text
        scale="headerSubtitle"
        style={{
          display: 'inline-block',
          fontWeight: 400,
        }}
      >
        Perlindungan sesuai kondisi diri dari Prixa. Langsung aktif, tanpa uang tunai, premi terjangkau. Daftarkan email
        Anda untuk jadi yang pertama mengetahui layanan ini!
      </Text>
    </div>
  );
};

const RegisConfirmation = (): JSX.Element => {
  return (
    <div className="text-center margin-tinyT">
      <Text className="regis-confirmation-text">
        Dengan mendaftarkan email Anda setuju untuk menerima informasi terkait layanan Prixa melalui email
      </Text>
    </div>
  );
};

const RegisConfirmed = (): JSX.Element => {
  return (
    <div className="text-center insurance-email-registered">
      <Text scale="pagesubtitle" className="title">
        Alamat email Anda sudah didaftarkan, silakan periksa email Anda untuk konfirmasi
      </Text>
    </div>
  );
};

export default BannerInssurance;
