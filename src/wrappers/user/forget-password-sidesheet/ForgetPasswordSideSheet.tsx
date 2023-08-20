import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Text, Button } from 'prixa-design-kit/dist';
import { postAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { useInput } from '../../../utils/useInput';

const imgForgetPasswordSent = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Account - Recovery Sent.png`;

interface ForgetPasswordProps {
  setPage?: React.Dispatch<React.SetStateAction<string>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  email?: string;
  modal?: boolean;
}

const pages = {
  FORGET_PASSWORD: 'Forget Password',
  FORGET_PASSWORD_SENT: 'Forget Password Sent',
};

const ForgetPasswordSideSheet = ({ setModal, setError, modal }: ForgetPasswordProps): JSX.Element => {
  const [page, setPage] = React.useState(pages.FORGET_PASSWORD);
  const [inputEmail, setInputEmail] = React.useState('');

  if (page === pages.FORGET_PASSWORD) {
    return <ForgetPasswordPage setPage={setPage} setInputEmail={setInputEmail} setError={setError} />;
  } else {
    return <ForgetPasswordSentPage setPage={setPage} setModal={setModal} email={inputEmail} modal={modal} />;
  }
};

const ForgetPasswordPage = ({ setPage, setInputEmail, setError }: any): JSX.Element => {
  const [isValid, setIsValid] = React.useState(false);
  const [isLoad, setLoader] = React.useState(false);

  const email = useInput({
    label: 'Email',
    type: 'email',
    placeholder: 'nama@email.com',
  });

  const inputList = [email.input];

  React.useEffect(() => {
    const isEmailValid = email.value && !email.error;
    isEmailValid ? setIsValid(true) : setIsValid(false);
  }, [email]);

  const history = useHistory();

  const forgotPassword = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setLoader(true);
    postAPI(USER_API.FORGET_PASSWORD_EMAIL, {
      email: email.value,
      source: 'nalar',
    })
      .then(() => {
        setLoader(false);
        setPage(pages.FORGET_PASSWORD_SENT);
        setInputEmail(email.value);
      })
      .catch(err => {
        if (JSON.stringify(err.response.data).includes('"User not active."')) {
          localStorage.setItem('tempMail', email.value);
          history.push({
            pathname: '/unverified',
          });
        } else {
          setError(
            err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
              ? err.response.data.details[0].metadata.errInd
              : 'Gangguan sistem, mohon coba kembali.',
          );
          setLoader(false);
          setTimeout(() => {
            setError('');
          }, 3000);
        }
      });
  };

  return (
    <div className="prixa-container padding-largeX">
      <div className="prixa-title margin-baseB">
        <Text scale="heroTitle" style={{ lineHeight: 1.21 }}>
          Ke mana petunjuk pemulihan akun perlu dikirim?
        </Text>
      </div>
      <div className="margin-baseB">
        <Text scale="caption">Pastikan email yang Anda masukkan benar dan Anda dapat mengakses email tersebut.</Text>
      </div>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>): void => forgotPassword(event)}
        style={{ marginBottom: '64px' }}
      >
        {inputList.map((item, key: number) => {
          return (
            <div key={key} className="margin-baseB">
              {item}
            </div>
          );
        })}
        <div className="margin-largeT" style={{ textAlign: 'right' }}>
          <Button
            onClick={(e: any) => forgotPassword(e)}
            size="xLarge"
            variant="primary"
            disabled={!isValid || isLoad}
            spinner={isLoad}
            style={{ width: '120px' }}
          >
            Kirim
          </Button>
        </div>
      </form>
    </div>
  );
};

const ForgetPasswordSentPage = ({ setPage, setModal, email, modal }: ForgetPasswordProps): JSX.Element => {
  const location: any = useLocation();

  useEffect(() => {
    return () => {
      if (setPage) setPage(pages.FORGET_PASSWORD);
    };
  }, [modal, setPage]);

  const closeForgetPasswordPage = () => {
    setModal(false);
  };

  return (
    <div className="prixa-container padding-largeX">
      <div className="prixa-question-image">
        <img loading="lazy" width="240px" height="auto" alt="Prixa Forget Password" src={imgForgetPasswordSent} />
      </div>
      <div className="margin-baseB" style={{ width: '202px' }}>
        <Text scale="heroTitle" style={{ lineHeight: 1.21 }}>
          Petunjuk pemulihan akun telah dikirim.
        </Text>
      </div>
      <div>
        <Text scale="content" style={{ fontSize: '16px' }}>
          Silakan periksa email <b>{email ? email : location.state ? location.state.email : 'Anda'}</b> dan ikuti
          petunjuk yang diberikan untuk memulihkan akun Anda.
        </Text>
      </div>
      <div className="margin-largeT margin-xLargeB" style={{ textAlign: 'right' }}>
        <Button onClick={() => closeForgetPasswordPage()} size="xLarge" variant="primary" style={{ width: '120px' }}>
          Tutup
        </Button>
      </div>
    </div>
  );
};

export { ForgetPasswordSideSheet };
