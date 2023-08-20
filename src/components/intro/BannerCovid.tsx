import React from 'react';
import { Paragraph } from 'prixa-design-kit/dist';
import { isCovid, resetConversation } from '../../utils/constant';

const landingCovid = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Gejala - Covid.png`;
let urlCovid = `${process.env.REACT_APP_COVID_URL}`;

if (localStorage.getItem('getAppID') && localStorage.getItem('getAppID') === process.env.REACT_APP_NALAR_APPID) {
  const arr = urlCovid.split('/');
  const domain = arr[0] + '//' + arr[2];
  urlCovid = `${domain}`;
}

interface BannerCovidProps {
  isShowLogin?: boolean;
  showTitle?: boolean;
}

const BannerCovid = ({ isShowLogin, showTitle }: BannerCovidProps): JSX.Element => {
  const url = isCovid ? (isShowLogin ? '/ask-method' : '/consent') : urlCovid;

  const resetDiagnosis = (): void => {
    resetConversation();
  };

  return (
    <section id="first-section" style={{ padding: '0 40px', marginBottom: '40px' }}>
      <div className="banner-covid-container">
        {showTitle && (
          <Paragraph scale="question" className="title">
            Mengalami gejala serupa Covid-19?
          </Paragraph>
        )}
        <a
          href={url}
          onClick={(): void => {
            resetDiagnosis();
          }}
        >
          <div className="covid-image-container" data-cy="banner-prixa-gejala">
            <div className="covid-image">
              <img loading="lazy" alt="Covid landing" src={landingCovid} data-cy="covid-image-landing" />
            </div>
            <div className="content">
              <span className="content-title">Prixa Gejala</span>
              <span className="subtitle">Cari tahu kondisi gejala serupa Covid-19</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default BannerCovid;
