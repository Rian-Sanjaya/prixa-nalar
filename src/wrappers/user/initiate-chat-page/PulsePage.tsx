import React from 'react';
import '../../../styles/pulse.scss';
import { Paragraph } from 'prixa-design-kit/dist';

export const PulsePage = ({ text = 'Menghubungkan dengan dokter...' }: { text?: string }): JSX.Element => {
  return (
    <div className="blobs-container">
      <div className="blob"></div>
      <div className="blob2"></div>
      <div className="blob3"></div>
      <div className="blob4"></div>
      <Paragraph style={{ marginTop: '25vh', textAlign: 'center' }}>
        <b>{text}</b>
      </Paragraph>
    </div>
  );
};
