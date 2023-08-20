import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Text, Button, Toast, Icon } from 'prixa-design-kit/dist';
import { postAPI } from '../../api/api-method';
import { USER_API } from '../../api/api-url';
import { signOut } from './ProfilePage';
import { HeaderContext } from '../../components/header/HeaderContext';

const imgVerificationSent = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Account - Verification Sent.png`;
const imgUnverified = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Account - Not Verified.png`;
const imgVerified = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Account - Verification Success.png`;

export const VerificationSentPage = () => {
  const location: any = useLocation();
  const history = useHistory();
  const { setHeader, setMenu, setShowAvatar } = React.useContext(HeaderContext);

  /* eslint-disable */
  React.useEffect(() => {
    setHeader('Daftar Akun');
    setMenu(false);
    setShowAvatar(false);

    return () => {
      setHeader('');
    }
  }, []);
  /* eslint-enable */

  let verifyEmail = localStorage.getItem('profileData');
  if (verifyEmail) {
    verifyEmail = JSON.parse(verifyEmail).email;
  }
  React.useEffect(() => {
    return () => {
      localStorage.removeItem('tempMail');
    };
  }, []);

  return (
    <div className="prixa-container">
      <div className="prixa-question-image">
        <img loading="lazy" width="240px" height="auto" alt="Prixa Verification Sent" src={imgVerificationSent} />
      </div>
      <div className="margin-baseB">
        <Text scale="heroTitle" data-cy="signup-verification-sent-text">
          Email verifikasi telah dikirim.
        </Text>
      </div>
      <div>
        <Text scale="content" style={{ fontSize: '16px' }}>
          Silakan periksa email <b>{verifyEmail ? verifyEmail : location.state ? location.state.email : 'Anda'}</b> dan
          ikuti petunjuk yang diberikan untuk melanjutkan verifikasi.
        </Text>
      </div>
      <div className="text-center margin-largeT">
        <Button size="xLarge" onClick={() => history.push({ pathname: '/login' })}>
          Tutup
        </Button>
      </div>
    </div>
  );
};

export const VerifiedPage = (): JSX.Element => {
  const history = useHistory();
  const { setHeader, setMenu } = React.useContext(HeaderContext);

  /* eslint-disable */
  React.useEffect(() => {
    setHeader('Daftar Akun');
    setMenu(false);

    return () => {
      setHeader('');
    }
  }, []);
  /* eslint-enable */

  const goToHomePage = () => {
    const isLoginTokenExist = localStorage.getItem('loginToken');
    if (isLoginTokenExist) {
      signOut();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  };

  return (
    <div className="prixa-container">
      <div className="prixa-question-image">
        <img loading="lazy" width="240px" height="auto" alt="Prixa Email Verified" src={imgVerified} />
      </div>
      <div className="margin-baseB">
        <Text scale="heroTitle" data-cy="verification-check-success">
          Verifikasi berhasil.
        </Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text scale="content" style={{ fontSize: '16px' }}>
          Masuk ke akun Anda untuk melanjutkan. Selamat bergabung di Prixa!
        </Text>
      </div>
      <div className="text-center margin-largeT">
        <Button onClick={() => goToHomePage()} size="xLarge" variant="primary">
          Masuk
        </Button>
      </div>
    </div>
  );
};

export const UnverifiedPage = ({ email }: any) => {
  const [isErrorMsg, setError] = React.useState('');
  const [isLoad, setLoader] = React.useState(false);
  const history = useHistory();
  const { setHeader, setMenu } = React.useContext(HeaderContext);

  /* eslint-disable */
  React.useEffect(() => {
    setHeader('Daftar Akun');
    setMenu(false);

    return () => {
      setHeader('');
    }
  }, []);
  /* eslint-enable */

  let verifyEmail = localStorage.getItem('profileData');
  if (verifyEmail) {
    verifyEmail = JSON.parse(verifyEmail).email;
  }

  function resendEmail() {
    setLoader(true);
    postAPI(USER_API.RESEND, {
      email: localStorage.getItem('tempMail'),
      source: 'nalar',
    })
      .then(() => {
        setLoader(false);
        history.push('/verification-sent');
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
  }

  return (
    <div className="prixa-container">
      <div className="prixa-question-image">
        <img loading="lazy" width="240px" height="auto" alt="Prixa Email Unverified" src={imgUnverified} />
      </div>
      <div className="margin-baseB">
        <Text scale="heroTitle">Akun Anda belum diverifikasi.</Text>
      </div>
      <div>
        <Text scale="content" style={{ fontSize: '16px' }}>
          Silakan periksa email <b>{verifyEmail ? verifyEmail : email ? email : 'Anda'}</b> dan ikuti petunjuk yang
          diberikan untuk melanjutkan verifikasi.
        </Text>
      </div>
      <div className="text-center margin-largeT">
        <form
          onSubmit={evt => {
            evt.preventDefault();
            resendEmail();
          }}
        >
          <Button size="xLarge" variant="primary" disabled={isLoad}>
            {!isLoad ? (
              'Kirim Ulang'
            ) : (
              <Icon className="margin-smallR margin-baseL" type="circle-notch" color="light" spin>
                Kirim Ulang
              </Icon>
            )}
          </Button>
        </form>
        <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
      </div>
    </div>
  );
};

export default VerificationSentPage;
