import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast, Text } from 'prixa-design-kit/dist';
import { UseTracking } from '../../../utils/useTracking';
import { sessionId, currentState } from '../../../api/api-utils';
import { SignUpForm } from './SignUpForm';
import { SignUpContext } from './SignUpContext';
// import { GoogleLogin } from '../../../components/googleLogin/GoogleLogin';
import { HeaderContext } from '../../../components/header/HeaderContext';

const SignUpTab = () => {
  const [isErrorMsg, setError] = React.useState('');
  const history = useHistory();
  const { setHeader, setMenu, setShowAvatar } = useContext(HeaderContext);

  /* eslint-disable */
  useEffect(() => {
    setHeader('Daftar Akun');
    setMenu(false);
    setShowAvatar(false);

    return () => {
      setHeader('');
      // setMenu(true);
    }
  }, []);
  /* eslint-enable */

  const login = () => {
    UseTracking({ event: `Menu Login clicked`, properties: { sessionId, state: currentState } });
    history.push({
      pathname: '/login',
    });
  };

  return (
    <React.Fragment>
      <div className="prixa-container is-top">
        <div style={{ marginBottom: '24px' }}>
          <Text scale="heroTitle">Lengkapi data berikut untuk mendaftar:</Text>
        </div>
        <SignUpContext.Provider value={{ setError }}>
          <SignUpForm />
        </SignUpContext.Provider>
        {/* <GoogleLogin text="Daftar dengan Google" /> */}
        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <Text scale="pageTitle" style={{ fontSize: '14px', fontWeight: 500 }}>
            Sudah terdaftar?
          </Text>
          <div style={{ display: 'inline-block' }} onClick={login}>
            <Text
              scale="feedbackLink2"
              style={{ fontSize: '12px', fontWeight: 700, paddingLeft: '5px', cursor: 'pointer' }}
            >
              Masuk ke Akun
            </Text>
          </div>
        </div>
        <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
      </div>
    </React.Fragment>
  );
};

export default SignUpTab;
