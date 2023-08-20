// import { parse } from 'react';
import { parse } from './query-parser';
import moment from 'moment';

declare let MessageHandlers: any;

export const urlValidation = () => {
  try {
    if (
      window.location.search === '' &&
      window.location.pathname.includes('partner/') &&
      window.location.pathname.includes('/app/')
    ) {
      const isAuthExists = window.location.pathname.includes('/auth/');
      let partnerAuth;
      if (isAuthExists) {
        partnerAuth = String(window.location.pathname.split('/auth/')[1]);
        localStorage.setItem('partnerAuth', partnerAuth);
      } else {
        localStorage.removeItem('partnerAuth');
      }
      return {
        partnerId: String(window.location.pathname.split('partner/')[1].split('/app/')[0]),
        appId: window.location.pathname.includes('/uid/')
          ? String(window.location.pathname.split('/app/')[1].split('/uid')[0])
          : String(window.location.pathname.split('/app/')[1].split('/auth')[0]),
        partnerAuth: partnerAuth,
      };
    } else if (
      window.location.search !== '' &&
      window.location.search.includes('pId=') &&
      window.location.search.includes('appId=')
    ) {
      const { pid, appid, auth } = parse(window.location.search);
      if (auth) {
        localStorage.setItem('partnerAuth', auth);
      } else {
        localStorage.removeItem('partnerAuth');
      }
      return { partnerId: pid, appId: appid, partnerAuth: auth };
    } else if (
      localStorage.getItem('getPartnerID') &&
      localStorage.getItem('getAppID') &&
      localStorage.getItem('getPartnerID') !== '' &&
      localStorage.getItem('getAppID') !== ''
    ) {
      return {
        partnerId: String(localStorage.getItem('getPartnerID')),
        appId: String(localStorage.getItem('getAppID')),
      };
    } else {
      return { partnerId: '', appId: '' };
    }
  } catch {
    return { partnerId: '', appId: '' };
  }
};

export const getUIDParam = () => {
  if (window.location.search === '' && window.location.pathname.includes('/uid/')) {
    return window.location.pathname.includes('/auth/')
      ? String(window.location.pathname.split('/uid/')[1]).split('/auth/')[0]
      : String(window.location.pathname.split('/uid/')[1]);
  } else if (window.location.search !== '' && window.location.search.includes('&uid=')) {
    return window.location.search.includes('&auth=')
      ? String(window.location.search.split('&uid=')[1]).split('&auth=')[0]
      : String(window.location.search.split('&uid=')[1]);
  } else if (localStorage.getItem('getUID') !== '') {
    return String(localStorage.getItem('getUID'));
  } else {
    return '';
  }
};

export const getPartnerAuth = urlValidation().partnerAuth;

export const getPartnerID = urlValidation().partnerId;

export const getAppID = urlValidation().appId;

export const getUID = getUIDParam();

export const isCovid = localStorage.getItem('isCovid') === '1';

export const getPartnerAuthStorage = localStorage.getItem('partnerAuth');

export const getSurveyData = JSON.parse(String(localStorage.getItem('surveyData')));

export const resetConversation = () => {
  localStorage.removeItem('sesId');
  localStorage.removeItem('patientId');
  localStorage.removeItem('previousState');
};

export const removeBookingAppointmentData = () => {
  localStorage.removeItem('bookingAppointmentData');
};

export const logOut = () => {
  resetConversation();
  removeBookingAppointmentData();
  localStorage.removeItem('loginToken');
  localStorage.removeItem('profileData');
  localStorage.removeItem('isVerified');
  localStorage.removeItem('patientData');
  localStorage.removeItem('DiagnosisID');
};

let theme: any = {
  partnerLogo: '',
};

export const partnerTheme = {
  get: () => {
    return theme;
  },
  set: (data: any) => {
    theme.partnerLogo = (data && data.partnerLogo) || undefined;
    theme = {
      ...theme,
      ...data,
    };
  },
};

let telemedicine = false;
let article = false;
let pharmacyDelivery = false;
let prescriptionClaim = false;
let labTest = false;
let appointmenBooking = false;
let carl = false;
let insuranceBanner = false;

export const setAncillary = (data: any) => {
  telemedicine = data.telemedicine;
  article = data.article;
  pharmacyDelivery = data.pharmacyDelivery;
  prescriptionClaim = data.prescriptionClaim;
  labTest = data.labTest;
  appointmenBooking = data.appointmenBooking;
  carl = data.insurance;
  insuranceBanner = data.insuranceBanner;
};

export const showUserManagement = () => {
  if (
    telemedicine ||
    pharmacyDelivery ||
    prescriptionClaim ||
    labTest ||
    appointmenBooking ||
    carl ||
    insuranceBanner
  ) {
    return true;
  } else {
    return false;
  }
};

export const showTelemedFeature = () => {
  if (telemedicine) {
    return true;
  } else {
    return false;
  }
};

export const showBookingeature = () => {
  if (appointmenBooking) {
    return true;
  } else {
    return false;
  }
};

export const showArticleFeature = () => {
  if (article) {
    return true;
  } else {
    return false;
  }
};

export const showPharmacyFeature = () => {
  if (pharmacyDelivery) {
    return true;
  } else {
    return false;
  }
};

export const showPrescriptionClaimFeature = () => {
  if (prescriptionClaim) {
    return true;
  } else {
    return false;
  }
};

export const showLabFeature = () => {
  if (labTest) {
    return true;
  } else {
    return false;
  }
};

export const showInsuranceFeature = () => {
  if (insuranceBanner) {
    return true;
  } else {
    return false;
  }
};

export const getGenderList = [
  { type: 'gender', nameIndo: 'Laki-laki', name: 'Male' },
  { type: 'gender', nameIndo: 'Perempuan', name: 'Female' },
];

export const getYear = (datetime: string) => datetime.substring(0, 4);
export const getMonth = (datetime: string) => datetime.substring(5, 7);
export const getMonthNameShort = (datetime: Date) => moment(datetime, 'YYYY-MM-DD').format('MMM');
export const getMonthNameLong = (datetime: Date) => moment(datetime, 'YYYY-MM-DD').format('MMMM');
export const getDate = (datetime: string) => datetime.substring(8, 10);
export const getFullDate = (datetime: Date) => moment(datetime, 'YYYY-MM-DD').format('DD MMMM YYYY');

export const getHoursMinutes = (datetime: Date) =>
  moment(datetime, 'YYYY-MM-DD HH:mm:ss')
    .add(7, 'hours')
    .format('HH:mm');

export const formattedCurrency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export const closeSeamlessLogin = () => {
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'prixa-close-app' }));

  if (window.parent) window.parent.postMessage({ event: 'prixa-close-app' }, '*');

  if (window.webkit?.messageHandlers?.prixaMessageHandler)
    window.webkit.messageHandlers.prixaMessageHandler.postMessage(JSON.stringify({ event: 'prixa-close-app' }));

  if (/android/i.test(window.navigator.userAgent)) {
    MessageHandlers.prixaMessageHandler(JSON.stringify({ event: 'prixa-close-app' }));
  }

  if (window.opener) {
    window.close();
  }
};
