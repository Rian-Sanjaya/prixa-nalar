import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button } from 'prixa-design-kit/dist';
import { HeaderContext } from '../../../components/header/HeaderContext';

const imgChangePasswordSuccess = `${process.env.REACT_APP_ASSET_URL}/illustration/Email-3.png`;

const ChangePasswordSuccess = (): JSX.Element => {
  const { setHeader, setMenu } = useContext(HeaderContext);
  const history = useHistory();

  /* eslint-disable */
  useEffect(() => {
    setHeader('Ganti Password');
    setMenu(false);

    return () => {
      setHeader('');
    }
  }, []);
  /* eslint-enable */

  const handleKembali = (): void => {
    history.push({ pathname: '/profile' });
  };

  return (
    <div className="prixa-container is-top">
      <div className="prixa-question-image">
        <img
          loading="lazy"
          width="240px"
          height="auto"
          alt="Prixa Reset Password Success"
          src={imgChangePasswordSuccess}
        />
      </div>
      <div data-cy="change-password-success-message" className="margin-smallB" style={{ width: '244px' }}>
        <Text scale="heroTitle">Password akun Anda telah berhasil diganti.</Text>
      </div>
      <div>
        <Text scale="content">Silakan kembali dan beraktivitas di akun Anda.</Text>
      </div>
      <div className="text-center margin-largeT margin-xLargeB" style={{ marginTop: '82px' }}>
        <Button size="xLarge" variant="primary" onClick={handleKembali}>
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default ChangePasswordSuccess;
