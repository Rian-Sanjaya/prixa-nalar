import React from 'react';
import '../cta-feature/ctaFeature.scss';
import { Text } from 'prixa-design-kit/dist';
import {
  showTelemedFeature,
  showBookingeature,
  showLabFeature,
  showPharmacyFeature,
  isCovid,
  resetConversation,
} from '../../utils/constant';
import UseTracking from '../../utils/useTracking';
import { sessionId, currentState } from '../../api/api-utils';

const diagnoseEngineImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Diagnosa.png`;
const consultationViaChatImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Chat-Consultation.png`;
const doctorAppointmentImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Appointment-Booking.png`;
const drugDeliveryImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Pharmacy-Delivery.png`;
const labTestImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Lab-Test.png`;

interface CtaFeatureProps {
  isTitle?: boolean;
  isShowDiagnonseMenu?: boolean;
  sessionID?: string;
  setLoad?: React.Dispatch<React.SetStateAction<boolean>>;
  isShowLogin?: boolean;
  isFromResultPage?: boolean;
}

interface CTAContentBlocksProps extends CtaFeatureProps {
  text: string;
  description: string;
  enabled?: boolean;
  link: string;
  newTab: boolean;
  img?: string;
  bgColor: string;
}
// enabled: showTelemedFeature()
//   ? localStorage.getItem('telemedicineSDKURL') === ''
//     ? true
//     : isFromResultPage
//     ? true
//     : false
//   : false,
const CtaFeature = ({
  isTitle = true,
  isShowDiagnonseMenu = false,
  setLoad,
  isShowLogin,
  isFromResultPage,
}: CtaFeatureProps): JSX.Element => {
  const CTAContent = [
    {
      text: 'Konsultasi via Chat',
      description: 'Terhubung langsung dengan dokter',
      enabled: (() => {
        if (showTelemedFeature() && (localStorage.getItem('telemedicineSDKURL') === '' || isFromResultPage)) {
          return true;
        } else {
          return false;
        }
      })(),
      link:
      localStorage.getItem('telemedicineSDKURL') === ''
          ? '/tnc'
          : `${localStorage.getItem('telemedicineSDKURL')}?sessionID=${sessionId}`,
      newTab: false,
      img: consultationViaChatImg,
      bgColor: '#55B9E6',
    },
    {
      text: 'Atur Janji Temu Dokter',
      description: 'Buat jadwal ke dokter secara online',
      enabled: showBookingeature() ? true : false,
      link: '/booking',
      newTab: false,
      img: doctorAppointmentImg,
      bgColor: '#5ECE1E',
    },
    {
      text: 'Pesan Antar Farmasi',
      description: 'Beli obat tanpa perlu ke apotek',
      enabled: showPharmacyFeature() ? true : false,
      link: '/pharmacy-delivery',
      newTab: false,
      img: drugDeliveryImg,
      bgColor: '#FFB211',
    },
    {
      text: 'Pesan Tes Lab',
      description: 'Periksa kondisi lebih lanjut',
      enabled: showLabFeature() ? true : false,
      link: '/testlab',
      newTab: false,
      img: labTestImg,
      bgColor: '#FF4E1C',
    },
  ];

  return (
    <div className="prixa-container">
      <CTATitle isTitle={isTitle} />
      <CTADiagnose isShowDiagnonseMenu={isShowDiagnonseMenu} isShowLogin={isShowLogin} />
      {CTAContent.map((data, i) => {
        return (
          <CTAContentBlocks
            key={i}
            text={data.text}
            description={data.description}
            enabled={data.enabled}
            link={data.link}
            newTab={data.newTab}
            img={data.img}
            bgColor={data.bgColor}
          />
        );
      })}
    </div>
  );
};

const CTAContentBlocks = ({
  text,
  description,
  enabled,
  link,
  newTab,
  img,
  bgColor,
}: CTAContentBlocksProps): JSX.Element => {
  const imagePlate = (
    <a
      target={newTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
      data-cy={text.replace(/\s+/g, '-').toLowerCase()}
      href={link}
      onClick={(): void => {
        UseTracking({ event: `${text} clicked`, properties: { sessionId, state: currentState } });
      }}
    >
      <div className="prixa-cta" style={{ backgroundColor: bgColor }}>
        <div className="content">
          <span className="title">{text}</span>
          <span className="subtitle">{description}</span>
        </div>
        <img src={img} alt="CTA Icon" />
      </div>
    </a>
  );

  return enabled ? imagePlate : <span></span>;
};

const CTATitle = ({ isTitle }: { isTitle: boolean }): JSX.Element | null => {
  if (isTitle) {
    return (
      <div className="margin-largeB text-center">
        <Text scale="headerTitle">
          Perlu penanganan lebih lanjut untuk keluhan Anda? <br /> Prixa siap membantu.
        </Text>
      </div>
    );
  } else return null;
};

const CTADiagnose = ({
  isShowDiagnonseMenu,
  isShowLogin,
}: {
  isShowDiagnonseMenu: boolean;
  isShowLogin: boolean | undefined;
}): JSX.Element | null => {
  if (isShowDiagnonseMenu) {
    let urlNalar = `${process.env.REACT_APP_NALAR_URL}`;

    if (localStorage.getItem('getAppID') && localStorage.getItem('getAppID') === process.env.REACT_APP_COVID_APPID) {
      const arr = urlNalar.split('/');
      const domain = arr[0] + '//' + arr[2];
      urlNalar = `${domain}`;
    }

    const url = isCovid ? urlNalar : isShowLogin ? '/ask-method' : '/consent';

    return (
      <a
        href={url}
        onClick={
          isCovid
            ? (): JSX.Element => <span></span>
            : (): void => {
                UseTracking({ event: `Prixa Sekarang clicked`, properties: { sessionId, state: currentState } });
                resetConversation();
              }
        }
      >
        <div className="cta-diagnosa">
          <img loading="lazy" alt="Intro Landing" src={diagnoseEngineImg} data-cy="covid-image-landing" />
          <div className="content">
            <span className="title" data-cy="banner-prixa-sekarang">
              Prixa Sekarang
            </span>
            <span className="subtitle">Cari tahu kemungkinan kondisi kesehatanmu</span>
          </div>
        </div>
      </a>
    );
  } else return null;
};

export default CtaFeature;
