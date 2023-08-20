import React, { useEffect, useContext } from 'react';
import '../conversation/conversation.scss';
import { Link } from 'react-router-dom';
import { Button, Text, Paragraph, InputText, Toast, Icon, Bottomsheet } from 'prixa-design-kit/dist';
import { CSSTransition } from 'react-transition-group';
import InfoSideSheet from '../../wrappers/diagnostic/InfoSideSheet';
import TnCSideSheet from '../../wrappers/baymax/TnCSideSheet';
import QuestionFeedbackSideSheet, { QuestionFeedback } from '../../wrappers/diagnostic/QuestionFeedbackSideSheet';
import { getAPI } from '../../api/api-method';
import { DIAGNOSTIC_API, BAYMAX_API } from '../../api/api-url';
import { ConversationProps, Option } from './ConversationInterface';
import { HeaderContext } from '../../components/header/HeaderContext';
import { getPartnerAuthStorage } from '../../utils/constant';

const Conversation = (props: ConversationProps) => {
  const {
    header,
    information,
    title,
    subtitle,
    subtitleStyle,
    isSubtitleLong,
    imgSrc,
    options,
    callFunction,
    search,
    setSearchQuery,
    state,
    sessionId,
    symptomID,
  } = props;
  const [inProp, setInProp] = React.useState(true);
  const [informationModal, setInformationModal] = React.useState(false);
  const [feedback, setFeedback] = React.useState(false);
  const [errSearch, setErrSearchQuery] = React.useState(false);
  const [toast, setToast] = React.useState('');
  const [toastVariant, setToastVariant] = React.useState('success');
  const [feedbackQuestion, setFeedbackQuestion] = React.useState<QuestionFeedback | undefined>(undefined);
  const [key, setKey] = React.useState(0);
  const [tnc, setTnC] = React.useState(false);
  const [tncModal, setTncModal] = React.useState(false);

  const { setHeader } = useContext(HeaderContext);

  useEffect(() => {
    header ? setHeader(header) : setHeader('');
    return () => setHeader('');
  }, [setHeader, header]);

  useEffect(() => {
    setErrSearchQuery(!search || search === '');
  }, [search]);

  useEffect(() => {
    if (!feedback) {
      setTimeout(() => {
        setKey(key => key + 1);
      }, 300);
    }
  }, [feedback]);

  const submitChiefCompliant = (event: any) => {
    event.preventDefault();
    const data = {
      type: 'text',
      value: search,
      tag: search,
    };

    if (data.value && callFunction) {
      setInProp(false);
      callFunction(data).then((res: string) => {
        if (res !== 'showComplaint') setInProp(true);
      });
    }
  };

  const openFeedbackModal = () => {
    getAPI(DIAGNOSTIC_API.FEEDBACK).then(async (res: any) => {
      const feedbackProps = {
        sessionId: sessionId,
        title: title,
        symptomID: symptomID,
        setModal: setFeedback,
        setToast: setToast,
        setToastVariant: setToastVariant,
      };
      const feedbackData = { ...res, ...feedbackProps };
      setFeedbackQuestion(feedbackData);
      setFeedback(true);
    });
  };

  const openTnCModal = () => {
    getAPI(BAYMAX_API.CONSENT).then(async (res: any) => {
      setTnC(res.data);
      setTncModal(true);
    });
  };

  const prixaQuestionAnimation = {
    enter: 'animated',
    enterActive: 'fadeInUp super-fast',
    exit: 'animated',
    exitActive: 'fadeOutUp super-fast',
  };

  const prixaAnswerAnimation = {
    enter: 'animated',
    enterActive: 'fadeInRight super-fast',
    exit: 'animated',
    exitActive: 'fadeOutRight super-fast',
  };

  const prixaQuestionImage = imgSrc && (
    <div className="prixa-question-image">
      <img loading="lazy" width="240px" height="auto" alt="Prixa Conversation" src={imgSrc} />
    </div>
  );

  const prixaQuestionInformation = information && (
    <div onClick={() => setInformationModal(true)}>
      <Icon type="info" className="prixa-info-icon margin-baseB" />
    </div>
  );

  const prixaQuestionTitle = title.map((title, i) => {
    return (
      <Paragraph key={i} scale="question" data-cy="text-title-question">
        {title}
      </Paragraph>
    );
  });

  const prixaQuestionSubTitle = subtitle && (
    <Paragraph
      className={isSubtitleLong ? `prixa-title-long-sub` : `prixa-title-sub`}
      style={subtitleStyle}
      scale="caption"
      data-cy="text-subtitle-question"
    >
      {subtitle}
    </Paragraph>
  );

  const prixaQuestionFeedback = state === 'askSymptom' && (
    <div className="margin-tinyT" style={{ display: 'flex', alignItems: 'left' }}>
      <div onClick={() => openFeedbackModal()}>
        <Text
          scale="feedbackLink"
          data-cy="link-feedback"
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          BERI FEEDBACK
          <Icon type="arrow-circle-right" className="margin-tinyL" color="secondary" />
        </Text>
      </div>
    </div>
  );

  const prixaTnC = state === 'showTnC' && (
    <div className="margin-tinyT" style={{ display: 'flex', alignItems: 'left' }}>
      <div onClick={() => openTnCModal()}>
        <Text
          scale="feedbackLink"
          data-cy="link-feedback"
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          Syarat dan Ketentuan
          <Icon type="arrow-circle-right" className="margin-tinyL" color="secondary" />
        </Text>
      </div>
    </div>
  );

  const isAnswerLinkAvailable = options[0] && options[0].link && !options[0].size;
  const prixaAnswerLink =
    isAnswerLinkAvailable &&
    options.map((option: Option, i: number) => {
      return (
        <div className="prixa-right-button" key={i} data-cy={`button-option`}>
          <CSSTransition in={inProp} unmountOnExit timeout={500} classNames={prixaAnswerAnimation}>
            <Link to={option.link || '/'}>
              <Button size="option" className="dav-special" variant={option.variant} style={{ marginTop: '20px' }}>
                {option.text}
              </Button>
            </Link>
          </CSSTransition>
        </div>
      );
    });

  const isFullWidthButtonAvailable = options[0] && options[0].size === 'full';
  const prixaFullWidthButton = isFullWidthButtonAvailable && (
    <div className="prixa-button-full">
      {options.map((option: Option, i: number) => {
        return (
          <Link key={i} to={option.link || '/'}>
            <Button className="full-button" size="full" variant={option.variant}>
              {option.text}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  const isAnswerInputAvailable = options[0] && options[0].type === 'text';
  const prixaAnswerInput = isAnswerInputAvailable && (
    <CSSTransition in={inProp} unmountOnExit timeout={500} classNames={prixaAnswerAnimation}>
      <form onSubmit={event => submitChiefCompliant(event)}>
        <InputText
          icon
          type="text"
          placeholder={JSON.parse(JSON.stringify(options[0].text[0])).value}
          setData={setSearchQuery}
          onClick={submitChiefCompliant}
          disabledButton={errSearch}
          data-cy={`input-text-${JSON.parse(JSON.stringify(options[0].text[0])).value}`}
          className="prixa-input-ask-chief-complaint"
        />
      </form>
    </CSSTransition>
  );

  const isAnswerButtonAvailable = options[0] && !options[0].link && options[0].type === 'button';
  const prixaAnswerButton =
    isAnswerButtonAvailable &&
    options.map((option: Option, i: number) => {
      return getPartnerAuthStorage === '' ||
        getPartnerAuthStorage === null ||
        (getPartnerAuthStorage && option.text !== '+ Tambah Keluarga') ? (
        <div className="prixa-right-button" data-cy={`button-option`} key={i}>
          <CSSTransition in={inProp} unmountOnExit timeout={500} classNames={prixaAnswerAnimation}>
            <Button
              onClick={() => {
                if (state === 'askAssessmentSubject') localStorage.setItem('patientId', option.reply?.value);
                if (callFunction) {
                  setInProp(false);
                  callFunction(option.reply).then((res: string) => {
                    if (res !== 'askPrecondition') setInProp(true);
                  });
                } else return '';
              }}
              size="option"
              className="dav-special"
              variant={option.variant}
            >
              {option.text}
            </Button>
          </CSSTransition>
        </div>
      ) : null;
    });

  const bottomSheetInformation = (
    <Bottomsheet
      title="Penjelasan"
      show={informationModal}
      setShow={setInformationModal}
      content={<InfoSideSheet content={information} />}
    />
  );

  const bottomSheetFeedbackQuestion = feedbackQuestion && (
    <Bottomsheet
      key={key}
      title="Beri Feedback"
      show={feedback}
      setShow={setFeedback}
      content={<QuestionFeedbackSideSheet {...feedbackQuestion} />}
    />
  );

  const bottomSheetTnC = (
    <Bottomsheet
      title="Syarat Dan Ketentuan"
      show={tncModal}
      setShow={setTncModal}
      content={<TnCSideSheet content={tnc} />}
    />
  );

  return (
    <div className="prixa-container is-full is-to-bottom">
      <div className={isFullWidthButtonAvailable ? 'padding-largeX padding-largeT' : 'padding-large padding-xLargeB'}>
        <Toast timeout={3000} message={toast} variant={toastVariant} show={toast !== ''}></Toast>
        <CSSTransition in={inProp} unmountOnExit timeout={500} classNames={prixaQuestionAnimation}>
          <div className="prixa-body">
            {prixaQuestionImage}
            <div className="prixa-title">
              {prixaQuestionInformation}
              {prixaQuestionTitle}
              {prixaQuestionSubTitle}
              {prixaQuestionFeedback}
              {prixaTnC}
            </div>
          </div>
        </CSSTransition>
        <div>
          {prixaAnswerLink}
          {prixaAnswerInput}
          {prixaAnswerButton}
        </div>
        {bottomSheetInformation}
        {bottomSheetFeedbackQuestion}
        {bottomSheetTnC}
      </div>
      {prixaFullWidthButton}
    </div>
  );
};

export default Conversation;
