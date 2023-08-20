import { getPartnerID } from '../utils/constant';

const BASE = `${process.env.REACT_APP_API_URL}/api`;
const BASE_INSURANCE = `${process.env.REACT_APP_INSURANCE_URL}/v1`;
const BASE_LABTEST = `${process.env.REACT_APP_LABTEST_URL}/v1/labtest`;
const PARTNER_BASE = `${BASE}/v2/partner`;
const TELEMED_BASE = `${BASE}/v1/telemedicine`;
const HISTORY_BASE = `${BASE}/v1/patients/history`;

export const BASE_BAYMAX_WIDGET = process.env.REACT_APP_BAYMAX_WIDGET;

export const USER_API = {
  REGISTER: `${BASE}/v1/external/users`, // post //patch
  LOGIN: `${BASE}/v1/external/users/login`, // post
  REFRESH: `${BASE}/v1/users/refresh`, // post
  INFO: `${BASE}/v1/external/users/me`, // get
  REGIS_VERIFY: (tokenRegister: string): string => `${BASE}/v1/external/users/${tokenRegister}/verify`, //post
  FORGET_PASSWORD_EMAIL: `${BASE}/v1/external/users/forget-password`, //post //put
  FORGET_VERIFY: (tokenForgetPwd: string): string =>
    `${BASE}/v1/external/users/forget-password/${tokenForgetPwd}/verify`, //get
  RESEND: `${BASE}/v1/external/users/resend/email`, // post
  FORGET_PASSWORD: `${BASE}/v1/external/users/password`, // patch
  CHANGE_PASSWORD: (clientId: string): string => `${BASE}/v1/clients/${clientId}/users/password`, //patch
  UPDATE: (clientId: string, id: string): string => `${BASE}/v1/clients/${clientId}/users/${id}`, //patch
  RATING_FEEDBACKS: `${BASE}/v1/rating-feedbacks`, // GET
  SEND_FEEDBACKS: `${BASE}/v2/consultations/doctor-rating`, // POST
  FAMILY_MEMBER_LIST: (userId: string): string => `${BASE}/v1/patients/user/${userId}`, //get
  ADD_FAMILY_MEMBER: `${BASE}/v1/patients/family`, // post
  FAMILY_MEMBER_DETAIL: (patientId: string): string => `${BASE}/v1/patients/${patientId}/family`, //get
  MODIFY_FAMILY_MEMBER: (patientId: string): string => `${BASE}/v1/patients/${patientId}/family`, //patch
  DELETE_FAMILY_MEMBER: (patientId: string): string => `${BASE}/v1/patients/${patientId}/family`, //delete
  PRECONDITIONS: (patientId: string): string => `${BASE}/v1/preconditions/patient/${patientId}`, //get //post //patch
  ADD_DEPENDENT: `${BASE}/v1/patients/dependencies`, //post
  CONSENT: `${BASE}/v1/nalar/consent`, //get // belum ada
  // UPLOAD_URL: `${BASE}/user/signedurl`, //post //belum ada
  GOOGLE: `${BASE}/v1/user/oauth/google`, //get
};

export const PARTNER_TOKEN = {
  TOKEN: `${BASE}/v2/profile/token`, // post
};

export const BAYMAX_API = {
  CONSULTATION: (patientId: string, trxId?: string): string =>
    `${BASE}/v2/consultations/patient/${patientId}${trxId ? '?trxId=' + trxId : ''}`,
  INBOXES: `${BASE}/v1/clients/${getPartnerID}/inboxes`, //get
  PATIENT_INFO: `${BASE}/v1/patients/user/`, //get /id_from_me
  DOCTOR_INFO: (trxId: string): string => `${BASE}/v2/consultations/doctor-info?trx_id=${trxId}`, //get
  CONSUL_START: `${BASE}/v2/consultations/start`, //post {inbox_id, patient_id}
  CONSUL_CANCEL: `${BASE}/v2/consultations/cancel`, //post {trx_id}
  CONSUL_FINISH: `${BASE}/v2/consultations/finish`, //post {trx_id}
  CONSUL_INFO: `${BASE}/v2/consultations/transaction-info`, //get ?trx_id
  ACTIVE_CONSUL_CHECK: `${BASE}/v2/consultations/patient/`, //get /patientId
  INIT_CHAT: `${BASE}/v1/widgets/init`, //get ?website_token&transaction_id
  CONSULTATION_WITH_PRESCRIPTION: (trxId: string): string =>
    `${BASE}/v2/consultations/transaction-info?trx_id=${trxId}&isWithPrescription=1`, //get
  CONSENT: `${BASE}/v1/patients/consent`, //get
};

