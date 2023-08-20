import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast, Text, Button } from 'prixa-design-kit/dist';
import { getAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { LoadPage } from '../../diagnostic/LoadPage';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ResetPasswordContext } from './ResertPasswordContext';
import { signOut } from '../../user/ProfilePage';
import { HeaderContext } from '../../../components/header/HeaderContext';

const imgResetPasswordSuccess = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Account - Change Password.png`;

const ResetPasswordPage = (): JSX.Element => {
  const [isErrorMsg, setError] = React.useState('');
  const [isLoad, setLoader] = React.useState(true);

  const history = useHistory();
  const { setHeader, setMenu, setShowAvatar } = useContext(HeaderContext);

  /* eslint-disable */
  function checkPasswordToken() {
    getAPI(USER_API.FORGET_VERIFY(String(window.location.pathname).split('password/')[1]))
      .then((res:any) => {
        localStorage.setItem('tempMail', res.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        history.push({ pathname: '/login' });
      });
  }

  /* eslint-disable */
  useEffect(() => {
    setHeader('Ganti Password');
    setMenu(false);
    setShowAvatar(false);

    return () => {
      setHeader('');
    }
  }, []);

  useEffect(() => {
    checkPasswordToken();
  }, []);
  /* eslint-enable */

  return (
    <React.Fragment>
      {isLoad ? (
        <LoadPage />
      ) : (
        <div className="prixa-container">
          <ResetPasswordContext.Provider value={{ setError, isLoad, setLoader }}>
            <ResetPasswordForm />
          </ResetPasswordContext.Provider>
          <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
        </div>
      )}
    </React.Fragment>
  );
};

const ResetPasswordSuccessPage = (): JSX.Element => {
  const { setHeader, setMenu } = useContext(HeaderContext);

  /* eslint-disable */
  useEffect(() => {
    setHeader('Ganti Password');
    setMenu(false);

    return () => {
      setHeader('');
    }
  }, []);

  const handleMasuk = (): void => {
    const isLoginTokenExists = localStorage.getItem('loginToken');
    if (isLoginTokenExists) {
      signOut();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="prixa-container">
      <div className="prixa-question-image">
        <img
          loading="lazy"
          width="240px"
          height="auto"
          alt="Prixa Reset Password Success"
          src={imgResetPasswordSuccess}
        />
      </div>
      <div className="margin-baseB" style={{ width: '242px' }}>
        <Text scale="heroTitle">Password akun Anda telah berhasil diganti.</Text>
      </div>
      <div>
        <Text scale="content">Silakan masuk ke akun Anda dengan email dan password baru.</Text>
      </div>
      <div className="text-center margin-largeT margin-xLargeB">
        <Button size="xLarge" variant="primary" onClick={handleMasuk}>
          Masuk
        </Button>
      </div>
    </div>
  );
};

export { ResetPasswordPage, ResetPasswordSuccessPage };
