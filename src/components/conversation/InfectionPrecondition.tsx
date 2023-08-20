import React, { useState } from 'react';
import { FormLabel, Paragraph, Button, Link, Bottomsheet } from 'prixa-design-kit/dist';
import { RadioNormal } from '../radionormal/RadioNormal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { ListCitiesSideSheet } from './ListCitiesSideSheet';
import { Option } from './ConversationInterface';

export interface InfectionPreconditionProps {
  callFunction: (reply?: object) => void;
  title: Array<string>;
  loading?: boolean;
  options: Option[];
  setConvoState: (params: { state: string }) => void;
}

export const InfectionPrecondition = (props: InfectionPreconditionProps) => {
  const [showDaftarKota, setShowDaftarKota] = useState<boolean>(false);
  const [contactHistory, setContactHistory] = useState<string | null>(null);
  const [localTransmission, setLocalTransmission] = useState<string | null>(null);

  const titles = props.title[0].split('\\n');

  const submit = (event: any) => {
    event.preventDefault();

    props.setConvoState({ state: 'skipAfteraskCovid19Tracing' });
    props.callFunction({
      type: 'button',
      value: `${contactHistory},${localTransmission}`,
    });
  };

  return (
    <div className="prixa-container">
      <form onSubmit={submit}>
        <div className="prixa-title">
          <Paragraph scale="question">{titles[0]}</Paragraph>
          <div className="row margin-baseB">
            <FormLabel small>{titles[1]}</FormLabel>
            <RadioNormal
              name="contactHistory"
              text={props.options[0].text}
              value={props.options[0].reply?.value}
              onChange={() => setContactHistory('yes')}
              selected={contactHistory === 'yes'}
            />
            <RadioNormal
              name="contactHistory"
              text={props.options[1].text}
              value={props.options[1].reply?.value}
              onChange={() => setContactHistory('no')}
              selected={contactHistory === 'no'}
            />
            <RadioNormal
              name="contactHistory"
              text={props.options[2].text}
              value={props.options[2].reply?.value}
              onChange={() => setContactHistory('unknown')}
              selected={contactHistory === 'unknown'}
            />
          </div>
          <div className="row margin-baseB">
            <FormLabel small>{titles[2]}</FormLabel>
            <RadioNormal
              name="localTransmission"
              text={props.options[3].text}
              value={props.options[3].reply?.value}
              onChange={() => setLocalTransmission('yes')}
              selected={localTransmission === 'yes'}
            />
            <RadioNormal
              name="localTransmission"
              text={props.options[4].text}
              value={props.options[4].reply?.value}
              onChange={() => setLocalTransmission('no')}
              selected={localTransmission === 'no'}
            />
          </div>
        </div>
        <span
          onClick={() => {
            setShowDaftarKota(true);
          }}
          data-cy="link-details-localtransmission-cities"
        >
          <Link scale="feedbackLink">
            LIHAT DAFTAR KOTA <FontAwesomeIcon icon={faArrowCircleRight} />
          </Link>
        </span>
        <Bottomsheet
          setShow={setShowDaftarKota}
          show={showDaftarKota}
          title="Kota Sebaran Virus Corona"
          content={<ListCitiesSideSheet />}
        ></Bottomsheet>
        <div className="prixa-right-button">
          <Button
            className="dav-special"
            type="submit"
            size="option"
            variant="primary"
            disabled={contactHistory === null || localTransmission === null ? true : false}
          >
            Lanjut
          </Button>
        </div>
      </form>
    </div>
  );
};
