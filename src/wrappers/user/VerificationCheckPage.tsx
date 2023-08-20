import React, { useEffect, useState } from 'react';
import { VerifiedPage, UnverifiedPage } from '../user/VerificationPage';
import { getAPI } from '../../api/api-method';
import { USER_API } from '../../api/api-url';
import { LoadPage } from '../../wrappers/diagnostic/LoadPage';
import { ErrorPage } from '../../wrappers/diagnostic/ErrorPage';

export const VerificationCheckPage = () => {
  /* eslint-disable */
  const state = {
    LOAD: <LoadPage />,
    ERROR: <ErrorPage text="Link yang anda masukan salah" />,
    VERIFIED: <VerifiedPage />,
    UNVERIFIED: <UnverifiedPage email={localStorage.getItem('tempMail')} />,
  };
  /* eslint-enable */
  const [isVerified, setIsVerified] = useState(state.LOAD);

  useEffect(() => {
    const token = String(window.location.pathname).split('verification-check/')[1];
    if (token) {
      getAPI(USER_API.REGIS_VERIFY(token))
        .then(async (res: any) => {
          setIsVerified(state.VERIFIED);
        })
        .catch(() => {
          setIsVerified(state.ERROR);
        });
    } else {
      setIsVerified(state.UNVERIFIED);
    } // eslint-disable-next-line
  }, []);
  /* eslint-enable */

  return isVerified || state.LOAD;
};

export default VerificationCheckPage;
