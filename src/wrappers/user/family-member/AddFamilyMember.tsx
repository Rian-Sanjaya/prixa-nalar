import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button, Toast, Dropdown, DropdownItem } from 'prixa-design-kit/dist';
import { useInput } from '../../../utils/useInput';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { USER_API } from '../../../api/api-url';
import { postAPI } from '../../../api/api-method';
import { calcAge } from './helpers';
import { useInputDOB } from '../../../utils/useInputDOB';
import { FamilyMemberContext } from './FamilyMemberContext';
import './familyMember.scss';

const jKel = [
  {
    text: 'Laki-laki',
    value: 'Laki-laki',
  },
  {
    text: 'Perempuan',
    value: 'Perempuan',
  },
];

const AddFamilyMember = () => {
  const [firstEdit, setFirstEdit] = useState(true); /* for using existing useInput type: namaDataDiri */
  const [errNama, setErrNama] = useState(false);
  const [isErrMsg, setErrMsg] = useState('');
  const [DOB, setDOB] = useState('');
  const [errFullDate, setErrFullDate] = useState(false);
  const [kelValue, setKelValue] = useState<string>('');
  const [kelText, setKelText] = useState<string | undefined>('');
  const [errJenisKelamin, setErrJenisKelamin] = useState(false);
  const [validatJKel, setValidateJKel] = useState(false);
  const [firstEditJKel, setFirstEditJKel] = useState(true);

  const { setHeader, setMenu } = useContext(HeaderContext);
  const history = useHistory();
  const editMode = true; /* for using existing useInput type: namaDataDiri */

  const name = useInput({
    label: 'Nama',
    type: 'namaDataDiri',
    placeholder: 'Nama Lengkap',
    editMode,
    firstEdit,
    setFirstEdit,
  });

  const dateOfBirth = useInputDOB({
    label: 'Tanggal Lahir',
  });

  useEffect(() => {
    const isDateOfBirthValid = dateOfBirth.isValid && dateOfBirth.fullDate.length === 10;
    isDateOfBirthValid ? setErrFullDate(false) : setErrFullDate(true);
  }, [dateOfBirth]);

  /* eslint-disable */
  useEffect(() => {
    setHeader('Tambah Keluarga');
    setMenu(false);

    return () => {
      setHeader('');
    }
  }, []);
  /* eslint-enable */

  useEffect(() => {
    const isNameValid = name.value && !name.error;
    isNameValid ? setErrNama(false) : setErrNama(true);
  }, [name]);

  useEffect(() => {
    if (firstEditJKel === false) {
      const isJenisKelaminValid = kelValue;
      if (isJenisKelaminValid) {
        setErrJenisKelamin(false);
        setValidateJKel(true);
      } else {
        setErrJenisKelamin(true);
        setValidateJKel(false);
      }
    } else {
      setErrJenisKelamin(false);
      setValidateJKel(false);
    }
  }, [kelValue, firstEditJKel]);

  const isDisabled = errNama || errFullDate || errJenisKelamin || firstEditJKel;

  const handleJKelSelect = useCallback((jKel: DropdownItem) => {
    setKelValue(jKel.value);
    setKelText(jKel.text);
    setFirstEditJKel(false);
  }, []);

  const handleAddFamily = (): void => {
    const data = {
      name: name.value,
      birthdate: DOB,
      gender: kelValue === 'Laki-laki' ? 'm' : kelValue === 'Perempuan' ? 'f' : '',
    };

    postAPI(USER_API.ADD_FAMILY_MEMBER, data)
      .then((res: any) => {
        const yr = res.data.patient_dob.substr(0, 4);
        const mt = res.data.patient_dob.substr(5, 2);
        const dt = res.data.patient_dob.substr(8, 2);
        const brthDt = new Date(`${yr}/${mt}/${dt}`);
        const cAge = calcAge(brthDt);

        history.push({
          pathname: '/add-family-health-info',
          state: {
            patientId: res.data.id,
            patientAge: cAge,
            patientGender: res.data.patient_gender,
            patientName: `${res.data.patient_f_name} ${res.data.patient_l_name}`,
          },
        });
      })
      .catch(err => {
        setErrMsg(
          err.response &&
            err.response.data.details &&
            err.response.data.details[0] &&
            err.response.data.details[0].metadata
            ? err.response.data.details[0].metadata.errInd
            : 'Gangguan sistem, mohon coba kembali.',
        );
      });
  };

  return (
    <>
      <div className="prixa-container is-bottom">
        <div className="margin-baseB" style={{ width: '240px' }}>
          <Text scale="question">Mohon lengkapi informasi berikut:</Text>
        </div>
        <FamilyMemberContext.Provider value={{ setDOB, dateOfBirth }}>
          <InputFamilyData
            name={name}
            errJenisKelamin={errJenisKelamin}
            firstEditJKel={firstEditJKel}
            handleJKelSelect={handleJKelSelect}
            kelText={kelText}
            validatJKel={validatJKel}
          />
        </FamilyMemberContext.Provider>
        <div className="margin-largeT margin-xLargeB" style={{ textAlign: 'right' }}>
          <Button data-cy="next-to-step2" size="xLarge" disabled={isDisabled} onClick={(): void => handleAddFamily()}>
            Lanjut
          </Button>
        </div>
      </div>
      <Toast timeout={3000} message={isErrMsg} variant="danger" show={isErrMsg !== ''}></Toast>
    </>
  );
};

const InputFamilyData = (props: any): JSX.Element => {
  const { setDOB, dateOfBirth } = useContext(FamilyMemberContext);

  useEffect(() => {
    setDOB(dateOfBirth.fullDate);
  }, [dateOfBirth.fullDate, setDOB]);

  return (
    <>
      <div className="margin-baseB" data-cy="family-name-input">
        {props.name.input}
      </div>
      <div className="row margin-tinyB margin-baseB" data-cy="family-dob-input">
        {dateOfBirth.input}
      </div>
      {/* <div>{gender.dropDn}</div> */}
      <div className="margin-baseB">
        <div style={{ display: 'flex', marginBottom: 10 }}>
          <label
            style={{
              flex: 1,
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '24px',
              color: 'var(--dark)',
            }}
          >
            Jenis Kelamin
          </label>
          {props.errJenisKelamin && !props.firstEditJKel && (
            <label style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--alert-50)', paddingTop: 4 }}>
              Data tidak valid
            </label>
          )}
        </div>
        <Dropdown
          data-cy="family-gender-input"
          options={jKel}
          placeholder="Laki-laki"
          onSelect={props.handleJKelSelect}
          value={props.kelText}
          error={props.errJenisKelamin && !props.firstEditJKel}
          validate={props.validatJKel && !props.firstEditJKel}
          styleInput={{ fontSize: 16, height: 6 }}
          styleItems={{ fontSize: 16, top: 36 }}
          styleIcon={{ top: 10, width: '0.7em' }}
        />
      </div>
    </>
  );
};

export default AddFamilyMember;
