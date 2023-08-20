import React from 'react';
import '../../../styles/pulse.scss';
import { Chat } from '../../../components/chat/Chat';
import { postAPI } from '../../../api/api-method';
import { TELEMED_API } from '../../../api/api-url';
import { Text, Icon } from 'prixa-design-kit/dist';
import { CloseModal } from './CloseModal';
import { PulsePage } from './PulsePage';
import { ErrorPage } from '../../diagnostic/ErrorPage';
import { NoDoctor } from './NoDoctor';
import { firstLetterToUpperCase } from '../../../utils/stringFunction';
import './InitialChatPage.scss';

export const InitiateChatPage = () => {
  /* eslint-disable */
  let tempOperator = '';
  const [vh, setVh] = React.useState(0);
  const [closePopup, setPopup] = React.useState(false);
  const [error, setError] = React.useState('');
  const [operator, setOperator] = React.useState('');
  const [noDoctor, setNoDoctorBool] = React.useState(false);
  const count = 1;

  let clrTimeout: any;

  React.useEffect(() => {
    setVh(window.innerHeight * 0.01);

    window.addEventListener('resize', () => {
      clearTimeout(clrTimeout);
      clrTimeout = setTimeout(() => {
        setVh(window.innerHeight * 0.01);
      }, 300);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setVh(window.innerHeight * 0.01);
      })
    }
  }, []);

  React.useEffect(() => {
    const checkOperator = () => {
      const chatOpen = () => {
        if (document.getElementsByClassName('crisp-1uw6f17 crisp-1ynli6s crisp-12w1xmh')[0]) {
          tempOperator = String(
            document.getElementsByClassName('crisp-1uw6f17 crisp-1ynli6s crisp-12w1xmh')[0].innerHTML,
          );
          if (tempOperator && tempOperator !== '') {
            document.getElementsByClassName('crisp-1784wh6')[0] &&
              document.getElementsByClassName('crisp-1784wh6')[0].remove();
            window.$crisp.push(['do', 'chat:show']);
            window.$crisp.push(['do', 'chat:open']);
            setOperator(tempOperator);
            setTimeout(() => {
              document.getElementsByClassName('crisp-client')[0].setAttribute('style', 'display: block');
            }, 100);
            /* eslint-disable */
            clearTimeout(refreshTimeout);
            clearInterval(refreshInterval);
            /* eslint-enable */
          }
        }
      };

      if (
        typeof window.$crisp.get === 'function' &&
        window.$crisp.get('session:identifier') &&
        localStorage.getItem('sessionID') !== window.$crisp.get('session:identifier')
      ) {
        postAPI(
          TELEMED_API.INIT_CONVO,
          {
            diagnosticSessionID: localStorage.getItem('DiagnosisID'),
            sessionID: window.$crisp.get('session:identifier'),
          },
          undefined,
        )
          .then(() => {
            localStorage.setItem('sessionID', window.$crisp.get('session:identifier'));
            chatOpen();
          })
          .catch((err: any) => {
            /* eslint-disable */
            clearTimeout(refreshTimeout);
            clearInterval(refreshInterval);
            /* eslint-enable */

            if (
              localStorage.getItem('DiagnosisID') === '' ||
              !localStorage.getItem('DiagnosisID') ||
              JSON.stringify(err.response.data).includes('not found diagnosisResult')
            ) {
              setError('Lakukan diagnosis terlebih dahulu!');
              setTimeout(() => {
                window.location.href = '/';
              }, 3000);
            } else if (
              localStorage.getItem('DiagnosisID') &&
              localStorage.getItem('DiagnosisID') !== '' &&
              err.response.data.message.includes('key not found diagnostic_diagnosisResult:')
            ) {
              setError('Sesi Anda telah habis. Lakukan diagnosa terlebih dahulu');
              setTimeout(() => {
                window.location.href = '/';
              }, 3000);
            } else {
              setError(
                firstLetterToUpperCase(
                  err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
                    ? err.response.data.details[0].metadata.errInd
                    : 'Gangguan sistem, mohon coba kembali.',
                ),
              );
            }
          });
      } else if (document.getElementsByClassName('crisp-client').length) {
        chatOpen();
      }
    };
    const refreshInterval = setInterval(checkOperator, 2500);

    const setNoDoctor = () => {
      clearInterval(refreshInterval);
      setNoDoctorBool(true);
    };

    const refreshTimeout = setTimeout(setNoDoctor, 60000);

    checkOperator();
  }, [count]);
  /* eslint-enable */

  return (
    <div
      className="prixa-container is-top is-full is-center"
      style={{ overflowX: 'hidden', position: 'relative', width: '100%', maxWidth: '375px' }}
    >
      {(() => {
        if (operator && operator !== '') {
          return (
            <React.Fragment>
              <div
                style={{
                  display: 'flex',
                  width: 'inherit',
                  maxWidth: 'inherit',
                  margin: 'none',
                  zIndex: 1000003,
                  position: 'fixed',
                  top: 0,
                }}
              >
                <div style={{ flex: 1, marginLeft: '26px' }}>
                  <Text scale="headerTitle">{operator}</Text>
                </div>
                <div
                  style={{ textAlign: 'right', paddingRight: '20px' }}
                  onClick={() => {
                    setPopup(true);
                  }}
                >
                  <Icon color="primary" type="times" width="16px" />
                </div>
              </div>
              <CloseModal closePopup={closePopup} setPopup={setPopup} />
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
                href="/home"
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
                onClick={() => {
                  setPopup(true);
                }}
              >
                <Icon color="primary" type="times" width="16px" />
              </div>
              <CloseModal closePopup={closePopup} setPopup={setPopup} />
              <PulsePage />
            </React.Fragment>
          );
        }
      })()}
      <Chat vh={vh} />
    </div>
  );
};

export default InitiateChatPage;
