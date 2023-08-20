import React, { useEffect, Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button } from 'prixa-design-kit/dist';
import { patchAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { ChangePasswordContext } from './ChangePasswordContext';
import { useInput } from '../../../utils/useInput';

export const ChangePasswordForm = () => {
  const { setError } = useContext(ChangePasswordContext);
  const [isValid, setIsValid] = React.useState(false);
  const [isLoad, setLoad] = React.useState(false);

  const oldPassword = useInput({
    label: 'Password Lama',
    type: 'password',
    placeholder: 'Tulis Password',
  });

  const newPassword = useInput({
    label: 'Password Baru',
    type: 'password',
    placeholder: 'Tulis Password',
  });

  const confirmPassword = useInput({
    label: 'Konfirmasi Password',
    type: 'password',
    placeholder: 'Tulis Password',
    confirmWith: newPassword.value,
  });

  const inputList = [oldPassword.input, newPassword.input, confirmPassword.input];

  const history = useHistory();

  const profileData = JSON.parse(String(localStorage.getItem('profileData')));

  useEffect(() => {
    const isOldPasswordValid = oldPassword.value && !oldPassword.error;
    const isNewPasswordValid = newPassword.value && !newPassword.error;
    const isConfirmPasswordValid = confirmPassword.value && !confirmPassword.error;
    isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid ? setIsValid(true) : setIsValid(false);
  }, [oldPassword, newPassword, confirmPassword]);

  const changePassword = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoad(true);
    patchAPI(USER_API.CHANGE_PASSWORD(profileData.client_id), {
      /* eslint-disable */
      new_password: newPassword.value,
      new_password_confirmation: confirmPassword.value,
      old_password: oldPassword.value,
      /* eslint-enable */
    })
      .then(() => {
        setLoad(false);
        history.push({
          pathname: '/change-password-success',
        });
      })
      .catch(err => {
        setError(() => {
          if (err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata) {
            return err.response.data.details[0].metadata.errInd;
          } else if (err.response.data && JSON.stringify(err.response.data).includes('password did not match')) {
            return 'Password lama tidak sama dengan Password sekarang.';
          } else if (
            err.response.data.detail &&
            JSON.stringify(err.response.data).includes('The new password confirmation does not match')
          ) {
            return 'Konfirmasi Password tidak sama dengan Password yang dimasukkan.';
          } else {
            return 'Gangguan sistem, mohon coba kembali.';
          }
        });
        setTimeout(() => {
          setError('');
        }, 3000);
        setLoad(false);
      });
  };

  return (
    <Fragment>
      <div className="prixa-title margin-tinyB" style={{ width: '219px' }}>
        <Text scale="question">Masukkan password baru untuk akun Anda.</Text>
      </div>
      <div className="margin-baseB" style={{ display: 'flex' }}>
        <Text scale="caption" style={{ lineHeight: 1.5 }}>
          Pastikan password mengandung huruf kapital, huruf kecil, karakter spesial, angka, dan berjumlah 8-15 karakter
        </Text>
      </div>
      <form onSubmit={(event: React.FormEvent<HTMLFormElement>): void => changePassword(event)}>
        <div data-cy="old-password" className="margin-baseB">
          {inputList[0]}
        </div>
        <div data-cy="new-password" className="margin-baseB">
          {inputList[1]}
        </div>
        <div data-cy="password-confirmation" className="margin-baseB">
          {inputList[2]}
        </div>
        <div className="text-center margin-largeT" style={{ marginTop: '45px' }}>
          <Button
            data-cy="submit-new-password"
            onClick={(e: any) => changePassword(e)}
            size="xLarge"
            variant="primary"
            disabled={!isValid || isLoad}
            spinner={isLoad}
          >
            Ganti Password
          </Button>
        </div>
      </form>
    </Fragment>
  );
};
