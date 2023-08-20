import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Paragraph, Text, Button, Textarea, Icon, Checkbox, Toast, Card } from 'prixa-design-kit/dist';
import { getAPI, postAPI } from '../../api/api-method';
import { USER_API } from '../../api/api-url';
import { LoadPage } from '../../wrappers/diagnostic/LoadPage';
import { HeaderContext } from '../../components/header/HeaderContext';

const ratingOpt = [
  { label: 'tidak baik', rate: 1 },
  { label: 'kurang baik', rate: 2 },
  { label: 'biasa', rate: 3 },
  { label: 'baik', rate: 4 },
  { label: 'sangat baik', rate: 5 },
];

interface ChoiceType {
  feedback_name: string;
  feedback_desc: string;
  id: string;
}

const docImg = 'https://storage.googleapis.com/prixa-diagnostic-web-assets/v2/telemed/Cari%20Dokter.png';

export const AllSpecialitySideSheet = (): JSX.Element => {
  const [error, setError] = useState('');
  const [load, setLoading] = useState('');
  const [lainnyaSelected, setSelected] = useState(false);
  const [choices, setChoices] = React.useState<Array<string>>([]);
  const [options, setOptions] = useState<Array<ChoiceType>>([]);
  const [rating, setRating] = useState({ label: '', rate: 0 });
  const [reason, setReason] = useState('');
  const { setHeader } = useContext(HeaderContext);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const startTimer = React.useCallback((): void => {
    timeoutRef.current = setTimeout(() => {
      window.location.href = '/';
    }, 60000);
  }, []);

  const history = useHistory();

  useEffect(() => {
    setHeader('Ulasan Dokter');
  }, [setHeader]);

  const chatData = JSON.parse(String(localStorage.getItem('surveyData')));

  const isValid = (rating: number): boolean => {
    if (rating > 3 && lainnyaSelected) {
      return !!reason.length;
    } else if (rating > 3) {
      return !!choices.length;
    } else {
      return !!reason.length;
    }
  };

  const submit = (): void => {
    setLoading('loadSent');
    postAPI(USER_API.SEND_FEEDBACKS, {
      /*eslint-disable */
      trx_id: chatData?.trxId,
      rating_score: rating.rate,
      rating_notes: reason,
      feedbacks: choices,
      /*eslint-enable */
    })
      .then(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current);
        history.push({
          pathname: '/feedback-sent',
        });
      })
      .catch((err): void => {
        setError(
          err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
            ? err.response.data.details[0].metadata.errInd
            : 'Gangguan sistem, mohon coba kembali.',
        );
        timeoutRef.current && clearTimeout(timeoutRef.current);
        setTimeout(() => {
          setError('');
        }, 3000);
        startTimer();
        setLoading('');
      });
  };

  useEffect(() => {
    /* eslint-disable */
    setLoading('loadOpt');
    getAPI(USER_API.RATING_FEEDBACKS)
      .then((res: any) => {
        const tempOpt = res.data.filter((val: any) => {
          return val.feedback_category === 'positive' && val.feedback_desc !== 'Lainnya';
        });
        const lainnya = res.data.filter((val: any) => {
          return val.feedback_category === 'positive' && val.feedback_desc === 'Lainnya';
        });
        setOptions(tempOpt.concat(lainnya));
        setLoading('');
        startTimer()
      })
      .catch((): void => {
        setLoading('');
      });
    /* eslint-enable */
  }, [startTimer]);

  useEffect(() => {
    setSelected(false);
    setChoices([]);
    setReason('');
  }, [rating]);

  const checkedOption = (choice: ChoiceType): void => {
    if (choice.feedback_desc === 'Lainnya') {
      setSelected(!lainnyaSelected);
    }

    if (!choices) {
      setChoices([choice.id]);
    } else if (!choices.includes(choice.id)) {
      setChoices(choices.concat(choice.id));
    } else {
      const choiceFilter = choices.filter((choiceFilter: string) => choiceFilter !== choice.id);
      setChoices(choiceFilter);
    }
  };

  return (
    <React.Fragment>
      {load === 'loadOpt' ? (
        <LoadPage />
      ) : (
        <React.Fragment>
          <div className="prixa-container is-top is-full-height padding-largeB">
            <Card
              style={{
                textAlign: 'left',
                display: 'inline-flex',
                width: 'calc(100% - 32px)',
              }}
              className="margin-baseB"
            >
              <img
                loading="lazy"
                alt={`Survey Doctor ${chatData.doctorName}`}
                src={chatData.doctorPhoto || docImg}
                width="64px"
                height="64px"
                style={{ borderRadius: '50%' }}
              />
              <div className="margin-smallL text-ellipsis">
                <Text className="prixa-question-section" style={{ textTransform: 'capitalize' }} scale="headerTitle">
                  {chatData.doctorName}
                </Text>
                <br />
                <Text scale="content">
                  <b>{chatData.speciality}</b>
                </Text>
                <br />
                <Text scale="content">{chatData.hospitalName}</Text>
              </div>
            </Card>
            <div className="prixa-question-section margin-baseB">
              <Paragraph scale="heroTitle">
                Bagaimana pengalaman
                <br /> konsultasi Anda?{' '}
              </Paragraph>
            </div>
            <div
              className="margin-baseB"
              style={{
                textAlign: 'center',
                display: 'inline-flex',
                width: '100%',
                placeContent: 'center',
              }}
            >
              {ratingOpt.map(content => {
                return (
                  <Icon
                    onClick={(): void => {
                      setRating(content);
                    }}
                    key={content.rate}
                    color={content.rate <= rating.rate ? 'primary' : 'disabled'}
                    type="star"
                    width="50px"
                    style={{ height: '30px' }}
                  />
                );
              })}
            </div>

            {!!rating.rate && (
              <div>
                <Paragraph
                  className="prixa-question-section margin-baseB text-center"
                  style={{ textTransform: 'capitalize' }}
                  scale="headerTitle"
                >
                  {rating.label}
                </Paragraph>
                <Paragraph className="prixa-question-section margin-baseB" scale="content">
                  Apa yang membuat pengalaman konsultasi Anda berkesan {rating.label}?
                </Paragraph>
              </div>
            )}
            <div className="margin-baseB">
              {rating.rate > 3 &&
                options.map((choice: ChoiceType) => {
                  return (
                    <React.Fragment key={choice.id}>
                      <Checkbox
                        label={choice.feedback_name}
                        value={choice.id}
                        onChange={(): void => checkedOption(choice)}
                      ></Checkbox>
                      <hr
                        style={{
                          border: '0.5px var(--dark-20) solid',
                          margin: '18px 0',
                        }}
                      />
                    </React.Fragment>
                  );
                })}
            </div>

            {(lainnyaSelected || rating.rate < 4) && !!rating.rate && (
              <div className="margin-largeY">
                <Textarea value={reason} setData={setReason} rows="5" placeholder="Silahkan tulis feedback Anda" />
              </div>
            )}

            <div className="padding-largeB padding-tinyT"></div>
          </div>
          <Toast timeout={3000} message={error} variant="danger" show={error !== ''}></Toast>
          <div className="prixa-footer-button">
            <Button
              size="full"
              variant="primary"
              onClick={(): void => submit()}
              disabled={!isValid(rating.rate) || load === 'loadSent'}
              spinner={load === 'loadSent'}
            >
              Kirim Ulasan
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AllSpecialitySideSheet;
