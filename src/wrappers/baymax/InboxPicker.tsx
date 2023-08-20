/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react';
import { HeaderContext } from '../../components/header/HeaderContext';
import { FormLabel, Button, Link, SearchBox } from 'prixa-design-kit/dist';
import { getAPI, signal } from '../../api/api-method';
import { BAYMAX_API } from '../../api/api-url';
import { useHistory } from 'react-router-dom';
import { LoadPage } from '../diagnostic/LoadPage';
import { ErrorPage } from '../diagnostic/ErrorPage';
import { PatientType } from '../../api/type';
import { isCovid } from '../../utils/constant';

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;

export interface InboxType {
  id: string;
  name: string;
  website_token: string;
}

interface SearchBoxType {
  id?: string;
  value: string;
  text: string;
  icon?: string;
  websiteToken?: string;
}
export const InboxPicker = (): JSX.Element => {
  const { setHeader, setMenu } = useContext(HeaderContext);
  const [specialitiesValue, setspecialitiesValue] = React.useState<string | undefined>('');
  const [specialitiesText, setspecialitiesText] = React.useState<string>('');
  const [websiteTokenValue, setWebsiteTokenValue] = React.useState<string | undefined>('');
  const [processing, setProcessing] = React.useState<boolean>(true);
  const [options, setOptions] = React.useState<Array<SearchBoxType>>([]);
  const [mostFind, setMostFind] = React.useState<Array<SearchBoxType>>([]);
  const [error, setError] = React.useState('');
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem('DiagnosisID')) {
      setError('Lakukan Prixa Sekarang terlebih dahulu!');
    } else {
      window.scrollTo(0, 0);
      setHeader('Pilih Spesialisasi');
      setMenu(false);
    }
  }, [setMenu, setHeader, history]);

  useEffect(() => {
    const checkActiveChat = async (): Promise<void> => {
      let isHaveActiveChat;
      // if patient already pick patient
      if (localStorage.getItem('patientId')) {
        const { data }: any = await getAPI(BAYMAX_API.CONSULTATION(String(localStorage.getItem('patientId'))));
        isHaveActiveChat = data;
      } else {
        const profileData = JSON.parse(String(localStorage.getItem('profileData')));
        // get list patients from table patient
        const { data: patientInfo }: any = await getAPI(`${BAYMAX_API.PATIENT_INFO}${profileData.id}`);
        const selectedPatient = patientInfo.find(
          (patient: PatientType) => patient.patient_email !== '' && patient.patient_email !== null,
        );
        // check if user have active consultation
        // patient with same email for login
        const { data }: any = await getAPI(BAYMAX_API.CONSULTATION(selectedPatient.id));
        isHaveActiveChat = data;
      }

      if (isHaveActiveChat?.length > 0) {
        const link = `/initiate/inboxId/${isHaveActiveChat[0].inbox_id}/websiteToken/${isHaveActiveChat[0].website_token}`;
        signal.cancel('');
        history.push(link);
      } else {
        getAPI(`${BAYMAX_API.INBOXES}?limit=5`).then((resp: any) => {
          const resultList: Array<SearchBoxType> = [];
          if (resp.data) {
            resp.data.every((res: InboxType, i: number) => {
              if (i < 5) {
                resultList.push({
                  id: res.id,
                  value: res.id,
                  text: res.name,
                  websiteToken: res.website_token,
                  icon: `${baseIconURL}Icon ${res.name}-min.png`,
                });
                return true;
              } else return false;
            });
          }
          setProcessing(false);
          setMostFind(resultList);
        });
      }
    };
    checkActiveChat();

    return (): void => {
      signal.cancel('');
    };
  }, [history]);

  const searchContent = async (value: string): Promise<void> => {
    getAPI(`${BAYMAX_API.INBOXES}?speciality_name=${value}`).then((resp: any) => {
      let resultList: Array<SearchBoxType> = [];
      if (resp.data) {
        resultList = resp.data.map((res: InboxType) => ({
          id: res.id,
          value: res.id,
          text: res.name,
          websiteToken: res.website_token,
          icon: `${baseIconURL}Icon ${res.name}-min.png`,
        }));
      }
      setOptions(resultList);
    });
  };

  const selectSpeciality = ({
    value,
    websiteToken,
  }: {
    value?: string;
    text?: string;
    websiteToken?: string;
  }): void => {
    setWebsiteTokenValue(websiteToken);
    setspecialitiesValue(value);
  };

  const clearSpeciality = (): void => {
    setspecialitiesText('');
    setspecialitiesValue('');
    setWebsiteTokenValue('');
  };

  const startConversation = (): void => {
    localStorage.setItem(
      'surveyData',
      JSON.stringify({
        speciality: specialitiesText,
      }),
    );
    const link = `/initiate/inboxId/${specialitiesValue}/websiteToken/${websiteTokenValue}`;
    signal.cancel('');
    history.push(link);
  };

  if (processing) return <LoadPage />;
  if (error !== '') {
    const goTo = '/ask-method';
    let goToString = '';
    if (isCovid) {
      goToString = 'Prixa Gejala';
    } else {
      goToString = 'Prixa Sekarang';
    }
    return (
      <div>
        <ErrorPage text={error} goTo={goTo} goToString={goToString} />
      </div>
    );
  }
  return (
    <div className="prixa-container is-top is-full">
      <div className="margin-largeX">
        <div className="margin-smallT">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <FormLabel errors={false}>Spesialisasi</FormLabel>
            <Link scale="feedbackLink" onClick={(): void => history.push('/preconsultation-all-inbox')}>
              LIHAT SEMUA
            </Link>
          </div>
          <SearchBox
            options={options}
            placeholder="Misal: Kandungan"
            onSearch={(): Promise<void> => searchContent(specialitiesText)}
            onSelect={selectSpeciality}
            setData={setspecialitiesText}
            withDebounce={true}
            value={specialitiesText}
            onClear={clearSpeciality}
          />
        </div>
        <div className="margin-smallT">
          <FormLabel style={{ fontSize: '12px' }} errors={false}>
            Sering Dicari
          </FormLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {mostFind.map(({ value, text, websiteToken }: SearchBoxType) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                  }}
                  key={value}
                >
                  <div
                    className={`margin-smallB padding-microX`}
                    style={{
                      fontSize: 12,
                      display: 'flex',
                      flexDirection: 'row',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                    onClick={(): void => selectSpeciality({ value, text, websiteToken })}
                  >
                    <img
                      className="margin-tinyR"
                      style={{
                        height: '32px',
                        width: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow:
                          value === specialitiesValue ? '0 1px 1px 0 var(--primary), 0 0 0 2px var(--primary)' : 'none',
                      }}
                      alt={`${specialitiesText} Inbox Channel`}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `${baseIconURL}Rumah Sakit.png`;
                      }}
                      src={`${baseIconURL}Icon ${text}-min.png`}
                    />
                    <span className={value === specialitiesValue ? 'color-primary text-bold' : 'color-default'}>
                      {text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="prixa-fixed-footer">
        <Button disabled={!specialitiesValue} size="full" variant="primary" onClick={startConversation}>
          Mulai Percakapan
        </Button>
      </div>
    </div>
  );
};

export default InboxPicker;
