import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Paragraph, FormLabel, InputText, OptionsButton } from 'prixa-design-kit/dist';
import { PreconReply } from '../../components/conversation/ConversationInterface';
import { useDOBInput } from '../../utils/useDOBInput';
import { USER_API } from '../../api/api-url';
import { postAPI } from '../../api/api-method';
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

export const AddFamilyInformation: React.FC<PrecondProps> = (props: PrecondProps) => {
  const [name, setName] = useState('');
  const [DOB, setDOB] = useState('');
  const [gender, setGender]: any = useState({});
  const [errName, setErrName] = useState(false);
  const [errGender, setErrGender] = useState(true);
  const [isDisabled, setDisabled] = useState(true);

  const genderList = getGenderList;

  const dateOfBirth = useDOBInput({
    label: 'Tanggal Lahir',
  });

  const isFirstRunName = useRef(true);
  useEffect(() => {
    if (isFirstRunName.current) {
      isFirstRunName.current = false;
      return;
    }

    if (name.length > 0) {
      setErrName(false);
    } else {
      setErrName(true);
    }
  }, [name]);

  useEffect(() => {
    if (JSON.stringify(gender) === '{}') {
      setErrGender(true);
    } else {
      setErrGender(false);
    }
  }, [gender]);

  useEffect(() => {
    const isNameValid = !errName;
    const isDateOfBirthValid = !dateOfBirth.errorYear && !dateOfBirth.errorDate && dateOfBirth.fullDate.length === 10;
    const isGenderValid = !errGender && gender !== {};
    const isAllValid = isNameValid && isGenderValid && isDateOfBirthValid;
    isAllValid ? setDisabled(false) : setDisabled(true);
  }, [errName, errGender, gender, dateOfBirth]);

  let tempFamilyData: any;

  const firstSubmit = (event: any) => {
    event.preventDefault();
    tempFamilyData = {
      /* eslint-disable */
      birthdate: DOB,
      name: name,
      gender: gender.name === 'Female' ? 'f' : 'm',
      /* eslint-enable */
    };
    postAPI(USER_API.ADD_FAMILY_MEMBER, tempFamilyData).then((res: any) => {
      localStorage.setItem('patientId', res.data.id);
      props.setConvoState({ state: '' });
      props.callFunction({
        type: 'button',
        value: res.data.id,
      });
    });
  };

  return (
    <div className="prixa-container">
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
        <BasicPreconditionContext.Provider value={{ setName, errName }}>
          <NameSection />
        </BasicPreconditionContext.Provider>
        <BasicPreconditionContext.Provider value={{ genderList, setGender, gender }}>
          <GenderSection />
        </BasicPreconditionContext.Provider>
        <BasicPreconditionContext.Provider value={{ setDOB, dateOfBirth }}>
          <AgeSection />
        </BasicPreconditionContext.Provider>
        <div className="prixa-right-button">
          <Button type="submit" size="option" variant="primary" disabled={isDisabled} className="dav-special">
            Lanjut
          </Button>
        </div>
      </form>
    </div>
  );
};

const NameSection = () => {
  const { setName, errName } = useContext(BasicPreconditionContext);

  return (
    <div className="row">
      <FormLabel>Nama</FormLabel>
      <div className="flex-row margin-smallB">
        <InputText type="text" setData={setName} placeholder="Nama Lengkap" errors={errName} />
      </div>
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
