import React, { lazy } from 'react';

import { AskMethod } from '../wrappers/diagnostic/AskMethodPage';
import { Consent, ConsentAccept, ConsentRejectConfirmation, ConsentReject } from '../wrappers/diagnostic/ConsentPage';
import { ResetPasswordPage, ResetPasswordSuccessPage } from '../wrappers/user/reset-password-page/ResetPasswordPage';
import ArticlePage from '../wrappers/diagnostic/ArticlePage';
import SummaryPage from '../wrappers/diagnostic/SummaryPage';
import {
  showUserManagement,
  showTelemedFeature,
  showBookingeature,
  showPharmacyFeature,
  showLabFeature,
} from '../utils/constant';
import { FilterDataType } from '../wrappers/booking/FilterPage';
import { SpecialityType } from '../wrappers/booking/landing-page/SpecialitiesSection';
import { BookingContext } from '../wrappers/booking/booking-page/BookingContext';
import { sessionId } from '../api/api-utils';
import { OperationalHoursNotice } from '../wrappers/pharmacy-delivery/OperationalHoursNotice';
import { PrescriptionNotFoundNotice } from '../wrappers/pharmacy-delivery/PrescriptionNotFoundNotice';
import { PharmacyInvoice } from '../wrappers/pharmacy-delivery/history/PharmacyInvoice';
import { OrderDetail } from '../wrappers/pharmacy-delivery/history/OrderDetail';
import { OrderStatus } from '../wrappers/pharmacy-delivery/history/OrderStatus';
import { EPrescriptionDetail } from '../wrappers/user/diagnosis-history-page/e-prescription/EPrescriptionDetail';
import { SurveySentPage } from '../wrappers/baymax/SurveySentPage';
import { PharmacyDeliveryPage } from '../wrappers/pharmacy-delivery/PharmacyDeliveryPage';
import { ConsultationConsent, ConsultationConsentReject } from '../wrappers/baymax/ConsentPage';

const IntroPage = lazy(() => import('../wrappers/diagnostic/IntroPage'));
const ProfilePage = lazy(() => import('../wrappers/user/ProfilePage'));
const ChangePasswordPage = lazy(() => import('../wrappers/user/change-password-page/ChangePasswordPage'));
const ChangePasswordSuccess = lazy(() => import('../wrappers/user/change-password-page/ChangePasswordSuccess'));
const HealthInformation = lazy(() => import('../wrappers/user/health-info-page/HealthInformation'));
const DiagnosisHistoryPage = lazy(() => import('../wrappers/user/diagnosis-history-page/DiagnosisHistoryPage'));
const EPrescriptionPage = lazy(() =>
  import('../wrappers/user/diagnosis-history-page/e-prescription/EPrescriptionPage'),
);
const PersonalInformationPage = lazy(() =>
  import('../wrappers/user/personal-information-page/PersonalInformationPage'),
);

const ConversationPage = lazy(() => import('../wrappers/diagnostic/ConversationPage'));

const VerificationCheckPage = lazy(() => import('../wrappers/user/VerificationCheckPage'));
const VerificationSentPage = lazy(() => import('../wrappers/user/VerificationPage'));
const InitiateChatPage = lazy(() => import('../wrappers/user/initiate-chat-page/InitiateChatPage'));
const ChatSurvey = lazy(() => import('../wrappers/baymax/ChatSurvey'));
const LoginPage = lazy(() => import('../wrappers/user/login-page/LoginPage'));
const SignUpPage = lazy(() => import('../wrappers/user/sign-up-page/SignUpPage'));

const BookingLandingPage = lazy(() => import('../wrappers/booking/landing-page'));
const SearchDoctorPage = lazy(() => import('../wrappers/booking/SearchDoctorPage'));
const FilterPage = lazy(() => import('../wrappers/booking/FilterPage'));

const BookingDatePage = lazy(() => import('../wrappers/booking/booking-page/BookingDatePage'));
const BookingTimePage = lazy(() => import('../wrappers/booking/booking-page/BookingTimePage'));
const BookingDataPage = lazy(() => import('../wrappers/booking/booking-page/BookingDataPage'));
const BookingConfirmationPage = lazy(() => import('../wrappers/booking/booking-page/BookingConfirmationPage'));
const BookingSummaryPage = lazy(() => import('../wrappers/booking/booking-page/BookingSummaryPage'));
const AllSpecialityPage = lazy(() => import('../wrappers/booking/landing-page/AllSpecialityPage'));
const AllHospitalPage = lazy(() => import('../wrappers/booking/landing-page/AllHospitalPage'));
const HospitalPage = lazy(() => import('../wrappers/booking/landing-page/HospitalPage'));

