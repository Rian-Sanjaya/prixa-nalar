import React, { useState, useEffect } from 'react';
import { Button, Paragraph, Bottomsheet } from 'prixa-design-kit/dist';
import { Link } from 'react-router-dom';
import { geoLocation } from '../../api/api-utils';
import { useHistory } from 'react-router-dom';
import UseTracking from '../../utils/useTracking';
import { sessionId, currentState } from '../../api/api-utils';
import { LoginSection } from '../user/login-page/LoginPage';
import { getAPI } from '../../api/api-method';
import { USER_API } from '../../api/api-url';

const AskMethod: React.FC = () => {
  const history = useHistory();
  const [bottomSheet, setBottomSheet] = useState(false);
  const [key, setKey] = React.useState(0);

  useEffect(() => {
    if (!bottomSheet) {
      setTimeout(() => {
        setKey(key => key + 1);
      }, 300);
    }
  }, [bottomSheet]);

  // to show locaiton permission at consent page first. no callback needed actualy, just bcs lint
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      geoLocation.latitude = position.coords.latitude;
      geoLocation.longitude = position.coords.longitude;
    });
  }

  const signUp = (): void => {
    UseTracking({ event: `Menu Signup clicked`, properties: { sessionId, state: currentState } });
    history.push({
      pathname: '/sign-up',
    });
  };

  const afterLoggedIn = (): void => {
    getAPI(USER_API.INFO).then((res: unknown) => {
      localStorage.setItem('profileData', JSON.stringify(res));
      history.push({
        pathname: '/conversation',
      });
    });
  };

  return (
    <div className="prixa-container">
      <div className="prixa-body">
        <div className="prixa-title">
          <Paragraph scale="question" data-cy="text-title-question">
            Informasi diri Anda dapat disimpan untuk konsultasi selanjutnya dengan mendaftar di Prixa. Apakah Anda ingin
            mendaftar?
          </Paragraph>
          <Paragraph className="prixa-title-sub" scale="caption" data-cy="text-subtitle-question">
            Anda dapat tetap menggunakan sistem periksa berbasis AI Nalar Prixa tanpa mendaftarkan akun.
          </Paragraph>
        </div>
        <div>
          <div className="prixa-right-button" data-cy="button-option">
            <a href="/sign-up" className="button" onClick={(): void => signUp()}>
              <Button size="option" className="dav-special" variant="secondary" style={{ marginTop: '20px' }}>
                Daftar
              </Button>
            </a>
          </div>
          <div className="prixa-right-button" data-cy="button-option">
            <Button
              size="option"
              className="dav-special"
              variant="secondary"
              style={{ marginTop: '20px' }}
              onClick={(): void => setBottomSheet(true)}
            >
              Masuk
            </Button>
          </div>
          <div className="prixa-right-button" data-cy="button-option">
            <Link to="/consent">
              <Button
                size="option"
                className="dav-special"
                variant="outline"
                color="var(--secondary)"
                style={{ marginTop: '20px', padding: '14px 24px' }}
                data-cy="button-nanti-saja"
              >
                Nanti Saja
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Bottomsheet
        key={key}
        title="Masuk Akun"
        show={bottomSheet}
        setShow={setBottomSheet}
        content={
          <div className="margin-largeB">
            <LoginSection afterLoggedIn={(): void => afterLoggedIn()} />
          </div>
        }
      />
    </div>
  );
};

export { AskMethod };
