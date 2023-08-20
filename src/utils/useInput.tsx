import React, { useEffect, useRef } from 'react';
import { FormLabel, InputText, Textarea, Dropdown } from 'prixa-design-kit/dist';

export const useInput = ({
  label,
  type = 'text',
  rows,
  placeholder,
  confirmWith,
  isValidate = true,
  editMode,
  firstEdit,
  setFirstEdit,
}: any) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [validate, setValidate] = React.useState(false);
  const [val, setVal] = React.useState('');

  const isFirstRun = useRef(true);
  /* eslint-disable */
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const setErrorFalseAndValidateTrue = () => {
      setError(false);
      setValidate(true);
    };

    const setErrorTrueAndValidateFalse = () => {
      setError(true);
      setValidate(false);
    };

    if (isValidate) {
      if (type === 'namaDataDiri' || type === 'alamatDataDiri') {
        if (editMode && firstEdit === false) {
          const isValid = value && value.toString().trimLeft().length > 1;
          if (isValid) {
            setError(false);
            setValidate(true);
          } else {
            setError(true);
            setValidate(false);
          } 
        } else {
          setError(false);
          setValidate(false);
        }
      } else if (type === 'teleponDataDiri') {
        if (editMode && firstEdit === false) {

          let isValidTelepon = true;
          let phone = String(value)

          if (phone.substr(0, 2) === '08' && phone.length >= 10 && phone.length <= 13) {
            phone = phone.slice(1);
            phone = (phone + '000000000000').slice(0, 12);
            if (parseInt(phone) < 811000000000 || parseInt(phone) > 899999999999) {
              isValidTelepon = false
            }
          } else if ((phone.substr(0, 4) === '+628' && phone.length >= 12 && phone.length <= 15) || 
              (phone.substr(0, 3) === '628' && phone.length >= 11 && phone.length <= 14)) {

            if (phone.substr(0, 4) === '+628') phone = phone.slice(1);

            phone = (phone + '00000000000000').slice(0, 14);
            if (parseInt(phone) < 62811000000000 || parseInt(phone) > 62899999999999) {
              isValidTelepon = false
            }
          } else {
            isValidTelepon = false
          }

          if (isValidTelepon) {
            setError(false);
            setValidate(true);
          } else {
            setError(true);
            setValidate(false);
          } 
        } else {
          setError(false);
          setValidate(false);
        }
      } else if (type === 'text' || type === 'nama') {
        let isValidText: boolean;
        if (type === 'text') isValidText = String(value).length > 0;
        else isValidText = String(value).length > 1;
        isValidText ? setError(false) : setError(true);
        isValidText ? setValidate(true) : setValidate(false);
      } else if ( type === 'namaSendEmail' ) {
        const isValidText = value && value.trim().length > 4;
        isValidText ? setError(false) : setError(true);
      } else if (type === 'email' || type === 'email-inssurance-regis') {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
        isValidEmail ? setError(false) : setError(true);
        isValidEmail ? setValidate(true) : setValidate(false);
      } else if (type === 'nik') {
        const isValidNIK = /^[0-9]{16}$/.test(String(value));
        isValidNIK ? setError(false) : setError(true);
      } else if (type === 'phoneNumber') {
        const isValidPhoneNumber = /^[+]?[0-9]{10,13}$/.test(String(value));
        isValidPhoneNumber ? setError(false) : setError(true);
      } else if (type === 'password') {
        const isValidPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g.test(String(value));

        if (isValidPassword) {
          if (confirmWith) {
            if (value === confirmWith) {
              setErrorFalseAndValidateTrue();
              return;
            } else {
              setErrorTrueAndValidateFalse();
              return;
            }
          }
          setErrorFalseAndValidateTrue();
        } else {
          setErrorTrueAndValidateFalse();
        }
      }
    }
  }, [value, editMode]);
  /* eslint-enable */

  const handleNamaChange = (value: string): void => {
    if (setFirstEdit) setFirstEdit(false);
    const regexp = /^[A-Za-z\s]+$/;
    if (value === '' || regexp.test(value)) {
      setValue(value);
    }
  };

  const handleAlamatChange = (value: string): void => {
    setFirstEdit(false);
    setValue(value);
  };

  const handleTeleponChange = (value: string): void => {
    setFirstEdit(false);
    const regexp = /(^\+?[0-9\b]+$|^\+$)/;
    if (value === '' || regexp.test(value)) {
      setValue(value);
    }
  };

  const input = (
    <React.Fragment>
      {(type === 'namaDataDiri' ||
        type === 'jenisKelamin' ||
        type === 'alamatDataDiri' ||
        type === 'teleponDataDiri' ||
        type === 'nama' ||
        type === 'email' ||
        type === 'password') && (
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
            {label}
          </label>
          {((editMode === true && error) ||
            (type === 'namaDataDiri' && error) ||
            (type === 'nama' && error) ||
            (type === 'email' && error) ||
            (type === 'password' && error)) && (
            <label style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--alert)', paddingTop: 4 }}>
              Data tidak valid
            </label>
          )}
        </div>
      )}

      {type !== 'namaDataDiri' &&
        type !== 'jenisKelamin' &&
        type !== 'alamatDataDiri' &&
        type !== 'teleponDataDiri' &&
        type !== 'nama' &&
        type !== 'email' &&
        type !== 'password' && <FormLabel errors={false}>{label}</FormLabel>}

      {((): JSX.Element => {
        if (type === 'namaDataDiri') {
          return (
            <InputText
              errors={error}
              placeholder={placeholder}
              setData={(value: string): void => handleNamaChange(value)}
              small={false}
              type="text"
              validate={validate}
              value={value || ''}
              disabled={editMode === false}
              spellCheck={false}
              title={editMode === true && error ? 'Hanya alfabet, setidaknya dua karakter' : ''}
            />
          );
        } else if (type === 'alamatDataDiri') {
          return (
            <Textarea
              errors={error}
              placeholder={placeholder}
              setData={(value: string): void => handleAlamatChange(value)}
              small={false}
              validate={validate}
              value={value || ''}
              rows={rows || 2}
              disabled={editMode === false}
              spellCheck={false}
              title={editMode === true && error ? 'Setidaknya dua karakter' : ''}
              style={{ height: 94 }}
            />
          );
        } else if (type === 'teleponDataDiri') {
          return (
            <InputText
              errors={error}
              placeholder={placeholder}
              setData={(value: string): void => handleTeleponChange(value)}
              small={false}
              type="text"
              validate={validate}
              value={value || ''}
              disabled={editMode === false}
              maxLength={15}
              title={
                editMode === true && error ? 'Hanya numerik. 10-14 digit, nomor harus dimulai dengan 08 atau 628' : ''
              }
            />
          );
        } else if (type === 'textarea') {
          return (
            <Textarea
              errors={error}
              placeholder={placeholder}
              setData={setValue}
              small={false}
              validate={validate}
              value={value || ''}
              rows={rows || 2}
            />
          );
        } else if (type === 'nik' || type === 'phoneNumber') {
          return (
            <InputText
              errors={error}
              placeholder={placeholder}
              setData={setValue}
              small={false}
              type="text"
              validate={validate}
              value={value || ''}
            />
          );
        } else if (type === 'dropdown') {
          return (
            <Dropdown
              onSelect={e => setVal(e.value)}
              options={[
                {
                  text: 'Diri Sendiri',
                  value: 'Diri Sendiri',
                },
                {
                  text: 'Asuransi',
                  value: 'Asuransi',
                },
              ]}
              value={val}
              placeholder="Pilih Metode Pembayaran"
            />
          );
        } else if (type === 'nama' || type === 'namaSendEmail') {
          return (
            <InputText
              errors={error}
              placeholder={placeholder}
              setData={(value: string): void => handleNamaChange(value)}
              small={false}
              type="text"
              validate={validate}
              value={value || ''}
            />
          );
        } else if (type === 'email-inssurance-regis') {
          return (
            <InputText
              errors={error}
              placeholder={placeholder}
              setData={setValue}
              small={false}
              type="email"
              validate={validate}
              value={value || ''}
              style={{ height: '48px', paddingRight: '82px' }}
            />
          );
        } else {
          return (
            <InputText
              errors={error}
              placeholder={placeholder}
              setData={setValue}
              small={false}
              type={type}
              validate={validate}
              value={value || ''}
            />
          );
        }
      })()}
      {/* {errMessage && error ? (
        <div className="margin-microT">
          <Text scale="errorMessage">{errMessage}</Text>
        </div>
      ) : (
        ''
      )} */}
    </React.Fragment>
  );
  return { value, setValue, error, input };
};