const InboxPicker = lazy(() => import('../wrappers/baymax/InboxPicker'));
const AllInboxes = lazy(() => import('../wrappers/baymax/AllInboxes'));

const FamilyMember = lazy(() => import('../wrappers/user/family-member/FamilyMember'));
const AddFamilyMember = lazy(() => import('../wrappers/user/family-member/AddFamilyMember'));
const AddFamilyHealthInfo = lazy(() => import('../wrappers/user/family-member/AddFamilyHealthInfo'));
const ModifyFamilyMember = lazy(() => import('../wrappers/user/family-member/ModifyFamilyMember'));

/* eslint-disable */
const TestLab = lazy(() => import('../wrappers/testLab'));
const CouponPage = lazy(() => import('../wrappers/testLab/CouponPage'));

interface SetBookingProps {
  doctorData?: any;
  setDoctorData?: any;
  date?: any;
  setDate?: any;
  time?: any;
  setTime?: any;
  bookingData?: any;
  setBookingData?: any;
  allSpecialities?: Array<SpecialityType> | undefined;
  setAllSpecialities?: (data: any) => void;
  filterData?: FilterDataType;
  setFilterData?: (data: any) => void;
}
/* eslint-enable */

interface URLRoute {
  path: string;
  exact?: boolean;
  enable: boolean;
  component: JSX.Element;
}

export const testLabURLs = () => [
  {
    path: '/testlab',
    exact: true,
    enable: showLabFeature(),
    component: <TestLab />,
  },
  {
    path: '/coupon',
    exact: true,
    enable: showLabFeature(),
    component: <CouponPage />,
  },
];

export const pharmacyDeliveryUrls = () => [
  {
    path: '/pharmacy-delivery',
    exact: true,
    enable: showPharmacyFeature() ? true : false,
    component: <PharmacyDeliveryPage />,
  },
  {
    path: '/operational-hours-notice',
    exact: true,
    enable: showPharmacyFeature() ? true : false,
    component: <OperationalHoursNotice />,
  },
  {
    path: '/prescription-not-found',
    exact: true,
    enable: showPharmacyFeature() ? true : false,
    component: <PrescriptionNotFoundNotice />,
  },
];

export const bookingURLs = ({
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
}: SetBookingProps): Array<URLRoute> => [
  {
    path: '/booking',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ setDoctorData, setDate, setTime, setBookingData, filterData, setFilterData }}>
        <BookingLandingPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/all-speciality',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ allSpecialities, setAllSpecialities, filterData, setFilterData }}>
        <AllSpecialityPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/all-hospital',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ filterData, setFilterData }}>
        <AllHospitalPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/hospital/:hospitalName',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ setFilterData, setAllSpecialities }}>
        <HospitalPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/filter',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ filterData, setFilterData, allSpecialities, setAllSpecialities }}>
        <FilterPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/search-doctor',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ filterData, setDoctorData, allSpecialities }}>
        <SearchDoctorPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/booking-date',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ doctorData, setDoctorData, date, setDate, time, setTime }}>
        <BookingDatePage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/booking-time',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ doctorData, date, time, setTime }}>
        <BookingTimePage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/booking-data',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ doctorData, date, time, setBookingData, bookingData }}>
        <BookingDataPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/booking-confirmation',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: (
      <BookingContext.Provider value={{ doctorData, date, time, bookingData }}>
        <BookingConfirmationPage />
      </BookingContext.Provider>
    ),
  },
  {
    path: '/booking-summary',
    exact: true,
    enable: showBookingeature() ? true : false,
    component: <BookingSummaryPage />,
  },
];

