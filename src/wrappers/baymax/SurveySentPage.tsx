import React, { useEffect, useContext, useState } from 'react';
import Conversation from '../../components/conversation/Conversation';
import { ConversationProps } from '../../components/conversation/ConversationInterface';
import { HeaderContext } from '../../components/header/HeaderContext';
import { LoadPage } from '../diagnostic/LoadPage';
import { showPharmacyFeature, getSurveyData } from '../../utils/constant';
import { getAPI } from '../../api/api-method';
import { BAYMAX_API } from '../../api/api-url';

const surveyDoctor = `${process.env.REACT_APP_ASSET_URL}/remedi/Doctor%20Rating.png`;

export const SurveySentPage = () => {
  const { setHeader } = useContext(HeaderContext);
  const [isFeedbackSent, setFeedbackSent] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [buttonOptions, setButtonOptions]: any = useState({});

  useEffect(() => {
    if (!getSurveyData) window.location.href = '/';
    else {
      setHeader('Ulasan Dokter');
    }
  }, [setHeader]);

  useEffect(() => {
    setLoading(true);
    if (showPharmacyFeature()) {
      getAPI(`${BAYMAX_API.CONSUL_INFO}?trx_id=${getSurveyData.trxId}`)
        .then((data: any) => {
          const prescriptionId = data.data.prescription_id;
          setFeedbackSent(true);
          localStorage.removeItem('surveyData');
          if (prescriptionId) {
            setButtonOptions([
              { text: 'Kembali ke Beranda', link: '/', variant: 'secondary', type: 'button', size: 'full' },
              {
                text: 'Pesan Obat',
                link: `/pharmacy-delivery?prescriptionid=${prescriptionId}`,
                variant: 'primary',
                type: 'button',
                size: 'full',
              },
            ]);
            setLoading(false);
          } else {
            setButtonOptions([
              { text: 'Kembali ke Beranda', link: '/', variant: 'primary', type: 'button', size: 'full' },
            ]);
            setLoading(false);
          }
        })
        .catch((): any => {
          setFeedbackSent(true);
          setButtonOptions([
            { text: 'Kembali ke Beranda', link: '/', variant: 'primary', type: 'button', size: 'full' },
          ]);
          setLoading(false);
        });
    } else {
      setFeedbackSent(true);
      setButtonOptions([{ text: 'Kembali ke Beranda', link: '/', variant: 'primary', type: 'button', size: 'full' }]);
      setLoading(false);
    }
  }, []);

  const question: ConversationProps = {
    header: 'Ulasan Dokter',
    imgSrc: surveyDoctor,
    title: ['Terima kasih untuk jawaban Anda.'],
    subtitle: 'Ulasan Anda akan membantu Prixa untuk dapat memberi layanan yang lebih baik lagi.',
    subtitleStyle: { color: '#7f8184', fontSize: '14px', fontStyle: 'normal' },
    isSubtitleLong: true,
    options: buttonOptions,
  };

  if (isFeedbackSent && !isLoading) {
    return (
      <Conversation
        header={question.header}
        imgSrc={question.imgSrc}
        title={question.title}
        subtitle={question.subtitle}
        subtitleStyle={question.subtitleStyle}
        isSubtitleLong={question.isSubtitleLong}
        options={question.options}
      ></Conversation>
    );
  } else return <LoadPage />;
};
