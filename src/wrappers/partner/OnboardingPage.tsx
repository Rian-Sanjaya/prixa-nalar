import React, { useState } from 'react';
import { Text, Icon, Button, Toast } from 'prixa-design-kit/dist';
import { postAPI } from '../../api/api-method';
import { PARTNER_TOKEN, USER_API } from '../../api/api-url';
import { getAppID, getPartnerID, getPartnerAuth, closeSeamlessLogin } from '../../utils/constant';

const partnerBanner = `${process.env.REACT_APP_ASSET_URL}/illustration/onboarding.png`;

const OnboardingPage = (): JSX.Element => {
  const [isErrMsg, setErrMsg] = useState('');

  const getToken = (): void => {
    postAPI(
      PARTNER_TOKEN.TOKEN,
      {},
      {
        'Content-Type': 'application/json',
        'X-Prixa-API-Key': `${process.env.REACT_APP_API_KEY}`,
        'X-Client-Id': getPartnerID,
        'X-Client-App-Id': getAppID,
        Authorization: `Bearer ${getPartnerAuth}`,
      },
    )
      .then((res: any) => {
        localStorage.setItem('loginToken', res.loginToken);
        localStorage.setItem('isVerified', String(res.isVerified) || '');
        if(localStorage.getItem('isDependent') === '1'){
          postAPI(USER_API.ADD_DEPENDENT, {})
          .finally(() => {
            window.location.href = '/';
          });
        } else {
          window.location.href = '/';
        }
      })
      .catch(() => {
        setErrMsg('Gangguan sistem, mohon coba kembali.');
      });
  };

  return (
    <div>
      <div className="prixa-header">
        <div className="prixa-menuback" onClick={() => closeSeamlessLogin()}>
          <Icon type="chevron-left" style={{ width: 16 }} />
        </div>
      </div>
      <div className="prixa" style={{ height: 'calc(100vh - 65px)' }}>
        <div className="prixa-container is-top" style={{ padding: '0 0 64px' }}>
          <div style={{ width: '235px', margin: '40px auto' }}>
            <img loading="lazy" alt="Partner banner" src={partnerBanner} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={{ width: '220px', margin: '40px 0 16px 40px' }}>
            <Text scale="question">Anda akan dihubungkan ke Platform Telekonsultasi untuk melanjutkan.</Text>
          </div>
          <div style={{ width: '240px', marginLeft: '40px', display: 'flex' }}>
            <Text scale="feedbackLink" style={{ color: '#0146ab', fontWeight: 500, lineHeight: '18px' }}>
              Proses akan dilakukan secara otomatis dan Anda tidak perlu melakukan pendaftaran ulang untuk menggunakan
              aplikasi. Platform telekonsultasi menjamin kerahasiaan data Anda dan tidak akan menggunakannya untuk
              keperluan lain.
            </Text>
          </div>
        </div>
        <div className="prixa-footer-button">
          <Button
            onClick={() => {
              getToken();
            }}
            size="full"
            variant="primary"
          >
            Setuju dan Lanjutkan
          </Button>
        </div>
      </div>
      <Toast timeout={3000} message={isErrMsg} variant="danger" show={isErrMsg !== ''}></Toast>
    </div>
  );
};

export default OnboardingPage;
