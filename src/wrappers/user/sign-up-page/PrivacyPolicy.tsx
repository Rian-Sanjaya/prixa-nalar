import React from 'react';
import { Text, Bottomsheet } from 'prixa-design-kit/dist';
import PrivacyPolicySideSheet from '../PrivacyPolicySideSheet';

export const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = React.useState(false);

  const openPrivacyPolicy = () => {
    setPrivacyPolicy(true);
  };

  return (
    <React.Fragment>
      <div className="margin-baseT margin-baseB">
        <div className="text-center" style={{ padding: '0 9px' }}>
          <Text scale="content" style={{ fontSize: '12px', lineHeight: 1.5 }}>
            Dengan mendaftarkan akun, Anda menyetujui{' '}
            <span onClick={() => openPrivacyPolicy()}>
              <Text
                style={{ cursor: 'pointer', color: 'var(--secondary)', fontStyle: 'italic', fontSize: '12px' }}
                scale="pageTitle"
              >
                Syarat & Ketentuan
              </Text>
            </span>{' '}
            yang berlaku dari Prixa.
          </Text>
        </div>
      </div>
      <Bottomsheet
        setShow={setPrivacyPolicy}
        show={privacyPolicy}
        title="Syarat dan Ketentuan"
        content={<PrivacyPolicySideSheet />}
      ></Bottomsheet>
    </React.Fragment>
  );
};
