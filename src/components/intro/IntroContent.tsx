import React, { useState, useContext, useEffect } from 'react';
import { Button, Toast, Text, IconSolid, Icon } from 'prixa-design-kit/dist';
import { useHistory } from 'react-router-dom';
import { showInsuranceFeature, isCovid, getPartnerAuthStorage } from '../../utils/constant';
import CTAFeature from '../cta-feature/CtaFeature';
import BannerCovid from './BannerCovid';
import BannerHistoryActivity from './BannerHistoryActivity';
import IntroCarousel from './IntroCarousel';
import BannerInssurance from './banner-inssurance/BannerInssurance';
import { HeaderContext } from '../header/HeaderContext';
import { getAPI } from '../../api/api-method';
import { USER_API } from '../../api/api-url';
import { LoadPage } from '../../wrappers/diagnostic/LoadPage';
import UseTracking from '../../utils/useTracking';
import { sessionId, currentState } from '../../api/api-utils';
import './intro.scss';

const IntroContent: React.FC = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [profileAddress, setProfileAddress] = useState('');
  const [profileDOB, setProfileDOB] = useState('');

  const { setMenu, setShowAvatar } = useContext(HeaderContext);

  const bannerInsuranceContent = showInsuranceFeature() && <BannerInssurance setErrMessage={setErrMessage} />;

  const isShowLogin =
    localStorage.getItem('getAppID') === process.env.REACT_APP_NALAR_APPID ||
    localStorage.getItem('getAppID') === process.env.REACT_APP_COVID_APPID ||
    localStorage.getItem('telemedicineSDKURL') !== ''
      ? false
      : true;

  const introOrder = isCovid ? (
    <>
      <BannerCovid isShowLogin={isShowLogin} showTitle={true} />
      {!isLogin && <IntroCarousel />}
      {isLogin && <BannerHistoryActivity />}
      <NotCovidSymptonQuestion />
      <section id="cta-section">
        <CTAFeature isTitle={false} isShowDiagnonseMenu={true} isShowLogin={isShowLogin} />
      </section>
    </>
  ) : (
    <>
      <section id="cta-section">
        <CTAFeature isTitle={false} isShowDiagnonseMenu={true} isShowLogin={isShowLogin} />
      </section>
      {!isLogin && <IntroCarousel />}
      {isLogin && <BannerHistoryActivity />}
      {/* <BannerCovid isShowLogin={isShowLogin} /> */}
    </>
  );

  const checkLogin = (): void => {
    if (localStorage.getItem('loginToken') && localStorage.getItem('isVerified') === 'true') {
      setLoading(true);
      getAPI(USER_API.INFO)
        .then((res: any) => {
          if (res.address) setProfileAddress(res.address);
          if (res.birthdate) setProfileDOB(res.birthdate);

          localStorage.setItem('profileData', JSON.stringify(res));
          setIsLogin(true);
          setLoading(false);
        })
        .catch(() => {
          setIsLogin(false);
          setLoading(false);
        });
    } else {
      setIsLogin(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    setMenu(false);
    if (isLogin) setShowAvatar(true);
    else setShowAvatar(false);
  }, [setMenu, setShowAvatar, isLogin]);

  return isLoading ? (
    <LoadPage />
  ) : (
    <div className="prixa-container is-top landingpage" style={{ padding: '24px 0px 24px' }}>
      {isShowLogin ? isLogin ? <GreetingMessage /> : <WelcomeMessage /> : <span></span>}
      {isLogin &&
      (!profileAddress || !profileDOB) &&
      (getPartnerAuthStorage === '' || getPartnerAuthStorage === null) ? (
        <CompleteProfileButton />
      ) : (
        <span></span>
      )}
      {introOrder}
      {bannerInsuranceContent}
      {/* <BannerPrixaDict /> */}
      {/* <BannerAboutPrixa /> */}
      <Toast timeout={3000} variant="danger" show={errMessage !== ''} message={errMessage} />
    </div>
  );
};

const GreetingMessage = (): JSX.Element => {
  const profileData = localStorage.getItem('profileData');
  let userName = '';
  if (profileData) userName = JSON.parse(profileData).name;

  return (
    <section id="greeting-section">
      <div className="title">
        <div>
          <Text scale="question" data-cy="beranda-greeting-message">
            Selamat datang,
          </Text>
        </div>
        <div>
          <Text scale="question">{userName}</Text>
        </div>
      </div>
      <div className="subtitle">
        <Text scale="pageTitle">Ada yang bisa Prixa bantu?</Text>
      </div>
    </section>
  );
};

const WelcomeMessage = (): JSX.Element => {
  const history = useHistory();
  const login = (): void => {
    UseTracking({ event: `Menu Login clicked`, properties: { sessionId, state: currentState } });
    history.push({
      pathname: '/login',
    });
  };

  const signUp = (): void => {
    UseTracking({ event: `Menu Signup clicked`, properties: { sessionId, state: currentState } });
    history.push({
      pathname: '/sign-up',
    });
  };

  return (
    <section id="welcome-section">
      <div className="title">
        <Text scale="heroTitle">Teman Sehatmu</Text>
      </div>
      <div className="subtitle">
        <Text scale="headerSubtitle" style={{ fontSize: 14, fontWeight: 500 }}>
          Hadir menemani setiap langkahmu menuju hidup yang lebih sehat.
        </Text>
      </div>
      <div className="logreg-button">
        <Button className="log-button" size="tiny" variant="outline" onClick={signUp}>
          Daftar
        </Button>
        <Button className="reg-button" size="tiny" variant="primary" onClick={login}>
          Masuk
        </Button>
      </div>
    </section>
  );
};

const NotCovidSymptonQuestion = (): JSX.Element => {
  return (
    <section id="not-covid-question-section">
      <div className="question">
        <Text scale="question">Ada keluhan selain gejala serupa Covid-19?</Text>
      </div>
    </section>
  );
};

const CompleteProfileButton = (): JSX.Element => {
  const history = useHistory();

  return (
    <section id="complete-profile-section" style={{ padding: '0 40px', marginBottom: '40px' }}>
      <div
        style={{ border: '2px solid var(--secondary)', borderRadius: '24px', padding: '10px 16px', cursor: 'pointer' }}
        onClick={() => history.push({ pathname: '/profile' })}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconSolid
              type="check"
              style={{ width: '24px', height: '24px', color: '#ffffff', backgroundColor: 'var(--secondary)' }}
            />
            <div style={{ marginLeft: '8px' }}>
              <Text scale="feedbackLink" style={{ fontWeight: 700 }}>
                Lengkapi profil Anda
              </Text>
            </div>
          </div>
          <Icon type="chevron-right" style={{ color: 'var(--secondary)' }} />
        </div>
      </div>
    </section>
  );
};

export default IntroContent;
