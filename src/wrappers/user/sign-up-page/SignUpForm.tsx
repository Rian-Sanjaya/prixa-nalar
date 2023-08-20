import React, { useState, useContext, useEffect } from 'react';
import { Button, Text } from 'prixa-design-kit/dist';
import { useInput } from '../../../utils/useInput';
import { useHistory } from 'react-router-dom';
import { postAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { SignUpContext } from './SignUpContext';
import { PrivacyPolicy } from './PrivacyPolicy';

export const SignUpForm = () => {
  const { setError } = useContext(SignUpContext);
  const [isValid, setIsValid] = useState(false);
  const [isLoad, setLoader] = useState(false);

  const name = useInput({
    label: 'Nama',
    type: 'nama',
    placeholder: 'Nama Lengkap',
  });

  const email = useInput({
    label: 'Email',
    type: 'email',
    placeholder: 'nama@email.com',
  });

  const password = useInput({
    label: 'Password',
    type: 'password',
    placeholder: 'Tulis Password',
    errMessage:
      'Password harus mengandung huruf kapital, huruf kecil, karakter spesial, angka, dan berjumlah 8-15 karakter',
  });

  const confirmPassword = useInput({
    label: 'Konfirmasi Password',
    type: 'password',
    placeholder: 'Tulis Ulang Password',
    confirmWith: password.value,
  });

  const inputList = [name.input, email.input, password.input, confirmPassword.input];

  const history = useHistory();

  useEffect(() => {
    const isNameValid = name.value && !name.error;
    const isEmailValid = email.value && !email.error;
    const isPasswordValid = password.value && !password.error;
    const isConfirmPasswordValid = confirmPassword.value && !confirmPassword.error;
    isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid ? setIsValid(true) : setIsValid(false);
  }, [name, email, password, confirmPassword]);

  const registration = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoader(true);
    postAPI(USER_API.REGISTER, {
      email: email.value,
      name: name.value,
      role: 'patient',
      password: password.value,
      /* eslint-disable-next-line */
      password_confirmation: password.value,
      source: 'nalar',
    })
      .then(() => {
        setLoader(false);
        localStorage.setItem('profileData', `{"email": "${email.value}", "name": "${name.value}"}`);
        history.push('/verification-sent');
      })
      .catch(err => {
        if (err.response.data.detail && err.response.data.detail.email[0]) {
          setError('Email tersebut sudah pernah digunakan untuk mendaftar');
        } else {
          setError(
            err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
              ? err.response.data.details[0].metadata.errInd
              : 'Gangguan sistem, mohon coba kembali.',
          );
        }
        setTimeout(() => {
          setError('');
        }, 3000);
        setLoader(false);
      });
  };

  return (
    <form onSubmit={(event: React.FormEvent<HTMLFormElement>): void => registration(event)}>
      {inputList.map((item, key: number) => {
        return (
          <div key={key} className="margin-baseB">
            {item}
          </div>
        );
      })}
      <div style={{ marginTop: '-20px' }}>
        <Text scale="headerSubtitle" style={{ color: 'var(--grey)', fontStyle: 'italic' }}>
          Pastikan password sama, mengandung huruf kapital, huruf kecil, karakter spesial, angka, dan berjumlah 8-15
          karakter
        </Text>
      </div>
      <PrivacyPolicy />
      <div className="text-center margin-largeT">
        <Button
          onClick={(e: any) => registration(e)}
          size="xLarge"
          disabled={!isValid}
          spinner={isLoad}
          style={{ width: '-webkit-fill-available' }}
        >
          Daftar
        </Button>
      </div>
    </form>
  );
};
