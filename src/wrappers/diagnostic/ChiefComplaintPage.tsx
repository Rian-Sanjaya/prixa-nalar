import React from 'react';
import { Button, Text, Paragraph } from 'prixa-design-kit/dist';
import ListView from '../../components/listview/ListView';
import Conversation from '../../components/conversation/Conversation';
const complaintNone = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Assessment - Not Found.png`;
const questionsDone = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Assessment - Finish.png`;

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
  type: string;
  variant: 'default' | 'outline' | 'primary' | 'disabled' | 'secondary' | 'success' | undefined;
}

interface List {
  title: string;
  content: string;
  label?: any;
  buttonText: string;
}

export interface ConversationProps {
  search: string;
  title: Array<string>;
  loading?: boolean;
  options: Option[];
  callFunction?: (reply?: object) => void;
}

export interface NotFoundProps {
  options: any;
  callFunction: (reply?: object) => void;
}

export const ChiefComplaintResult: React.FC<ConversationProps> = (props: ConversationProps) => {
  return (
    <div className="prixa-container is-top is-full">
      <ListView
        value={props.search}
        callFunction={props.callFunction}
        title={props.title}
        loading={props.loading}
        options={props.options}
      ></ListView>
    </div>
  );
};

const ChiefComplaintNotFound: React.FC<NotFoundProps> = (props: NotFoundProps) => {
  const [isLoading, setLoading] = React.useState(false);

  return (
    <div className="prixa-container is-full is-to-bottom">
      <div className="padding-large padding-xlargeB">
        <div className="prixa-question-image">
          <img loading="lazy" width="240px" height="auto" alt="No Complaint" src={complaintNone} />
        </div>
        <div className="prixa-title" style={{ marginBottom: 0 }}>
          <Paragraph scale="question">Maaf, Prixa belum memiliki data keluhan yang Anda sampaikan.</Paragraph>
          <Text scale="caption">
            Basis data Prixa terus diperbaharui agar mencakup lebih banyak gejala dan kemungkinan penyakit. Lihat
            artikel kesehatan Prixa untuk mencari informasi yang relevan tengan kondisi Anda.
          </Text>
        </div>
      </div>
      <div className="prixa-button-full">
        <div className="full-width">
          <Button
            className="full-button"
            size="full"
            disabled={isLoading}
            spinner={isLoading}
            style={{
              borderRight: 'solid 0.25px white',
            }}
            variant="secondary"
            onClick={() => {
              props.callFunction(props.options);
              setLoading(true);
            }}
          >
            Ubah Keluhan
          </Button>
        </div>
        <a href="https://prixa.ai/artikel" target="_blank" rel="noopener noreferrer">
          <Button
            className="full-button"
            size="full"
            style={{
              borderLeft: 'solid 0.25px white',
            }}
            variant="primary"
          >
            Lihat Artikel
          </Button>
        </a>
      </div>
    </div>
  );
};

const ChiefComplaintDone: React.FC = () => {
  const question: QuestionProps = {
    imgSrc: questionsDone,
    title: ['Terima kasih jawabannya.', 'Berikut hasil analisis Prixa berdasarkan keluhan yang Anda sampaikan.'],
    options: [{ text: 'Lanjut', link: '/chief-complaint-disclaimer', variant: 'primary', type: 'button' }],
  };

  return <Conversation imgSrc={question.imgSrc} title={question.title} options={question.options}></Conversation>;
};

const ChiefComplaintDisclaimer: React.FC = () => {
  const question: QuestionProps = {
    title: [
      'Perlu diingat, hasil Prixa ini bukan pengganti diagnosis medis dokter ya.',
      'Konsultasikan keluhan Anda dengan dokter untuk pemeriksaan lebih lanjut.',
    ],
    options: [{ text: 'Lihat Hasil', link: '/result', variant: 'primary', type: 'button' }],
  };

  return <Conversation title={question.title} options={question.options}></Conversation>;
};

export { ChiefComplaintResult as default, ChiefComplaintNotFound, ChiefComplaintDone, ChiefComplaintDisclaimer };
