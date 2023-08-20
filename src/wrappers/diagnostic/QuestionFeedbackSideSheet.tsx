import React, { useEffect } from 'react';
import { Text, Paragraph, Button, Checkbox } from 'prixa-design-kit/dist';
import TextArea from '../../components/textarea/TextArea';
import { postAPI } from '../../api/api-method';
import { DIAGNOSTIC_API } from '../../api/api-url';
import { firstLetterToUpperCase } from '../../utils/stringFunction';
import { getPartnerID, getAppID } from '../../utils/constant';

export interface QuestionFeedback {
  question: string | Array<string>;
  instruction: string;
  choices: Array<string>;
  sessionId: string;
  title: Array<string>;
  symptomID: string;
  setModal: any;
  setToast: any;
  setToastVariant: any;
}

interface FeedbackProps {
  userId: string;
  partnerId: string;
  applicationId: string;
  sessionId: string;
  symptomId: string;
  question: string;
  feedbacks: any;
  detail: string;
}

const QuestionFeedbackSideSheet = (props: QuestionFeedback) => {
  const [detail, setDetail] = React.useState('');
  const [choices, setChoices] = React.useState<Array<string>>([]);
  const [isValid, setValid] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  useEffect(() => {
    choices.length !== 0 && detail.trim().length === 0
      ? setValid(true)
      : detail.trim().length > 4 && choices.length !== 0
      ? setValid(true)
      : setValid(false);
  }, [choices, detail]);

  const sendFeedback = () => {
    setSent(true);

    const data: FeedbackProps = {
      userId: '',
      partnerId: getPartnerID,
      applicationId: getAppID,
      sessionId: props.sessionId,
      symptomId: props.symptomID,
      question: props.title.join(''),
      feedbacks: choices,
      detail: detail,
    };
    postAPI(DIAGNOSTIC_API.FEEDBACK, data)
      .then(async (res: any) => {
        props.setToastVariant('success');
        props.setToast('Feedback Anda berhasil terkirim.');
        setTimeout(() => {
          props.setToast('');
        }, 3000);
        setSent(false);
        props.setModal(false);
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      })
      .catch(err => {
        props.setToastVariant('error');
        props.setToast(
          firstLetterToUpperCase(
            err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
              ? err.response.data.details[0].metadata.errInd
              : 'Gangguan sistem, mohon coba kembali.',
          ),
        );
        setTimeout(() => {
          props.setToast('');
        }, 3000);
        setSent(false);
      });
  };

  const checkedOption = (choice: string) => {
    if (!choices) {
      setChoices([choice]);
    } else if (!choices.includes(choice)) {
      setChoices(choices.concat(choice));
    } else {
      const choiceFilter = choices.filter((choiceFilter: string) => choiceFilter !== choice);
      setChoices(choiceFilter);
    }
  };

  return (
    <React.Fragment>
      <div className="prixa-container is-top padding-largeX">
        <div className="prixa-question-section margin-baseB margin-xLargeR">
          <Text scale="heroTitle">{props.question}</Text>
        </div>
        <div className="margin-baseB">
          <Paragraph scale="caption">{props.instruction}</Paragraph>
        </div>
        {props.choices.map((choice, i) => {
          return <Checkbox key={i} label={choice} value={choice} onChange={() => checkedOption(choice)}></Checkbox>;
        })}
        <div className="margin-largeY">
          <TextArea setData={setDetail} placeholder="Silahkan tulis feedback Anda"></TextArea>
        </div>
      </div>
      <div className="prixa-right-button padding-largeX">
        <Button
          className="margin-largeB"
          onClick={() => sendFeedback()}
          size="option"
          variant="primary"
          disabled={!isValid}
          spinner={sent}
        >
          Kirim
        </Button>
      </div>
    </React.Fragment>
  );
};

export default QuestionFeedbackSideSheet;
