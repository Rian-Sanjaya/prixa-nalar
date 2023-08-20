import React, { useState } from 'react';
import { Button, Text, Paragraph, Icon, Bottomsheet } from 'prixa-design-kit/dist';
import StatusList from '../statuslist/StatusList';
import StatusSideSheet from '../../wrappers/diagnostic/StatusSideSheet';
import { PreconReply } from '../../components/conversation/ConversationInterface';

export interface PrecondProps {
  setConvoState: (params: { state: string }) => void;
  callFunction: (reply?: object) => void;
  title: Array<string>;
  loading?: boolean;
  list: Array<PreconReply>;
  preconditionData: any;
  setPreconditionData: any;
}

export const StatusPrecondition: React.FC<PrecondProps> = (props: PrecondProps) => {
  const [darahTinggi, setDarahTinggi] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [merokok, setMerokok] = useState(false);
  const [minumAlkohol, setMinumAlkohol] = useState(false);
  const [menopause, setMenopause] = useState(false);
  const [hamil, setHamil] = useState(false);
  const [kanker, setKanker] = useState(false);
  const [sakitJantung, setSakitJantung] = useState(false);
  const [gagalGinjal, setGagalGinjal] = useState(false);
  const [bottomSheet, setBottomSheet] = useState(false);

  const getAge = (DOB: string) => {
    const today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }
    return age;
  };

  const descriptivePrecondition = [];

  const isFemale = props.preconditionData.find((e: any) => {
    return e.name === 'Female';
  });

  const age = getAge(
    props.preconditionData.find((e: any) => {
      return e.type === 'age';
    }).ageYear,
  );

  const isCanDrinkAndSmoke = !(age < 17);
  const isCanMenopause = age > 35;
  const isCanPregnant = !(age < 17 || age > 65);

  const showPregnancy = isFemale && isCanPregnant && !menopause;
  const showMenopause = isFemale && isCanMenopause && !hamil;
  const showDrinkAndSmoke = isCanDrinkAndSmoke;

  for (let index = 0; index < props.list.length; index++) {
    if (props.list[index].preconditionsDescription) {
      descriptivePrecondition.push(props.list[index]);
    }
  }

  const statusListProps = {
    darahTinggi,
    diabetes,
    merokok,
    minumAlkohol,
    menopause,
    hamil,
    kanker,
    sakitJantung,
    gagalGinjal,
    setDarahTinggi,
    setDiabetes,
    setMerokok,
    setMinumAlkohol,
    setMenopause,
    setHamil,
    setKanker,
    setSakitJantung,
    setGagalGinjal,
    showPregnancy,
    showMenopause,
    showDrinkAndSmoke,
  };

  const secondSubmit = (event: any) => {
    event.preventDefault();
    const history: any = [];

    if (darahTinggi) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Hypertensive';
        }),
      );
    }

    if (diabetes) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Diabetic';
        }),
      );
    }

    if (merokok) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Smoker';
        }),
      );
    }

    if (minumAlkohol) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Alcohol drinker';
        }),
      );
    }

    if (hamil) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Pregnant';
        }),
      );
    } else {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Not Pregnant';
        }),
      );
    }

    if (menopause) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Menopause';
        }),
      );
    }

    if (kanker) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Cancer';
        }),
      );
    }

    if (gagalGinjal) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Chronic Kidney Failure';
        }),
      );
    }

    if (sakitJantung) {
      history.push(
        props.list.find((e: any) => {
          return e.name === 'Cardiovascular Disease';
        }),
      );
    }

    const concatenatedPreconditions = [...props.preconditionData, ...history];
    if (localStorage.getItem('loginToken')) {
      const removedIndex = concatenatedPreconditions
        .map(item => {
          return item.type;
        })
        .indexOf('gender');
      concatenatedPreconditions.splice(removedIndex, 1);
    }
    props.setConvoState({ state: '' });
    props.callFunction({
      type: 'Preconditions',
      preconditions: concatenatedPreconditions,
    });
  };

  return (
    <div className="prixa-container">
      <form
        onSubmit={event => {
          secondSubmit(event);
        }}
      >
        <div className="prixa-title" style={{ marginBottom: '20px' }}>
          <Paragraph scale="question">Mohon lengkapi informasi berikut:</Paragraph>
          <Paragraph scale="caption" className="prixa-title-long-sub" style={{ marginBottom: '22px' }}>
            Informasi ini akan membantu Prixa <br />
            menentukan pertanyaan yang relevan bagi Anda.
          </Paragraph>
          <StatusList statusListProps={statusListProps}></StatusList>
          <div className="margin-tinyT" style={{ display: 'flex', alignItems: 'left' }}>
            <div onClick={() => setBottomSheet(true)} data-cy="link-details-precondition">
              <Text scale="feedbackLink" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                LIHAT PENJELASAN
                <Icon type="arrow-circle-right" className="margin-tinyL" color="secondary" />
              </Text>
            </div>
          </div>
        </div>
        <div className="prixa-right-button">
          <Button type="submit" size="option" className="dav-special" variant="primary">
            Lanjut
          </Button>
        </div>
      </form>
      <Bottomsheet
        title="Status Kesehatan & Kebiasaan"
        show={bottomSheet}
        setShow={setBottomSheet}
        content={
          <StatusSideSheet
            isFemale={isFemale}
            isCanPregnant={isCanPregnant}
            isCanMenopause={isCanMenopause}
            isCanDrinkAndSmoke={isCanDrinkAndSmoke}
            data={descriptivePrecondition}
          ></StatusSideSheet>
        }
      />
    </div>
  );
};
