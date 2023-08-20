import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Paragraph, FormLabel, InputText, OptionsButton } from 'prixa-design-kit/dist';
import { PreconReply } from '../../components/conversation/ConversationInterface';
import { useDOBInput } from '../../utils/useDOBInput';
import { USER_API } from '../../api/api-url';
import { getAPI, patchAPI } from '../../api/api-method';
import { getGenderList } from '../../utils/constant';

export interface PrecondProps {
  setConvoState: (params: { state: string }) => void;
  callFunction: (reply?: object) => void;
  title: Array<string>;
  loading?: boolean;
  list: Array<PreconReply>;
  preconditionData: any;
  setPreconditionData: any;
}

const BasicPreconditionContext = createContext({} as any);

export const BasicPrecondition: React.FC<PrecondProps> = (props: PrecondProps) => {
  // eslint-disable-next-line
  const [patientName, setPatientName] = useState('');
  const [DOB, setDOB] = useState('');
  const [tempDOB, setTempDOB] = useState('');
  const [genderList, setGenderList] = useState<Array<object>>([]);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender]: any = useState({});
  const [tempGender, setTempGender] = useState({});
  const [errHeight, setErrHeight] = useState(false);
  const [errWeight, setErrWeight] = useState(false);
  const [errGender, setErrGender] = useState(true);
  const [isDisabled, setDisabled] = useState(true);
  const [isReady, setReady] = useState(false);

  const dateOfBirth = useDOBInput({
    label: 'Tanggal Lahir',
  });

  useEffect(() => {
    if (localStorage.getItem('loginToken')) {
      getAPI(USER_API.FAMILY_MEMBER_DETAIL(String(localStorage.getItem('patientId')))).then((res: any) => {
        setPatientName(`${res.data.patient_f_name} ${res.data.patient_l_name}`);
        setTempDOB(res.data.patient_dob ? res.data.patient_dob : '');
        const patientGender =
          res.data.patient_gender === 'm' ? getGenderList[0] : res.data.patient_gender === 'f' ? getGenderList[1] : {};
        setTempGender(patientGender);
        setDOB(tempDOB);
        setGender(patientGender);
        setReady(true);
      });
    } else setReady(true);
  }, [tempDOB]);

  const isFirstRunHeight = useRef(true);
  useEffect(() => {
    if (isFirstRunHeight.current) {
      isFirstRunHeight.current = false;
      return;
    }

    if (height > 0 && height < 300) {
      setErrHeight(false);
    } else {
      setErrHeight(true);
    }
  }, [height]);

  const isFirstRunWeight = useRef(true);
  useEffect(() => {
    if (isFirstRunWeight.current) {
      isFirstRunWeight.current = false;
      return;
    }

    if (weight > 0 && weight < 500) {
      setErrWeight(false);
    } else {
      setErrWeight(true);
    }
  }, [weight]);

  useEffect(() => {
    if (JSON.stringify(gender) === '{}') {
      setErrGender(true);
    } else {
      setErrGender(false);
    }
  }, [gender]);

  useEffect(() => {
    const tempData: Array<object> = [];
    for (let index = 0; index < props.list.length; index++) {
      if (props.list[index].type === 'gender') {
        tempData.push(props.list[index]);
      }
    }
    setGenderList(tempData.length !== 0 ? tempData : getGenderList);
  }, [props.list]);

  useEffect(() => {
    if (localStorage.getItem('patientId')) {
      const isHeightValid = !errHeight && height !== 0;
      const isWeightValid = !errWeight && weight !== 0;
      const isAllValid = isHeightValid && isWeightValid;
      isAllValid ? setDisabled(false) : setDisabled(true);
    } else {
      const isDateOfBirthValid = !dateOfBirth.errorYear && !dateOfBirth.errorDate && dateOfBirth.fullDate.length === 10;
      const isHeightValid = !errHeight && height !== 0;
      const isWeightValid = !errWeight && weight !== 0;
      const isGenderValid = !errGender && gender !== {};
      const isAllValid = isDateOfBirthValid && isHeightValid && isWeightValid && isGenderValid;
      isAllValid ? setDisabled(false) : setDisabled(true);
    }
  }, [dateOfBirth, errHeight, height, errWeight, weight, errGender, gender]);

  let temptPeconditionData: any;

  const firstSubmit = (event: any) => {
    event.preventDefault();
    temptPeconditionData = [
      {
        height: Number(height),
        weight: Number(weight),
        type: 'bmi',
      },
      {
        ageYear: DOB,
        type: 'age',
      },
    ];
    temptPeconditionData.push(gender);
    if (localStorage.getItem('loginToken')) {
      const data = {
        name: patientName,
        birthdate: DOB,
        gender: gender?.name === 'Male' ? 'm' : gender?.name === 'Female' ? 'f' : '',
      };

      patchAPI(USER_API.MODIFY_FAMILY_MEMBER(String(localStorage.getItem('patientId'))), data).then((res: any) => {
        props.setPreconditionData(temptPeconditionData);
        props.setConvoState({ state: 'askPrecondition1' });
      });
    } else {
      props.setPreconditionData(temptPeconditionData);
      props.setConvoState({ state: 'askPrecondition1' });
    }
  };

  return (
    <div className="prixa-container">
      {isReady ? (
        <form
          onSubmit={event => {
            firstSubmit(event);
          }}
        >
          <div className="prixa-title margin-tinyB">
            <Paragraph scale="question">Mohon lengkapi informasi berikut:</Paragraph>
            <Paragraph scale="caption" className="prixa-title-long-sub">
              Informasi ini akan membantu Prixa <br />
              menentukan pertanyaan yang relevan bagi Anda.
            </Paragraph>
          </div>
          {Object.keys(tempGender).length === 0 ? (
            <BasicPreconditionContext.Provider value={{ genderList, setGender, gender }}>
              <GenderSection />
            </BasicPreconditionContext.Provider>
          ) : (
            ''
          )}
          {tempDOB === '' ? (
            <BasicPreconditionContext.Provider value={{ setDOB, dateOfBirth }}>
              <AgeSection />
            </BasicPreconditionContext.Provider>
          ) : (
            ''
          )}
          <BasicPreconditionContext.Provider value={{ setHeight, errHeight, setWeight, errWeight }}>
            <WeightHeightSection />
          </BasicPreconditionContext.Provider>
          <div className="prixa-right-button">
            <Button
              type="submit"
              size="option"
              variant="primary"
              disabled={isDisabled}
              className="dav-special"
              data-cy="basic-precondition-lanjut-button"
            >
              Lanjut
            </Button>
          </div>
        </form>
      ) : (
        ''
      )}
    </div>
  );
};

