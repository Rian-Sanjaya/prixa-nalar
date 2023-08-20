import React from 'react';
import Conversation from '../../components/conversation/Conversation';

const consentNo = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa%20Consent%20-%20Not%20Accepted.png`;

export interface QuestionProps {
  information?: string;
  title: Array<string>;
  subtitle?: string;
  imgSrc?: string;
  feedback?: boolean;
  options: Option[];
}

export interface Option {
  text: string;
  link: string;
  variant: 'default' | 'outline' | 'primary' | 'disabled' | 'secondary' | 'success' | undefined;
  type: string;
}

const ConsultationConsent: React.FC = () => {
  const question: QuestionProps = {
    title: [
      'Anda akan segera berkonsultasi dengan Dokter',
    ],
    subtitle: 'Dengan klik "Setuju" Anda menyetujui Syarat dan Ketentuan untuk berbagi keluhan anda dengan Dokter Telekonsultasi',
    options: [
      { text: 'Setuju', link: '/preconsultation', variant: 'secondary', type: 'button' },
      { text: 'Tidak Setuju', link: '/tnc-reject', variant: 'secondary', type: 'button' },
    ],
  };

  return <Conversation title={question.title} subtitle={question.subtitle} options={question.options} state="showTnC"></Conversation>;
};

const ConsultationConsentReject: React.FC = () => {
  const question: QuestionProps = {
    imgSrc: consentNo,
    title: ['Mohon maaf, Prixa tidak dapat melanjutkan pemeriksaan tanpa persetujuan Anda.'],
    options: [{ text: 'Ulangi', link: '/', variant: 'primary', type: 'button' }],
  };

  return <Conversation imgSrc={question.imgSrc} title={question.title} options={question.options}></Conversation>;
};

export { ConsultationConsent, ConsultationConsentReject };
