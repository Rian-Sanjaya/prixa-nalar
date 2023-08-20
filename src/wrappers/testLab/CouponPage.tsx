import React, { useState, useEffect, useContext } from 'react';
import { Text, InputText, Button, Toast } from 'prixa-design-kit/dist';
import { showUserManagement } from '../../utils/constant';
import { HeaderContext } from '../../components/header/HeaderContext';
import { LABTEST_API } from '../../api/api-url';
import { getAPI } from '../../api/api-method';
import CTAFeature from './CTAFeature';
import './testLab.scss';

const carouselHome = `${process.env.REACT_APP_ASSET_URL}/carousel/prixa-app-intro.png`;

const CouponPage = (): JSX.Element => {
  const [couponCode, setCouponCode] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const { setHeader } = useContext(HeaderContext);

  /* eslint-disable */
  useEffect(() => {
    setHeader('Tes Lab');

    getAPI(LABTEST_API.COUPON).then((res: any) => {
      if (res && res.coupon_code) setCouponCode(res.coupon_code);
    }).catch(err => {
      setErrMessage(`Cannot generate the coupon code. ${err.message}`);
      setTimeout(() => {
        setErrMessage('');
      }, 3000);
    });
  }, []);
  /* eslint-enable */

  return (
    <div className="prixa-container is-top">
      <InfoSection />
      <CouponSection couponCode={couponCode} setCouponCode={setCouponCode} />
      <DisclaimerSection />
      {showUserManagement() ? <CTAFeature /> : <span />}
      <Toast timeout={3000} variant="danger" show={errMessage !== ''} message={errMessage} />
    </div>
  );
};

const InfoSection = (): JSX.Element => {
  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '250px',
          margin: 'auto',
          backgroundImage: `url(${carouselHome})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 50%',
        }}
      ></div>
      <div className="prixa-title" style={{ marginTop: '40px', width: '100%' }}>
        <Text scale="question" className="text-carousel">
          Lorem ipsum
        </Text>
        <Text scale="content" className="text-carousel margin-smallT">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna
        </Text>
      </div>
    </div>
  );
};

const CouponSection = ({ couponCode }: any): JSX.Element => {
  const copyToClipboard = (text: string): void => {
    const txtArea = document.createElement('textarea');
    txtArea.innerText = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    document.execCommand('copy');
    document.body.removeChild(txtArea);
  };

  const handleCoupon = (e: any): boolean => {
    return false;
  };

  return (
    <div>
      <div style={{ background: 'var(--secondary)', padding: '24px', borderRadius: '8px' }}>
        <div style={{ display: 'flex' }}>
          <InputText setData={handleCoupon} value={couponCode} className="coupon-text" />
          <Button className="coupon-button" onClick={() => copyToClipboard(couponCode)}>
            Salin
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '40px', padding: '0 27.5px' }}>
        <Button
          variant="primary"
          size="full"
          href="https://www.triasse.com/"
          target="_blank"
          style={{ borderRadius: '30px' }}
        >
          Pesan Tes Lab
        </Button>
      </div>
    </div>
  );
};

const DisclaimerSection = (): JSX.Element => {
  return (
    <div style={{ marginTop: '44px', marginBottom: '24px' }}>
      <div style={{ width: '214px', margin: '0 auto' }}>
        <Text scale="headerTitle" style={{ display: 'block', textAlign: 'center', lineHeight: 1.5 }}>
          Perlu penanganan lebih lanjut untuk keluhan Anda?
        </Text>
        <Text scale="headerTitle" style={{ display: 'block', textAlign: 'center', lineHeight: 1.5 }}>
          Prixa siap membantu.
        </Text>
      </div>
    </div>
  );
};

export default CouponPage;
