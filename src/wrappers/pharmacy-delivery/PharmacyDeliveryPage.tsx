import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { getAPI } from '../../api/api-method';
import { PHARMACY_API, PARTNER_APP_API } from '../../api/api-url';
import { getPartnerID, getAppID } from '../../utils/constant';
import { LoadPage } from '../diagnostic/LoadPage';
import { parse } from '../../utils/query-parser';
import { HeaderContext } from '../../components/header/HeaderContext';
import Axios from 'axios';
import { refreshToken } from '../../api/api-utils';

export const PharmacyDeliveryPage: React.FC = () => {
  const history = useHistory();

  const { setShowDownload } = useContext(HeaderContext);

  useEffect(() => {
    setShowDownload(false);
  }, [setShowDownload]);

  useEffect(() => {
    const { prescriptionid }: any = parse(window.location.search);
    const prescriptionId = prescriptionid ? `&prescriptionid=${prescriptionid}` : '';

    /* Do refresh token before redirect to remedi */
    /* to extend time and prevent refreshing token in remedi */

    getAPI(PARTNER_APP_API.PARTNER_APP_ID(getPartnerID, getAppID)).then((res: any) => {
      const isOnOperationalHours = res.data.client.is_on_operational_hours;
      if (isOnOperationalHours) {
        refreshToken().then((response: any): void => {
          const newTokenBearer = response.headers.authorization;
          localStorage.setItem('loginToken', newTokenBearer.split(' ')[1]);
          Axios.defaults.headers.common.Authorization = newTokenBearer;

          const redirectURL = `${String(
            process.env.REACT_APP_CTA_PHARMACY,
          )}?pid=${getPartnerID}&appid=${getAppID}&accesstoken=${newTokenBearer.split(' ')[1]}${prescriptionId}`;

          getAPI(PHARMACY_API.CHECK_PRESCRIPTION)
            .then((res: any) => {
              if (res.total !== 0) {
                window.location.assign(redirectURL);
              } else {
                history.push({
                  pathname: '/prescription-not-found',
                });
              }
            })
            .catch((): void => {
              history.push({
                pathname: '/prescription-not-found',
              });
            });
        });
      } else {
        history.push({
          pathname: '/operational-hours-notice',
        });
      }
    });
  }, [history]);

  return <LoadPage />;
};
