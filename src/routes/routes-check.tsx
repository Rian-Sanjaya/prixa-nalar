import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { LoadPage } from '../wrappers/diagnostic/LoadPage';
import { getAPI, signal } from '../api/api-method';
import { USER_API } from '../api/api-url';
import moment from 'moment';
import { logOut } from '../utils/constant';

// AfterDiagnose Routes = Diagnosis ID is needed.
// Routes throw error page asking user to do diagnosis first (if NOT LOG IN)
// Routes redirect to home (if LOG IN)

export const AfterDiagnoseRoute = ({ component: Component, ...rest }: any): JSX.Element => {
  const [routeState, setRouteState] = React.useState('load');

  const inPath = ['/verification-check/', '/verification-sent', '/reset-password/', '/reset-password-sent'];
  const regInPath = new RegExp(inPath.join('|'), 'i');
  const isInPath = regInPath.test(window.location.pathname);

  useEffect(() => {
    if (localStorage.getItem('loginToken') && localStorage.getItem('isVerified') === 'true') {
      getAPI(USER_API.INFO)
        .then(() => {
          setRouteState('login');
        })
        .catch(() => {
          setRouteState('not-login');
        });
    } else {
      setRouteState('not-login');
    }
  }, []);

  if (routeState === 'load') {
    return <LoadPage />;
  } else if (routeState === 'login' && !isInPath) {
    if (window.location.pathname === '/ask-method') {
      return <Redirect to="/conversation" />;
    } else return <Redirect to="/" />;
  } else {
    return <Route {...rest} component={Component} />;
  }
};

// Logged Routes = User need to be logged to access pages
export const LoggedRoute = ({ ...rest }: any): JSX.Element => {
  const [routeState, setRouteState] = React.useState('load');

  /* eslint-disable */
  React.useEffect(() => {
    getAPI(USER_API.INFO)
      .then((res: any) => {
        localStorage.setItem('profileData', JSON.stringify(res));
        const isBookingDatePage = rest.path === '/booking-date';
        const isBookingTimePageValid = rest.path === '/booking-time';
        const isBookingDataPageValid = rest.path === '/booking-data';
        const isBookingConfirmationPageValid = rest.path === '/booking-confirmation';

        if (isBookingDatePage || isBookingTimePageValid || isBookingDataPageValid || isBookingConfirmationPageValid) {
          if (localStorage.getItem('bookingAppointmentData')) {
            const doctorDataLocalStorage = JSON.parse(String(localStorage.getItem('bookingAppointmentData'))).doctorData
              ? JSON.parse(String(localStorage.getItem('bookingAppointmentData'))).doctorData
              : {};
            const bookingDateLocalStorage = moment(
              String(JSON.parse(String(localStorage.getItem('bookingAppointmentData'))).bookingDate),
            ).isValid()
              ? new Date(JSON.parse(String(localStorage.getItem('bookingAppointmentData'))).bookingDate)
              : null;
            const bookingTimeLocalStorage = JSON.parse(String(localStorage.getItem('bookingAppointmentData')))
              .bookingTime
              ? JSON.parse(String(localStorage.getItem('bookingAppointmentData'))).bookingTime
              : {};
            const bookingDataLocalStorage = JSON.parse(String(localStorage.getItem('bookingAppointmentData')))
              .bookingData
              ? JSON.parse(String(localStorage.getItem('bookingAppointmentData'))).bookingData
              : {};

            if (isBookingDatePage) {
              if (doctorDataLocalStorage !== {}) {
                rest.bookingProps.setDoctorData(doctorDataLocalStorage);
                rest.bookingProps.setDate(bookingDateLocalStorage);
              } else {
                setRouteState('booking');
              }
            }

            if (isBookingTimePageValid) {
              if (moment(String(bookingDateLocalStorage)).isValid()) {
                rest.bookingProps.setDoctorData(doctorDataLocalStorage);
                rest.bookingProps.setDate(bookingDateLocalStorage);
                rest.bookingProps.setTime(bookingTimeLocalStorage);
              } else {
                setRouteState('booking');
              }
            }

            if (isBookingDataPageValid) {
              if (moment(String(bookingDateLocalStorage)).isValid() && bookingTimeLocalStorage !== {}) {
                rest.bookingProps.setDoctorData(doctorDataLocalStorage);
                rest.bookingProps.setDate(bookingDateLocalStorage);
                rest.bookingProps.setTime(bookingTimeLocalStorage);
                rest.bookingProps.setBookingData(bookingDataLocalStorage);
              } else {
                setRouteState('booking');
              }
            }

            if (isBookingConfirmationPageValid) {
              if (
                moment(String(bookingDateLocalStorage)).isValid() &&
                bookingTimeLocalStorage !== {} &&
                bookingDataLocalStorage !== {}
              ) {
                rest.bookingProps.setDoctorData(doctorDataLocalStorage);
                rest.bookingProps.setDate(bookingDateLocalStorage);
                rest.bookingProps.setTime(bookingTimeLocalStorage);
                rest.bookingProps.setBookingData(bookingDataLocalStorage);
              } else {
                setRouteState('booking');
              }
            }
          } else {
            setRouteState('booking');
          }
        }
        setRouteState('verified');
      })
      .catch(() => {
        setRouteState('');
        logOut();
        return <Redirect to={{ pathname: '/login' }} />
      });
    signal.cancel('');
  }, []);
  /* eslint-ensable */
  if (routeState === 'load') {
    return <Route path={rest.path} component={LoadPage} />;
  } else if (routeState === 'verified') {
    return <Route path={rest.path}>{rest.children}</Route>;
  } else if (routeState === 'booking') {
    return <Redirect to="/booking" />;
  } else {
    return <Redirect to={{ pathname: '/login' }} />
  }
};
