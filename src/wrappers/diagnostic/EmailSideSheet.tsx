import React, { useEffect } from 'react';
import { Text, Paragraph, Button, Toast } from 'prixa-design-kit/dist';
import { postAPI } from '../../api/api-method';
import { DIAGNOSTIC_API } from '../../api/api-url';
import { UseTracking } from '../../utils/useTracking';
import { currentState } from '../../api/api-utils';
import { useInput } from '../../utils/useInput';

const imgSendEmail = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Assessment - Email.png`;

const pages = {
  SEND_EMAIL_PAGE: 'Send Email Page',
  SEND_EMAIL_SUCCESS_PAGE: 'Send Email Success Page',
};

const EmailSideSheet = (props: any) => {
  const [emailPage, setEmailPage] = React.useState(pages.SEND_EMAIL_PAGE);

  return (
    <div className="margin-largeB">
      {(() => {
        if (emailPage === pages.SEND_EMAIL_PAGE) {
          return <SendEmailPage sessionId={props.sessionId} setPage={setEmailPage}></SendEmailPage>;
        } else if (emailPage === pages.SEND_EMAIL_SUCCESS_PAGE) {
          return (
            <SendEmailSuccessPage
              setPage={setEmailPage}
              setTitle={props.setTitle}
              setIsSurveyDisplayed={props.setIsSurveyDisplayed}
              isSurveyDisplayed={props.isSurveyDisplayed}
            ></SendEmailSuccessPage>
          );
        }
      })()}
    </div>
  );
};

const SendEmailPage = (props: any) => {
  const [sent, setSent] = React.useState(false);
  const [isValid, setValid] = React.useState(false);
  const [isErrorMsg, setError] = React.useState('');

  /*eslint-disable */
  const name = useInput({
    label: 'Nama',
    type: 'namaSendEmail',
    placeholder: 'Nama panggilan Anda'
  });

  const email = useInput({
    label: 'Email',
    type: 'email',
    placeholder: 'nama@email.com'
  });
  /*eslint-enable */

  useEffect(() => {
    const isNameValid = name.value && !name.error;
    const isEmailValid = email.value && !email.error;
    const isAllValid = isNameValid && isEmailValid;
    isAllValid ? setValid(true) : setValid(false);
  }, [name, email]);

  const sendEmail = (event: any) => {
    setSent(true);
    event.preventDefault();

    postAPI(DIAGNOSTIC_API.SEND_EMAIL, {
      email: email.value,
      sessionId: props.sessionId,
      username: name.value,
    })
      .then(async (res: any) => {
        setSent(false);
        props.setPage(pages.SEND_EMAIL_SUCCESS_PAGE);
        UseTracking({ event: `Email sended`, properties: { sessionId: props.sessionId, state: currentState } });
      })
      .catch(err => {
        setError(
          err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
            ? err.response.data.details[0].metadata.errInd
            : 'Gangguan sistem, mohon coba kembali.',
        );
        UseTracking({ event: `Email failed sent`, properties: { sessionId: props.sessionId, state: currentState } });
        setTimeout(() => {
          setError('');
        }, 3000);
        setSent(false);
      });
  };

  return (
    <React.Fragment>
      <form
        className="prixa-container is-top padding-largeX"
        onSubmit={event => {
          sendEmail(event);
        }}
      >
        <div className="prixa-title">
          <Paragraph scale="heroTitle">Ke mana hasil pemeriksaan ini perlu dikirim?</Paragraph>
          <Paragraph scale="caption" className="prixa-title-sub">
            Data Anda tidak akan digunakan untuk keperluan lain
          </Paragraph>
        </div>
        <div className="margin-baseB" data-cy="send-result-name-input">
          {name.input}
        </div>
        <div className="margin-largeB" data-cy="send-result-email-input">
          {email.input}
        </div>
        <div className="prixa-right-button">
          <Button
            type="submit"
            size="option"
            variant="primary"
            disabled={!isValid || sent}
            spinner={sent}
            onClick={sendEmail}
            data-cy="send-result-button"
          >
            Kirim
          </Button>
        </div>
      </form>
      <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
    </React.Fragment>
  );
};

const SendEmailSuccessPage = (props: any) => {
  return (
    <div className="prixa-container padding-largeX">
      <div className="prixa-body">
        <div className="prixa-question-image">
          <img loading="lazy" width="240px" height="auto" alt="Prixa Feedback" src={imgSendEmail} />
        </div>
        <div className="prixa-title">
          <Paragraph scale="question">Hasil pemeriksaan telah dikirim ke email Anda.</Paragraph>
          <Text scale="content" className="prixa-title-sub">
            Terima kasih sudah menggunakan Prixa, semoga Anda sehat selalu!
          </Text>
        </div>
      </div>
    </div>
  );
};

export default EmailSideSheet;
