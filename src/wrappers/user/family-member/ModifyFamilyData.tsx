import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Dropdown, DropdownItem } from 'prixa-design-kit/dist';
import { FamilyMemberContext } from './FamilyMemberContext';
import { calcAge } from './helpers';

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

const ModifyFamilyData = (props: any): JSX.Element => {
  const [kelValue, setKelValue] = useState<string>('');
  const [kelText, setKelText] = useState<string | undefined>('');
  const [errJenisKelamin, setErrJenisKelamin] = useState(false);
  const [validatJKel, setValidateJKel] = useState(false);
  const [firstEditJKel, setFirstEditJKel] = useState(true);

  const { setAge, dateOfBirth, genderDw, setGender, genderList } = useContext(FamilyMemberContext);

  useEffect(() => {
    if (genderDw === 'm') {
      setKelValue('Laki-lalki');
      setKelText('Laki-laki');
    } else if (genderDw === 'f') {
      setKelValue('Perempuan');
      setKelText('Perempuan');
    }
  }, [genderDw]);

  useEffect(() => {
    if (dateOfBirth.fullDate.length === 10) {
      const yr = dateOfBirth.fullDate.substr(0, 4);
      const mt = dateOfBirth.fullDate.substr(5, 2);
      const dt = dateOfBirth.fullDate.substr(8, 2);
      const brthDt = new Date(`${yr}/${mt}/${dt}`);

      const cAge = calcAge(brthDt);
      if (cAge.type === 'year') {
        setAge(cAge.age);
      } else {
        setAge(0);
      }
    }
  }, [dateOfBirth.fullDate, setAge]);

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

      const patientGen = kelValue === 'Laki-laki' ? 'Male' : kelValue === 'Perempuan' ? 'Female' : '';
      if (genderList.length > 0) {
        const gender = genderList.find((el: any) => {
          return el.name === patientGen;
        });
        setGender(gender);
      }
    } else {
      setErrJenisKelamin(false);
      setValidateJKel(false);
    }
  }, [kelValue, firstEditJKel, genderList, setGender]);

  const handleJKelSelect = useCallback((jKel: DropdownItem) => {
    setKelValue(jKel.value);
    setKelText(jKel.text);
    setFirstEditJKel(false);
  }, []);

  return (
    <>
      <div className="margin-baseB">{props.name.input}</div>
      <div className="row margin-tinyB margin-baseB">{dateOfBirth.input}</div>
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
          options={jKel}
          placeholder="Laki-laki"
          onSelect={handleJKelSelect}
          value={kelText}
          error={errJenisKelamin && !firstEditJKel}
          validate={validatJKel && !firstEditJKel}
          styleInput={{ fontSize: 16, height: 6 }}
          styleItems={{ fontSize: 16, top: 36 }}
          styleIcon={{ top: 10, width: '0.7em' }}
        />
      </div>
    </>
  );
};

export default ModifyFamilyData;
