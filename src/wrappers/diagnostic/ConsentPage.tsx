import React from 'react';
import Conversation from '../../components/conversation/Conversation';
import { geoLocation } from '../../api/api-utils';

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

const Consent: React.FC = () => {
  const question: QuestionProps = {
    title: [
      'Data yang Anda masukkan akan direkam dan dipelajari oleh Prixa untuk meningkatkan akurasi hasil prediksi.',
    ],
    subtitle: 'Prixa menjamin kerahasiaan data Anda dan tidak akan menggunakannya untuk keperluan lain.',
    options: [
      { text: 'Setuju', link: '/conversation', variant: 'secondary', type: 'button' },
      { text: 'Tidak Setuju', link: '/consent-reject-confirmation', variant: 'secondary', type: 'button' },
    ],
  };

  // to show locaiton permission at consent page first. no callback needed actualy, just bcs lint
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      geoLocation.latitude = position.coords.latitude;
      geoLocation.longitude = position.coords.longitude;
    });
  }

  return <Conversation title={question.title} subtitle={question.subtitle} options={question.options}></Conversation>;
};

const ConsentAccept: React.FC = () => {
  const question: QuestionProps = {
    title: [
      'Terima kasih untuk persetujuannya.',
      'Selanjutnya Prixa akan menanyakan informasi terkait status kesehatan dan kebiasaan Anda.',
    ],
    options: [{ text: 'Lanjut', link: '/diagnose-target', variant: 'primary', type: 'button' }],
  };

  return <Conversation title={question.title} options={question.options}></Conversation>;
};

const ConsentRejectConfirmation: React.FC = () => {
  const question: QuestionProps = {
    title: [
      'Prixa memerlukan persetujuan Anda untuk dapat memberikan hasil prediksi berdasarkan keluhan yang Anda berikan.',
    ],
    options: [
      { text: 'Setuju', link: '/conversation', variant: 'secondary', type: 'button' },
      { text: 'Tidak Setuju', link: '/consent-reject', variant: 'secondary', type: 'button' },
    ],
  };

  return <Conversation title={question.title} options={question.options}></Conversation>;
};

const ConsentReject: React.FC = () => {
  const question: QuestionProps = {
    imgSrc: consentNo,
    title: ['Mohon maaf, Prixa tidak dapat melanjutkan pemeriksaan tanpa persetujuan Anda.'],
    options: [{ text: 'Ulangi', link: '/', variant: 'primary', type: 'button' }],
  };

  return <Conversation imgSrc={question.imgSrc} title={question.title} options={question.options}></Conversation>;
};

export { Consent, ConsentAccept, ConsentRejectConfirmation, ConsentReject };
