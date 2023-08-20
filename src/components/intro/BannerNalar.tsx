import React from 'react';
import { Button, Paragraph, Card } from 'prixa-design-kit/dist';

const landingNalar = `${process.env.REACT_APP_ASSET_URL}/illustration/complaint.png`;
let urlNalar = `${process.env.REACT_APP_NALAR_URL}`;

if (localStorage.getItem('getAppID') && localStorage.getItem('getAppID') === process.env.REACT_APP_COVID_APPID) {
  const arr = urlNalar.split('/');
  const domain = arr[0] + '//' + arr[2];
  urlNalar = `${domain}`;
}

const BannerNalar: React.FC = () => {
  return (
    <section id="first-section">
      <Card className="banner-nalar-container">
        <div className="prixa-question-image">
          <img
            loading="lazy"
            alt="Covid landing"
            src={landingNalar}
            style={{ width: '300px', height: '205px' }}
            data-cy="covid-image-landing"
          />
        </div>
        <Paragraph scale="heroTitle" className="text-center" style={{ width: '275px', margin: 'auto auto 24px' }}>
          Ada keluhan selain gejala serupa Covid-19?
        </Paragraph>
        <div className="text-center" style={{ marginBottom: '85px' }}>
          <a href={urlNalar}>
            <Button
              className="dav-special"
              size="option"
              variant="primary"
              style={{ fontSize: '24px', padding: '16px 39px' }}
              data-cy="button-prixa-sekarang"
            >
              Prixa Sekarang
            </Button>
          </a>
        </div>
      </Card>
    </section>
  );
};

export default BannerNalar;