const GenderSection = () => {
  const { genderList, setGender, gender } = useContext(BasicPreconditionContext);

  return (
    <div className="row">
      <FormLabel>Jenis Kelamin</FormLabel>
      <div className="flex-row margin-smallB">
        <OptionsButton data={genderList} setData={setGender} selected={gender} />
      </div>
    </div>
  );
};

const AgeSection = () => {
  const { setDOB, dateOfBirth } = useContext(BasicPreconditionContext);

  useEffect(() => {
    setDOB(dateOfBirth.fullDate);
  }, [dateOfBirth.fullDate, setDOB]);

  return <div className="row margin-tinyB margin-baseB">{dateOfBirth.input}</div>;
};

const WeightHeightSection = () => {
  const { setHeight, errHeight, setWeight, errWeight } = useContext(BasicPreconditionContext);

  return (
    <div className="row flex-inline margin-largeB">
      <div className="margin-baseR">
        <FormLabel>Tinggi (Cm)</FormLabel>
        <InputText
          type="number"
          max={300}
          setData={setHeight}
          placeholder="170"
          small
          errors={errHeight}
          data-cy="diagnostic-height-input"
        />
      </div>
      <div className="margin-baseR">
        <FormLabel>Berat (Kg)</FormLabel>
        <InputText
          type="number"
          max={500}
          setData={setWeight}
          placeholder="65"
          small
          errors={errWeight}
          data-cy="diagnostic-weight-input"
        />
      </div>
    </div>
  );
};
