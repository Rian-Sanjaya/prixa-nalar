import React, { useContext, useEffect } from 'react';
import { UseTracking } from '../../../utils/useTracking';
import { sessionId, currentState } from '../../../api/api-utils';
import { Toast, Text, Bottomsheet } from 'prixa-design-kit/dist';
import { ForgetPasswordSideSheet } from '../forget-password-sidesheet/ForgetPasswordSideSheet';
import { LoginContext } from './LoginContext';
import { LoginForm } from './LoginForm';
// import { GoogleLogin } from '../../../components/googleLogin/GoogleLogin';
import { HeaderContext } from '../../../components/header/HeaderContext';

interface LoginSectionInterface {
  afterLoggedIn?: Function;
}

export const LoginSection = (props: LoginSectionInterface): JSX.Element => {
  const { afterLoggedIn } = props;
  const [isErrorMsg, setError] = React.useState('');
  const [modal, setModal] = React.useState(false);

  const signUp = () => {
    UseTracking({ event: `Menu Signup clicked`, properties: { sessionId, state: currentState } });
  };

  return (
    <React.Fragment>
      <div className="prixa-container is-top padding-largeX">
        <div style={{ marginBottom: '24px' }}>
          <Text scale="heroTitle">Masuk ke akun Anda untuk melanjutkan:</Text>
        </div>
        <LoginContext.Provider value={{ setError, setModal }}>
          <LoginForm afterLoggedIn={afterLoggedIn} />
        </LoginContext.Provider>
        {/* <GoogleLogin text="Masuk dengan Google" /> */}
        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <Text scale="pageTitle" style={{ fontSize: '14px', fontWeight: 500 }}>
            Belum memiliki akun?
          </Text>
          <a href="/sign-up" style={{ display: 'inline-block' }} onClick={signUp}>
            <Text
              scale="feedbackLink2"
              style={{ fontSize: '12px', fontWeight: 700, paddingLeft: '5px', cursor: 'pointer' }}
            >
              Daftar Sekarang
            </Text>
          </a>
        </div>
        <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
        <Bottomsheet
          setShow={setModal}
          show={modal}
          title="Lupa Password"
          content={<ForgetPasswordSideSheet setModal={setModal} setError={setError} modal={modal} />}
        ></Bottomsheet>
      </div>
    </React.Fragment>
  );
};

const LoginTab = (): JSX.Element => {
  const { setHeader, setMenu, setShowAvatar } = useContext(HeaderContext);

  /* eslint-disable */
  useEffect(() => {
    setHeader('Masuk Akun');
    setMenu(false);
    setShowAvatar(false);

    return () => {
      setHeader('');
      // setMenu(true);
    }
  }, []);
  /* eslint-enable */

  return <LoginSection />;
};

export default LoginTab;
