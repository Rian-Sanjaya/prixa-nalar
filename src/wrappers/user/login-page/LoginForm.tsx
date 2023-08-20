import React, { useState, useContext, FormEvent } from 'react';
import { Text, Button } from 'prixa-design-kit/dist';
import { postAPI, signal } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { useHistory } from 'react-router-dom';
import { LoginContext } from './LoginContext';
import { useInput } from '../../../utils/useInput';

interface LoginSectionInterface {
  afterLoggedIn?: Function;
}

export const LoginForm = (props: LoginSectionInterface): JSX.Element => {
  const { setError, setModal } = useContext(LoginContext);
  const [isLoad, setLoader] = useState(false);
  const { afterLoggedIn } = props;

  const email = useInput({
    label: 'Email',
    type: 'email',
    placeholder: 'nama@email.com',
    isValidate: true,
  });

  const password = useInput({
    label: 'Password',
    type: 'password',
    placeholder: 'Tulis Password',
    isValidate: true,
  });

  // const inputList = [email.input, password.input];
  const history = useHistory();
  const isError = email.value && !email.error && password.value && !password.error ? true : false;

  const login = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoader(true);
    const queryParams = localStorage.getItem('DiagnosisID')
      ? `?prognosisId=${localStorage.getItem('DiagnosisID')}`
      : '';
    postAPI(`${USER_API.LOGIN}${queryParams}`, {
      email: email.value,
      password: password.value,
    })
    .then((res: any) => { // eslint-disable-line
        localStorage.setItem('loginToken', res.loginToken);
        localStorage.setItem('isVerified', String(res.isVerified) || '');
        setLoader(false);
        signal.cancel('');
        if (afterLoggedIn) {
          afterLoggedIn();
        } else {
          history.push({
            pathname: `${localStorage.getItem('isVerified') === 'true' ? '/' : '/unverified'}`,
          });
        }
      })
      .catch(err => {
        try {
          if (JSON.stringify(err.response.data).includes('"User not active."')) {
            localStorage.setItem('tempMail', email.value);
            history.push({
              pathname: '/unverified',
            });
          } else if (JSON.stringify(err.response.data).includes('Username or password is wrong')) {
            setError('Email atau password salah');
            setLoader(false);
          } else {
            setError(
              err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
                ? err.response.data.details[0].metadata.errInd
                : err.response.data.error,
            );
            if (localStorage.getItem('referrer') && JSON.stringify(err.response.data).includes('invalid client')) {
              setTimeout(() => {
                window.location.href = localStorage.getItem('referrer') || '';
              }, 1000);
            }
            setLoader(false);
          }
        } catch (error) {
          setError('Gangguan sistem, mohon coba kembali.');
          setLoader(false);
        }
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  return (
    <form onSubmit={(event: React.FormEvent<HTMLFormElement>): void => login(event)}>
      {/* {inputList.map((item, key: number) => {
        return (
          <div key={key} className="margin-baseB">
            {item}
          </div>
        );
      })} */}
      <div className="margin-baseB" data-cy="login-email-input">
        {email.input}
      </div>
      <div className="margin-baseB" data-cy="login-password-input">
        {password.input}
      </div>
      <div style={{ marginTop: '-22px' }}>
        <div
          onClick={(): void => {
            setModal(true);
          }}
        >
          <Text style={{ cursor: 'pointer', fontWeight: 700 }} scale="feedbackLink">
            Lupa password?
          </Text>
        </div>
      </div>
      <div className="text-center margin-baseT">
        <Button
          onClick={(e: FormEvent<HTMLFormElement>): void => login(e)}
          size="xLarge"
          variant="primary"
          disabled={!isError}
          spinner={isLoad}
          style={{ width: '-webkit-fill-available' }}
        >
          Masuk
        </Button>
      </div>
    </form>
  );
};
