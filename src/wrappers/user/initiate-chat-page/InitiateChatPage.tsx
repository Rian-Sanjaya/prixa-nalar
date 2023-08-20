/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/pulse.scss';
import { getAPI, postAPI } from '../../../api/api-method';
import { BAYMAX_API, BASE_BAYMAX_WIDGET } from '../../../api/api-url';
import { Text, Icon, Sidesheet } from 'prixa-design-kit/dist';
import { CloseModal } from './CloseModal';
import { PulsePage } from './PulsePage';
import { ErrorPage } from '../../diagnostic/ErrorPage';
import { NoDoctor } from './NoDoctor';
import { useParams } from 'react-router-dom';
import './InitialChatPage.scss';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { PatientType } from '../../../api/type';
import { getAppID } from '../../../utils/constant';
import AbandonSidesheet from '../../baymax/AbandonPage';

interface ParamsType {
  inboxId: string;
  websiteToken: string;
}

export const InitiateChatPage = (): JSX.Element => {
  const [showAbandon, setShowAbandon] = React.useState<boolean>(false);
  const { setHeader, setMenu } = useContext(HeaderContext);
  const { inboxId, websiteToken } = useParams<ParamsType>();
  const [closePopup, setPopup] = React.useState(false);
  const [error] = React.useState('');
  const [doctor, setDoctor] = React.useState('');
  const [noDoctor, setNoDoctorBool] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState('');
  const [isChatEnded, setChatEnded] = React.useState(false);
  const count = 1;

  const history = useHistory();

  React.useEffect(() => {
    setHeader('');
    setMenu(false);

    function receiveMessage(message: any): void {
      // listen message only from widget
      if (message.origin === BASE_BAYMAX_WIDGET) {
        const { data } = message;

        // listen message end chat by client event
        if (data.event === 'endChat') {
          setChatEnded(true);
          if (data.type === 'abandon-by-patient') setShowAbandon(true);
          else window.location.href = '/chat-survey';
          // destroy widget iframe
          window.baymaxSDK.destroy();
          setDoctor('');
          document.getElementsByClassName('.woot-widget-holder')[0]?.remove();
        }
        if (data.event === 'newToken') {
          localStorage.setItem('loginToken', data.newToken);
          axios.defaults.headers.common.Authorization = `Bearer ${data.newToken}`;
        }
      }
    }
    // listen all message send
    window.addEventListener('message', receiveMessage, false);
  }, [setHeader, setMenu, inboxId, history]);

  React.useEffect(() => {
    interface InitializeWidgetType {
      transaction_id: string;
      inbox_name: string;
      doctor_f_name: string;
      doctor_l_name?: string;
    }
    /* sequence for initialize chat */
    const initializeWidget = ({
      transaction_id,
      inbox_name,
      doctor_f_name,
      doctor_l_name,
    }: InitializeWidgetType): void => {
      const BASE_URL = BASE_BAYMAX_WIDGET;
      const g = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];
      g.src = BASE_URL + '/sdk.js';
      g.async = true;
      s.parentNode?.insertBefore(g, s);
      g.onload = async function(): Promise<void> {
        window.baymaxSDK.run({
          websiteToken,
          accessToken: localStorage.getItem('loginToken'),
          transactionId: transaction_id,
          baseUrl: BASE_URL,
        });

        const doctorName = `${doctor_f_name || ''}${doctor_l_name ? ' ' + doctor_l_name : ''}`;
        setDoctor(doctorName || 'dokter');

        const { data }: any = await getAPI(BAYMAX_API.DOCTOR_INFO(transaction_id));
        const surveyData = JSON.parse(String(localStorage.getItem('surveyData')));
        surveyData['trxId'] = transaction_id;
        surveyData['doctorName'] = doctorName;
        surveyData['doctorPhoto'] = data.doctor_photo;
        surveyData['hospitalName'] = data.hospital_name;
        surveyData['speciality'] = inbox_name;
        localStorage.setItem('surveyData', JSON.stringify(surveyData));
      };
    };

    const startPolling = (patientId: string, trxId: string): void => {
      const pollingChatInfo = setInterval(() => {
        getAPI(`${BAYMAX_API.CONSUL_INFO}?trx_id=${trxId}`).then(async ({ data: statResp }: any) => {
          if (statResp.state === 'in_progress') {
            getAPI(BAYMAX_API.CONSULTATION(patientId, trxId)).then(async ({ data: consulInfo }: any) => {
              clearInterval(pollingChatInfo);
              initializeWidget({ ...consulInfo[0] });
            });
          }
          if (statResp.state === 'doctor_not_found') {
            clearInterval(pollingChatInfo);
            setNoDoctorBool(true);
          }
        });
      }, 5000);
    };

    const startInitChat = async (): Promise<void> => {
      let isHaveActiveChat;
      let patientId;
      // if patient already pick patient
      if (localStorage.getItem('patientId')) {
        const { data }: any = await getAPI(BAYMAX_API.CONSULTATION(String(localStorage.getItem('patientId'))));
        isHaveActiveChat = data;
        patientId = String(localStorage.getItem('patientId'));
      } else {
        const profileData = JSON.parse(String(localStorage.getItem('profileData')));
        // get list patients from table patient
        const { data: patientInfo }: any = await getAPI(`${BAYMAX_API.PATIENT_INFO}${profileData.id}`);
        const selectedPatient = patientInfo.find(
          (patient: PatientType) => patient.patient_email !== '' && patient.patient_email !== null,
        );
        // check if user have active consultation
        // patient with same email for login
        patientId = selectedPatient.id;

        const { data }: any = await getAPI(BAYMAX_API.CONSULTATION(patientId));
        isHaveActiveChat = data;
      }

      if (isHaveActiveChat?.length > 0) {
        setTransactionId(isHaveActiveChat[0].transaction_id);
        if (isHaveActiveChat[0].state === 'in_progress') {
          initializeWidget({ ...isHaveActiveChat[0] });
        } else {
          startPolling(patientId, isHaveActiveChat[0].transaction_id);
        }
      } else {
        const consultation: any = await postAPI(BAYMAX_API.CONSUL_START, {
          inbox_id: inboxId,
          patient_id: patientId,
          client_app_id: getAppID,
        });
        setTransactionId(consultation.data.trx_id);
        startPolling(patientId, consultation.data.trx_id);
      }
    };

    startInitChat();
  }, [count, inboxId, websiteToken]);

  return (
    <React.Fragment>
      <div
        className="prixa-container is-top is-full is-center"
        style={{ overflowX: 'hidden', position: 'relative', width: '100%', maxWidth: '375px' }}
      >
        {((): JSX.Element => {
          if (doctor && doctor !== '') {
            return (
              <React.Fragment>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '100%',
                    margin: 'none',
                    zIndex: 1000003,
                  }}
                >
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <Text scale="headerTitle">Terhubung dengan {doctor}</Text>
                  </div>
                </div>
                <div style={{ marginTop: '65px', maxWidth: '100%' }}>
                  <PulsePage text="Memuat percakapan..." />
                </div>
              </React.Fragment>
            );
          } else if (error !== '') {
            return (
              <div style={{ paddingTop: '15vh' }}>
                <ErrorPage text={error} />
              </div>
            );
          } else if (noDoctor) {
            return (
              <React.Fragment>
                <NoDoctor />
                <a
                  style={{
                    float: 'right',
                    position: 'relative',
                    top: '-642.047px',
                    paddingRight: '20px',
                  }}
                  href="/"
                >
                  <Icon color="primary" type="times" width="16px" />
                </a>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                <div
                  style={{ textAlign: 'right', paddingRight: '20px', margin: '26px 0px auto auto' }}
                  onClick={(): void => {
                    setPopup(true);
                  }}
                >
                  <Icon color="primary" type="times" width="16px" />
                </div>
                <CloseModal closePopup={closePopup} setPopup={setPopup} transactionId={transactionId} />
                <PulsePage text={isChatEnded ? 'Mengakhiri percakapan..' : undefined} />
              </React.Fragment>
            );
          }
        })()}
        <Sidesheet
          setModal={setShowAbandon}
          show={showAbandon}
          className="prixa-sidesheet"
          style={{ left: 'auto', zIndex: 2147489000 }}
          title={'Konsultasi Berakhir'}
          content={<AbandonSidesheet />}
          link="/"
        ></Sidesheet>
      </div>
    </React.Fragment>
  );
};

export default InitiateChatPage;
