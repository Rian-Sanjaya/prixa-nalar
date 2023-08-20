import React from 'react';
import '../../styles/pulse.scss';
import { Paragraph, Button } from 'prixa-design-kit/dist';

export const NoInternet = (): JSX.Element => {
  return (
    <div style={{ padding: '0 40px' }}>
      <div style={{ width: '278px', margin: '40px auto 0' }}>
        <img
          alt="no-internet"
          src={`${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa - Lost Connection.png`}
          width="100%"
          height="auto"
        />
      </div>
      <div style={{ display: 'flex' }}>
        <Paragraph scale="question" style={{ width: '218px', margin: '64px 0 0', lineHeight: 1.25 }}>
          Koneksi ke internet tidak tersedia
        </Paragraph>
      </div>
      <div style={{ display: 'flex' }}>
        <Paragraph scale="pagesubtitle" style={{ margin: '16px 0 40px', width: '226px', lineHeight: 1.5 }}>
          Anda sedang tidak terhubung ke internet. Mohon periksa kembali koneksi anda.
        </Paragraph>
      </div>
      <div className="prixa-right-button">
        <Button
          onClick={(): void => {
            window.location.reload();
          }}
          size="option"
          variant="primary"
          style={{ margin: '0 0 64px' }}
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
};

export default NoInternet;
