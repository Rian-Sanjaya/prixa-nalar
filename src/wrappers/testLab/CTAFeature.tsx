import React from 'react';
import { sessionId } from '../../api/api-utils';
import { showTelemedFeature, showBookingeature, showPharmacyFeature } from '../../utils/constant';

const consultationViaChatImg = `${process.env.REACT_APP_ASSET_URL}/home/Menu Konsultasi.png`;
const doctorAppointmentImg = `${process.env.REACT_APP_ASSET_URL}/home/Menu Janji Temu.png`;
const drugDeliveryImg = `${process.env.REACT_APP_ASSET_URL}/home/Menu Antar Farmasi.png`;
const labTestImg = `${process.env.REACT_APP_ASSET_URL}/home/Menu Periksa Gejala.png`;

const CTAFeature = (): JSX.Element => {
  const CTAContent = [
    {
      text: 'Periksa Gejala',
      enabled: true,
      link: '/',
      newTab: false,
      img: labTestImg,
    },
    {
      text: 'Konsultasi via Chat',
      enabled: showTelemedFeature() ? true : false,
      link:
        localStorage.getItem('telemedicineSDKURL') === ''
          ? '/preconsultation'
          : `${localStorage.getItem('telemedicineSDKURL')}?sessionID=${sessionId}`,
      newTab: false,
      img: consultationViaChatImg,
    },
    {
      text: 'Janji Temu Dokter',
      enabled: showBookingeature() ? true : false,
      link: '/booking',
      newTab: false,
      img: doctorAppointmentImg,
    },
    {
      text: 'Pesan Antar Farmasi',
      enabled: showPharmacyFeature() ? true : false,
      link: process.env.REACT_APP_CTA_PHARMACY,
      newTab: true,
      img: drugDeliveryImg,
    },
  ];

  return (
    <div className="prixa-container">
      {CTAContent.map((data, i) => {
        if ((i + 1) % 2 === 1) {
          return (
            <div className="prixa-cta" key={i}>
              <CTAContentBlocks
                text={data.text}
                enabled={data.enabled}
                link={data.link}
                newTab={data.newTab}
                img={data.img}
              />
              <CTAContentBlocks
                text={CTAContent[i + 1].text}
                enabled={CTAContent[i + 1].enabled}
                link={CTAContent[i + 1].link}
                newTab={CTAContent[i + 1].newTab}
                img={CTAContent[i + 1].img}
              />
            </div>
          );
        } else {
          return <span key={i} />;
        }
      })}
    </div>
  );
};

const CTAContentBlocks = ({ text, enabled, link, newTab, img }: any): JSX.Element => {
  const imagePlate = (
    <React.Fragment>
      <img loading="lazy" width="140px" height="140px" alt={text} src={img} />
      {enabled ? (
        <span />
      ) : (
        <React.Fragment>
          <div className="prixa-cta-soon"></div>
          <span className="coming-soon">Segera Hadir</span>
        </React.Fragment>
      )}
      <div className="prixa-cta-title">
        <span>{text}</span>
      </div>
    </React.Fragment>
  );

  if (enabled) {
    return (
      <a
        target={newTab ? '_blank' : '_self'}
        rel="noopener noreferrer"
        data-cy={text.replace(/\s+/g, '-').toLowerCase()}
        href={link}
        className="cta"
      >
        {imagePlate}
      </a>
    );
  } else {
    return <div className="cta">{imagePlate}</div>;
  }
};

export default CTAFeature;
