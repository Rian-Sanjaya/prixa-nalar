import React from 'react';
import Conversation from '../../components/conversation/Conversation';
import { ConversationProps } from '../../components/conversation/ConversationInterface';

const prescriptionNotFound = `${process.env.REACT_APP_ASSET_URL}/remedi/Prescription%20Not%20Found.png`;

export const PrescriptionNotFoundNotice: React.FC = () => {
  const question: ConversationProps = {
    imgSrc: prescriptionNotFound,
    title: ['Prixa memerlukan resep obat Anda untuk proses pesan antar farmasi.'],
    subtitle:
      'Konsultasi dengan dokter via chat untuk mendapatkan resep obat sesuai rekomendasi dokter, jika dibutuhkan.',
    options: [
      { text: 'Kembali ke Beranda', link: '/', variant: 'secondary', type: 'button', size: 'full' },
      { text: 'Konsultasi via Chat', link: '/preconsultation', variant: 'primary', type: 'button', size: 'full' },
    ],
  };

  return (
    <Conversation
      imgSrc={question.imgSrc}
      title={question.title}
      subtitle={question.subtitle}
      options={question.options}
    ></Conversation>
  );
};
