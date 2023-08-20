import React, { useEffect, Fragment, useContext } from 'react';
import { useInput } from '../../../utils/useInput';
import { useHistory, useParams } from 'react-router-dom';
import { patchAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { Text, Button } from 'prixa-design-kit/dist';
import { ResetPasswordContext } from './ResertPasswordContext';

export const ResetPasswordForm = () => {
  const { setError, isLoad, setLoader } = useContext(ResetPasswordContext);
  const [isValid, setIsValid] = React.useState(false);

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
    placeholder: 'Tulis Password',
    confirmWith: password.value,
  });

  const inputList = [password.input, confirmPassword.input];
  const history = useHistory();
  const { tokenPassword } = useParams() as { tokenPassword: string };

  useEffect(() => {
    const isPasswordValid = password.value && !password.error;
    const isConfirmPasswordValid = confirmPassword.value && !confirmPassword.error;
    isPasswordValid && isConfirmPasswordValid ? setIsValid(true) : setIsValid(false);
  }, [password, confirmPassword]);
  /* eslint-enable */

  React.useEffect(() => {
    return () => {
      localStorage.removeItem('tempMail');
    };
  }, []);

  const resetPassword = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoader(true);
    patchAPI(USER_API.FORGET_PASSWORD, {
      token: tokenPassword,
      password: password.value,
      /* eslint-disable-next-line */
      password_confirmation: password.value,
    })
      .then(() => {
        setLoader(false);
        history.push('/reset-password-sent');
      })
      .catch(err => {
        setError(
          err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
            ? err.response.data.details[0].metadata.errInd
            : 'Gangguan sistem, mohon coba kembali.',
        );
        setTimeout(() => {
          setError('');
        }, 3000);
        setLoader(false);
      });
  };

  return (
    <Fragment>
      <div className="prixa-title margin-baseB">
        <Text scale="heroTitle">Masukkan password baru untuk akun Anda.</Text>
      </div>
      <div className="margin-baseB">
        <Text scale="caption">
          Pastikan password mengandung huruf kapital, huruf kecil, karakter spesial, angka, dan berjumlah 8-15 karakter
        </Text>
      </div>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>): void => resetPassword(event)}
        style={{ marginBottom: '64px' }}
      >
        {inputList.map((item, key: number) => {
          return (
            <div key={key} className="margin-baseB">
              {item}
            </div>
          );
        })}
        <div className="text-center margin-largeT">
          <Button
            onClick={(e: any) => resetPassword(e)}
            size="xLarge"
            variant="primary"
            disabled={!isValid}
            spinner={isLoad}
          >
            Ganti password
          </Button>
        </div>
      </form>
    </Fragment>
  );
};