export const loggedURLs = (): Array<URLRoute> => [
  {
    path:
      localStorage.getItem('telemedicineSDKURL') === ''
        ? '/initiate/inboxId/:inboxId/websiteToken/:websiteToken'
        : `${localStorage.getItem('telemedicineSDKURL')}?sessionID=${sessionId}`,
    exact: true,
    enable: showTelemedFeature() ? true : false,
    component: <InitiateChatPage />,
  },
  {
    path: '/chat-survey',
    exact: true,
    enable: showTelemedFeature() ? true : false,
    component: <ChatSurvey />,
  },
  {
    path: '/feedback-sent',
    exact: true,
    enable: showTelemedFeature() ? true : false,
    component: <SurveySentPage />,
  },
  {
    path: '/profile',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <ProfilePage />,
  },
  {
    path: '/personal-information',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <PersonalInformationPage />,
  },
  {
    path: '/change-password',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <ChangePasswordPage />,
  },
  {
    path: '/change-password-success',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <ChangePasswordSuccess />,
  },
  {
    path: '/diagnosis-history/:tab',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <DiagnosisHistoryPage />,
  },
  {
    path: '/diagnosis-history/eprescription/:id',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <EPrescriptionPage />,
  },
  {
    path: '/diagnosis-history/eprescription/detail/patientid/:patientid/prescid/:prescid',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <EPrescriptionDetail />,
  },
  {
    path: '/pharmacy-delivery/detail/:id',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <OrderDetail />,
  },
  {
    path: '/pharmacy-delivery/status/:id',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <OrderStatus />,
  },
  {
    path: '/pharmacy-delivery/invoice/:id',
    exact: true,
    enable: showUserManagement() ? true : false,
    component: <PharmacyInvoice />,
  },
  {
    path: '/precondition-info',
    exact: true,
    enable: true,
    component: <HealthInformation />,
  },
  {
    path: '/preconsultation',
    exact: true,
    enable: true,
    component: <InboxPicker />,
  },
  {
    path: '/preconsultation-all-inbox',
    exact: true,
    enable: true,
    component: <AllInboxes />,
  },
  {
    path: '/family-member',
    exact: true,
    enable: true,
    component: <FamilyMember />,
  },
  {
    path: '/add-family-member',
    exact: true,
    enable: true,
    component: <AddFamilyMember />,
  },
  {
    path: '/add-family-health-info',
    exact: true,
    enable: true,
    component: <AddFamilyHealthInfo />,
  },
  {
    path: '/modify-family-member',
    exact: true,
    enable: true,
    component: <ModifyFamilyMember />,
  },
  {
    path: '/tnc',
    exact: true,
    enable: true,
    component: <ConsultationConsent />,
  },
  {
    path: '/tnc-reject',
    exact: true,
    enable: true,
    component: <ConsultationConsentReject />,
  },
];

export const regisSign = [
  {
    path: '/ask-method',
    exact: true,
    enable: true,
    component: <AskMethod />,
  },
  {
    path: '/login',
    exact: true,
    enable: true,
    component: <LoginPage />,
  },
  {
    path: '/sign-up',
    exact: true,
    enable: true,
    component: <SignUpPage />,
  },
  {
    path: '/verification-sent',
    exact: true,
    enable: true,
    component: <VerificationSentPage />,
  },
  {
    path: '/reset-password/:tokenPassword',
    exact: true,
    enable: true,
    component: <ResetPasswordPage />,
  },
  {
    path: '/reset-password-sent',
    exact: true,
    enable: true,
    component: <ResetPasswordSuccessPage />,
  },
  {
    path: '/verification-check/:tokenVerify',
    exact: true,
    enable: true,
    component: <VerificationCheckPage />,
  },
  {
    path: '/unverified',
    exact: true,
    enable: true,
    component: <VerificationCheckPage />,
  },
];

export const diagnosisEngine = (): Array<URLRoute> => [
  {
    path: '/',
    exact: true,
    enable: true,
    component: <IntroPage />,
  },
  {
    path: '/consent',
    exact: true,
    enable: true,
    component: <Consent />,
  },
  {
    path: '/consent-reject-confirmation',
    exact: true,
    enable: true,
    component: <ConsentRejectConfirmation />,
  },
  {
    path: '/consent-reject',
    exact: true,
    enable: true,
    component: <ConsentReject />,
  },
  {
    path: '/conversation',
    exact: true,
    enable: true,
    component: <ConversationPage />,
  },
  {
    path: '/article/:id',
    exact: true,
    enable: true,
    component: <ArticlePage />,
  },
  {
    path: '/summary',
    exact: true,
    enable: true,
    component: <SummaryPage />,
  },
  {
    path: '/consent-accept',
    exact: true,
    enable: true,
    component: <ConsentAccept />,
  },
];
