import React from 'react';
import Conversation from '../../components/conversation/Conversation';
import { ConversationProps } from '../../components/conversation/ConversationInterface';

const operationalHoursNotice = `${process.env.REACT_APP_ASSET_URL}/remedi/Operational%20Hours%20Notice.png`;

export const OperationalHoursNotice: React.FC = () => {
  const question: ConversationProps = {
    imgSrc: operationalHoursNotice,
    title: ['Maaf, layanan pesan antar farmasi sedang tidak tersedia.'],
    subtitle:
      'Saat ini layanan pesan antar farmasi Prixa hanya tersedia pukul 08.00 hingga 20.30 WIB. Prixa terus berupaya untuk dapat menyediakan layanan penuh 24 jam.',
    options: [{ text: 'Kembali ke Beranda', link: '/', variant: 'primary', type: 'button', size: 'full' }],
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