export const LABTEST_API = {
  COUPON: `${BASE_LABTEST}/coupon`, // get
};

export const INSURANCE_API = {
  SUBSCRIBE: `${BASE_INSURANCE}/subscribe`, // post
};

export const HISTORY_API = {
  ASSESMENT_HISTORY: `${HISTORY_BASE}/assessment`, // get
  ACTIVITY_HISTORY: `${HISTORY_BASE}/activities`, // get
};

export const DIAGNOSTIC_API = {
  CONVERSATION: `${BASE}/v1/nalar/prixa`, //post
  // USER: `${PRIXA_BASE}/user`, //post
  SEND_EMAIL: `${BASE}/v1/nalar/conversation/mail/send`, //post
  SEND_SURVEY: `${BASE}/v1/nalar/survey`, //post
  FEEDBACK: `${BASE}/v1/nalar/feedback`, //get //post
  DISEASE_ARTICLE: (diseaseId: string): string => `${BASE}/v1/nalar/disease/article/${diseaseId}`, //get
  LOCAL_TRANSMISSION: `${BASE}/v1/nalar/localtransmission`, //get
  ALL_CONTENT: `${BASE}/v1/nalar/contentcard`, //get
  CONTENT: (type: string): string => `${process.env.REACT_APP_API_URL}/v1/contentcard/${type}`, //get
  FORM_COVID: `${BASE}/v1/nalar/covidform`, //post
};

// export const EMAIL_API = {
//   EMAIL_DIAGNOSTIC_RESULT: `${PRIXA_BASE}/email/send`, //post
// };

export const PARTNER_API = {
  PARTNER: `${PARTNER_BASE}`, //post //get
  PARTNER_ID: (partnerId: string): string => `${PARTNER_BASE}/${partnerId}`, //post //put //get
};

export const PARTNER_APP_API = {
  PARTNER_APP: (partnerId: string): string => `${PARTNER_BASE}/${partnerId}/application`, //post //get
  PARTNER_APP_ID: (partnerId: string, applicationId: string): string =>
    `${PARTNER_BASE}/${partnerId}/application/${applicationId}`, //put //delete //get
  PARTNER_APP_META: (partnerId: string, applicationId: string): string =>
    `${PARTNER_BASE}/${partnerId}/application/${applicationId}/metadata`, //put //get
};

export const ANALYTICS_API = {
  TRACK: `${process.env.REACT_APP_API_URL}/v1/analytic/track`, //post
};

export const TELEMED_API = {
  INIT_CONVO: `${TELEMED_BASE}/conversation/init`, //post
};

export const PHARMACY_API = {
  CHECK_PRESCRIPTION: `${process.env.REACT_APP_API_URL}/api/v1/patients/prescriptions`, //get
  PRESCRIPTION_DETAIL: (patientId: string, prescId: string): string =>
    `${BASE}/v1/patients/${patientId}/prescriptions/${prescId}`,
};

export const BOOKING_API = {
  AREAS: `${TELEMED_BASE}/area`, //get
  AREA: (areaId: string): string => `${TELEMED_BASE}/area/${areaId}`, //get
  SPECIALITIES: `${TELEMED_BASE}/speciality`, //get
  HOSPITALS: `${TELEMED_BASE}/hospital`, //get
  DOCTORS: `${TELEMED_BASE}/doctor`, //get
  SCHEDULE: (hospitalId: string, doctorId: string): string =>
    `${TELEMED_BASE}/schedules/hospital/${hospitalId}/doctor/${doctorId}?page=1`, // get
  TIME_SLOT: (hospitalId: string, doctorId: string, appointmentDate: string): string =>
    `${TELEMED_BASE}/timeslot/hospital/${hospitalId}/doctor/${doctorId}/appointment-date/${appointmentDate}`, // get
  CREATE_APPOINTMENT: `${TELEMED_BASE}/appointment`, //post
  PAYMENT_METHOD: `${TELEMED_BASE}/payment-method`, //get
};
