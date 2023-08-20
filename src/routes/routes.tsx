import React, { useState, useEffect } from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { LoggedRoute, AfterDiagnoseRoute } from './routes-check';
import { bookingURLs, pharmacyDeliveryUrls, loggedURLs, regisSign, diagnosisEngine, testLabURLs } from './urls';
import { getAPI } from '../api/api-method';
import { USER_API } from '../api/api-url';
import { ErrorPage } from '../wrappers/diagnostic/ErrorPage';
import { LoadPage } from '../wrappers/diagnostic/LoadPage';
import ConversationPage from '../wrappers/diagnostic/ConversationPage';

const Routes = () => {
  const [filterData, setFilterData] = useState({
    area: { id: '', name: '' },
    hospitals: { id: '', name: '' },
    specialities: { id: '', name: '' },
  });
  const [allSpecialities, setAllSpecialities] = useState(undefined);
  const [doctorData, setDoctorData] = useState({});
  const [date, setDate] = useState(null);
  const [time, setTime] = useState({});
  const [bookingData, setBookingData] = useState({
    name: null,
    birthDate: null,
    nik: null,
    email: null,
    phoneNumber: null,
    paymentMethod: null,
  });

  const bookingProps = {
    doctorData,
    setDoctorData,
    date,
    setDate,
    time,
    setTime,
    bookingData,
    setBookingData,
    allSpecialities,
    setAllSpecialities,
    filterData,
    setFilterData,
  };

  useEffect(() => {
    if (String(window.location.pathname).includes('oauth/google/callback')) {
      getAPI(USER_API.GOOGLE + '/callback' + window.location.search)
        .then((res: any) => {
          localStorage.setItem('loginToken', res.loginToken);
          localStorage.setItem('isVerified', res.status === 'active' ? 'true' : '');
          window.location.href = '/';
        })
        .catch(() => {
          window.location.href = '/login';
          localStorage.setItem('errorLoginGoogle', 'true');
        });
    }
  }, []);

  return (
    <Switch>
      {diagnosisEngine().map((data, i) => {
        if (data.enable) {
          return (
            <Route path={data.path} exact={data.exact} key={i}>
              {data.component}
            </Route>
          );
        } else return '';
      })}
      <Route path="/partner/:partnerId/app/:applicationId" exact>
        <Redirect to="/" />
        <BrowserRouter>
          {diagnosisEngine().map((data, i) => {
            if (data.enable) {
              return (
                <Route path={data.path} exact={data.exact} key={i}>
                  {data.component}
                </Route>
              );
            } else return '';
          })}
        </BrowserRouter>
      </Route>
      <Route path="/partner/:partnerId/app/:applicationId/uid/:uid" exact>
        <Redirect to="/" />
        <BrowserRouter>
          {diagnosisEngine().map((data, i) => {
            if (data.enable) {
              return (
                <Route path={data.path} exact={data.exact} key={i}>
                  {data.component}
                </Route>
              );
            } else return '';
          })}
        </BrowserRouter>
      </Route>
      {regisSign.map((data, i) => {
        if (data.enable) {
          return (
            <AfterDiagnoseRoute path={data.path} exact={data.exact} key={i}>
              {data.component}
            </AfterDiagnoseRoute>
          );
        } else return '';
      })}
      {loggedURLs().map((data, i) => {
        if (data.enable) {
          return (
            <LoggedRoute path={data.path} exact={data.exact} key={i}>
              {data.component}
            </LoggedRoute>
          );
        } else return '';
      })}
      {bookingURLs(bookingProps).map((data: any, i: number) => {
        if (data.enable) {
          return (
            <LoggedRoute path={data.path} exact={data.exact} key={i} bookingProps={bookingProps}>
              {data.component}
            </LoggedRoute>
          );
        } else return '';
      })}
      {testLabURLs().map((data: any, i: number) => {
        if (data.enable) {
          return (
            <LoggedRoute path={data.path} exact={data.exact} key={i}>
              {data.component}
            </LoggedRoute>
          );
        } else return '';
      })}
      {pharmacyDeliveryUrls().map((data: any, i: number) => {
        if (data.enable) {
          return (
            <LoggedRoute path={data.path} exact={data.exact} key={i}>
              {data.component}
            </LoggedRoute>
          );
        } else return '';
      })}
      <Route path="/conversation" exact={true}>
        <ConversationPage />
      </Route>
      <Route path="/oauth/google/callback" exact={true}>
        <LoadPage />
      </Route>
      <Route path="/consultation-start" exact={true}>
        <LoadPage />
      </Route>
      <Route path="*" exact={true}>
        <ErrorPage text={'Halaman Tidak Ditemukan'} />
      </Route>
    </Switch>
  );
};

export default Routes;
