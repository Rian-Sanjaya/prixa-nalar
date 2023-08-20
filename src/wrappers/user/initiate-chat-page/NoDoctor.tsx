import React from 'react';
import '../../../styles/pulse.scss';
import { Paragraph, Button } from 'prixa-design-kit/dist';

export const NoDoctor = (): JSX.Element => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        loading="lazy"
        alt="no-doc"
        src={`${process.env.REACT_APP_ASSET_URL}/telemed/Tidak%20Menemukan%20Dokter.png`}
        width="100%"
        height="auto"
      />
      <Paragraph scale="content" style={{ fontSize: '16px', textAlign: 'center', margin: '-5vh 58px 10vh' }}>
        Mohon maaf, belum ada dokter yang tersedia saat ini.
      </Paragraph>
      <Button
        onClick={(): void => {
          window.location.reload();
        }}
        size="xLarge"
        variant="primary"
      >
        Coba Lagi
      </Button>
    </div>
  );
};
