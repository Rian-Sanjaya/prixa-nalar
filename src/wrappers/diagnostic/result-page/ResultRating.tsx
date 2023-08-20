import React, { useState } from 'react';
import { Text, Button, Icon, Card } from 'prixa-design-kit/dist';
import { postAPI } from '../../../api/api-method';
import { DIAGNOSTIC_API } from '../../../api/api-url';
import { getPartnerID, getAppID } from '../../../utils/constant';

const ResultRating = (sessionId: any) => {
  const [rating, setRating] = useState({ label: '', rate: 0 });
  const [isActive, setActive] = useState(true);
  const [cursorActive, setCursor] = useState('active');
  const [isConfirm, setConfirm] = useState(false);

  const ratingOpt = [
    { label: 'Tidak Terbantu', rate: 1 },
    { label: 'Kurang Terbantu', rate: 2 },
    { label: 'Cukup Terbantu', rate: 3 },
    { label: 'Terbantu', rate: 4 },
    { label: 'Sangat Terbantu', rate: 5 },
  ];

  const submitRating = () => {
    const surveyData = {
      partnerId: getPartnerID,
      applicationId: getAppID,
      feedback: '',
      userId: '',
      sessionId: sessionId.sessionId,
      rating: rating.rate,
    };
    postAPI(DIAGNOSTIC_API.SEND_SURVEY, surveyData).then(async (res: any) => {
      setActive(false);
      setCursor('');
      setConfirm(false);
    });
  };

  const confirmRating = (rate: any) => {
    setConfirm(true);
    setRating(rate);
    setActive(false);
    setCursor('');
  };

  const cancelRating = () => {
    setConfirm(false);
    setActive(true);
    setCursor('active');
    setRating({ label: '', rate: 0 });
  };

  const finishRating = !isConfirm && !isActive && (
    <div>
      <div className="padding-baseB">
        <Text scale="question" style={{ lineHeight: '30px' }}>
          Terima kasih untuk <br />
          jawaban Anda.
        </Text>
      </div>
      <div className="padding-baseB">
        <Text scale="content" data-cy="survey-rating-finish-desc">
          Saran Anda akan membantu Prixa untuk dapat memberi layanan yang lebih baik lagi.
        </Text>
      </div>
    </div>
  );

  const ratingSection = !isConfirm && isActive && (
    <div>
      <div className="padding-microB">
        <Text scale="feedbackLink2" data-cy="survey-title">
          Survey Layanan
        </Text>
      </div>
      <div className="padding-baseB">
        <Text scale="question" style={{ lineHeight: '30px' }}>
          Seberapa terbantu <br />
          Anda dengan <br />
          Hasil Prixa ini?
        </Text>
      </div>
    </div>
  );

  const ratingStar = ratingOpt.map(content => {
    return (
      <Icon
        onClick={(): void => {
          if (isActive) confirmRating(content);
        }}
        className={`prixa-rating ${cursorActive} rating-start-${content.rate}`}
        key={content.rate}
        color={content.rate <= rating.rate ? 'primary' : 'disabled'}
        type="star"
        width="50px"
      />
    );
  });

  const ratingDescription = rating.rate !== 0 && (
    <div className="prixa-rating-desc">
      <Text scale="headerTitle" data-cy="survey-rating-star-label">
        {rating.label}
      </Text>
    </div>
  );

  const ratingCue = !isConfirm && !rating.rate && (
    <div className="prixa-rating-cue">
      <span>Tidak Terbantu</span>
      <span>Sangat Terbantu</span>
    </div>
  );

  const ratingConfirmation = isConfirm && (
    <div className="text-center margin-tinyT">
      <Text scale="content">Kirim rating ini?</Text>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <Button
          data-cy="rating-not-send-button"
          className="margin-smallR"
          variant="outline"
          size="large"
          onClick={() => cancelRating()}
        >
          Tidak
        </Button>
        <Button data-cy="rating-send-button" size="large" onClick={() => submitRating()}>
          Iya
        </Button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <Card
        style={{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        className="margin-largeX margin-largeB"
      >
        {finishRating}
        {ratingSection}
        <div
          className="margin-baseB"
          style={{
            textAlign: 'center',
            display: 'inline-flex',
            width: '100%',
            placeContent: 'center',
          }}
        >
          {ratingStar}
        </div>
        {ratingDescription}
        {ratingCue}
        {ratingConfirmation}
      </Card>
    </React.Fragment>
  );
};

export default ResultRating;
