import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button, Card, Bottomsheet } from 'prixa-design-kit/dist';
import { UseTracking } from '../../../utils/useTracking';
import { currentState } from '../../../api/api-utils';
import ResultRating from './ResultRating';
import EmailSideSheet from '../EmailSideSheet';

const DisclaimerSection = (props: any) => {
  const { user, profiles, symptoms, userDetails, sessionId } = props;
  const [modalEmail, setModalEmail] = React.useState(false);
  const [title, setTitle] = React.useState('Kirim Hasil Prixa');
  const [key, setKey] = React.useState(0);

  const isFirstOpenEmail = React.useRef(true);
  const history = useHistory();

  React.useEffect(() => {
    if (isFirstOpenEmail.current) {
      isFirstOpenEmail.current = false;
      return;
    }

    if (!modalEmail) {
      setTitle('Kirim Hasil Prixa');
    }
  }, [modalEmail]);

  const viewSummary = () => {
    history.push({
      pathname: `/summary`,
      state: {
        user,
        profiles,
        symptoms,
        userDetails,
      },
    });
  };

  useEffect(() => {
    if (!modalEmail) {
      setTimeout(() => {
        setKey(key => key + 1);
      }, 300);
    }
  }, [modalEmail]);

  return (
    <React.Fragment>
      <Card className="prixa-result-content text-center padding-base margin-largeX">
        <Text style={{ color: 'var(--primary)', paddingTop: '16px' }}>
          <b>Perlu diingat, Hasil Prixa ini bukan pengganti diagnosis medis dokter ya. </b>
        </Text>
        <Text className="margin-baseB" style={{ color: 'var(--primary)' }}>
          Segera konsultasi dengan dokter jika keluhan memburuk atau terdapat keluhan lain yang Anda rasakan.
        </Text>
        <span
          onClick={() => {
            UseTracking({ event: `Summary complaint clicked`, properties: { sessionId, state: currentState } });
            viewSummary();
          }}
        >
          <Button
            style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
            size="large"
            variant="outline"
            className="dav-special margin-smallB"
            width="220px"
          >
            Lihat Rangkuman Keluhan
          </Button>
        </span>
        {/* <span
          onClick={() => {
            UseTracking({ event: `Send to email clicked`, properties: { sessionId, state: currentState } });
            setModalEmail(true);
          }}
        >
          <Button
            style={{ color: 'var(--primary)', borderColor: 'var(--primary)', marginBottom: '24px' }}
            size="large"
            className="dav-special"
            variant="outline"
            width="220px"
          >
            Kirim Hasil Prixa ke Email
          </Button>
        </span> */}
      </Card>
      <br />
      <ResultRating sessionId={sessionId} />
      <Bottomsheet
        key={key}
        setShow={setModalEmail}
        show={modalEmail}
        title={title}
        content={<EmailSideSheet sessionId={sessionId} setTitle={setTitle}></EmailSideSheet>}
      />
    </React.Fragment>
  );
};

export default DisclaimerSection;
