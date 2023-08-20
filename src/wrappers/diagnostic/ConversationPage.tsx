/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext, lazy } from 'react';
import { isCovid } from '../../utils/constant';
import Conversation from '../../components/conversation/Conversation';
import { getConversation, sessionId, geoLocation, GeoLocationType } from '../../api/api-utils';
import { ChiefComplaintNotFound } from './ChiefComplaintPage';
import { StatusPrecondition } from '../../components/conversation/StatusPrecondition';
import { BasicPrecondition } from '../../components/conversation/BasicPrecondition';
import { InfectionPrecondition } from '../../components/conversation/InfectionPrecondition';
import { LoadPage } from './LoadPage';
import { HeaderContext } from '../../components/header/HeaderContext';
import { Option } from '../../components/conversation/ConversationInterface';
import { AddFamilyInformation } from '../../components/conversation/AddFamilyInformation';

const ResultPage = lazy(() => import('./result-page/ResultPage'));
const ChiefComplaintResult = lazy(() => import('./ChiefComplaintPage'));
const finishQuestion = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Assessment - Finish.png`;
const askChiefComplaintImg = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Assessment - Input.png`;

export const ConversationPage = (): JSX.Element => {
  const [{ title, information, options, list, imgSrc }, setData] = useState({
    title: [],
    information: null,
    options: [],
    list: [],
    imgSrc: '',
    progress: 0,
    currState: '',
  });
  const [diagnoseResult, setDiagnoseResult] = useState({
    profiles: [],
    userDetails: {},
    user: {
      weight: 0,
      height: 0,
    },
    symptoms: [],
    diseases: [],
  });
  const [isValidForRDT, setisValidForRDT] = useState(false);
  const [symptomID, setSymptomID] = useState(null);
  const [load, setLoad] = useState(true);
  const [{ state }, setState] = useState({ state: '' });
  const [search, setSearchQuery] = React.useState('');
  const [preconditionData, setPreconditionData] = useState([{}, {}]);
  const { setError, setPercentage } = useContext(HeaderContext);

  const doSetError = (error?: string): void => {
    setError(error || '');
  };

  const getGeoLocation = (): void => {
    if (navigator.geolocation && geoLocation.latitude === 0 && geoLocation.longitude === 0) {
      navigator.geolocation.getCurrentPosition(position => {
        geoLocation.latitude = position.coords.latitude;
        geoLocation.longitude = position.coords.longitude;
      });
    }
  };

  const CallConverse = async (reply?: Option['reply']): Promise<any> => {
    setLoad(true);
    let data: any;

    const isComplaintNotInOptions = reply && reply.tag === 'ComplaintNotInOptions';
    const isStateFinishDiagnosis = reply && reply.value === 'Lanjutkan' && state === 'diagnosis';
    const isLihatHasil = reply && reply.tag === 'Lihat Hasil';

    const dataComplaintNotInOptions = {
      title: ['Not Found'],
      options: {
        tag: '',
        type: 'button',
        value: 'false',
      },
    };

    const dataStateFinishDiagnosis = {
      progress: 100,
      title: [
        'Perlu diingat, hasil Prixa ini bukan pengganti diagnosis medis dokter ya.',
        'Konsultasikan keluhan Anda dengan dokter untuk pemeriksaan lebih lanjut.',
      ],
      options: [
        {
          text: 'Lihat Hasil',
          type: 'button',
          variant: 'primary',
          reply: {
            value: '',
            tag: 'Lihat Hasil',
          },
        },
      ],
    };

    const dataLihatHasil = {
      title: ['Result'],
      options: [
        {
          text: '',
          variant: '',
          type: 'list',
          reply: {
            type: '',
            value: '',
            tag: '',
            list: reply?.list,
          },
        },
      ],
    };

    const dataEmpty = {
      imgSrc: '',
      title: '',
      information: '',
      options: '',
      list: '',
      progress: '',
      currState: '',
    };

    if (isComplaintNotInOptions) {
      data = dataComplaintNotInOptions;
    } else if (isStateFinishDiagnosis) {
      data = dataStateFinishDiagnosis;
    } else if (isLihatHasil) {
      data = dataLihatHasil;
    } else {
      try {
        getGeoLocation();
        console.log('reply: ', reply);
        data = await getConversation({ reply, geoLocation });
        console.log('data: ', data);
        if (data.state === 'askChiefComplaint' && localStorage.getItem('previousState') === 'askChiefComplaint') {
          data = {
            title: ['Not Found'],
            options: reply,
          };
        }
        setDiagnoseResult(data.diagnoseResult);
        setSymptomID(data.symptomID);
        setisValidForRDT(data.isValidForRDT);
      } catch (error) {
        doSetError('Maaf, ada kesalahan dari kami. Silahkan muat ulang halaman anda.');
        setLoad(false);
        data = dataEmpty;
      }
    }
    console.log('data after: ', data);
    localStorage.setItem('previousState', data.state);
    if (data.state === 'diagnosis') data.imgSrc = finishQuestion;
    if (data.state === 'askChiefComplaint') data.imgSrc = askChiefComplaintImg;

    setData({
      imgSrc: data.imgSrc || undefined,
      title: data.title,
      information: data.information,
      options: data.options,
      list: data.list,
      progress: data.progress || 0,
      currState: data.state || '',
    });
    setLoad(false);
    setPercentage(data.progress || 0);
    setState({ state: data.state || '' });
    return data.state || '';
  };

  /*eslint-disable */
  useEffect(() => {
    const initConversation = (geoLocation: GeoLocationType) => {
      getConversation({ geoLocation })
        .then((res: any) => {
          setisValidForRDT(res.isValidForRDT);
          let isResultPage = false;

          if (res.state === 'diagnosis' && localStorage.getItem('sesId') && localStorage.getItem('sesId') !== '') {
            setDiagnoseResult(res.diagnoseResult);
            isResultPage = true;
          }

          setData({
            imgSrc: res.imgSrc,
            title: isResultPage ? ['Result'] : res.title,
            information: res.information,
            options: res.options,
            list: res.list && res.list.length ? res.list : [],
            progress: res.progress || 0,
            currState: res.state || '',
          });

          setState({ state: res.state });
          setLoad(false);
          setPercentage(isResultPage ? 0 : res.progress || 0);
        })
        .catch(() => {
          doSetError('Maaf, ada kesalahan dari kami');
          setLoad(false);
        });
    };

    setLoad(true);
    initConversation(geoLocation);
  }, []);
  /*eslint-enable */

  useEffect(() => {
    if (state === 'askPrecondition') {
      setPercentage(25);
    } else if (state === 'askPrecondition1') {
      setPercentage(45);
    }
  });

  let currentPage;

  if ((load && state === 'askChiefComplaint') || state === 'skipAfteraskCovid19Tracing') {
    currentPage = <LoadPage />;
  } else if (state === 'showComplaint') {
    currentPage = (
      <ChiefComplaintResult
        search={search}
        callFunction={CallConverse}
        title={title}
        loading={load}
        options={options}
      />
    );
  } else if (state === 'askPrecondition') {
    currentPage = (
      <BasicPrecondition
        preconditionData={preconditionData}
        setPreconditionData={setPreconditionData}
        callFunction={CallConverse}
        title={title}
        loading={load}
        list={list}
        setConvoState={setState}
      />
    );
  } else if (state === 'askPrecondition1') {
    currentPage = (
      <StatusPrecondition
        preconditionData={preconditionData}
        setPreconditionData={setPreconditionData}
        callFunction={CallConverse}
        title={title}
        loading={load}
        list={list}
        setConvoState={setState}
      />
    );
  } else if (state === 'addFamilyMember') {
    currentPage = (
      <AddFamilyInformation
        preconditionData={preconditionData}
        setPreconditionData={setPreconditionData}
        callFunction={CallConverse}
        title={title}
        loading={load}
        list={list}
        setConvoState={setState}
      />
    );
  } else if (isCovid && state === 'askCovid19Tracing') {
    currentPage = (
      <InfectionPrecondition
        callFunction={CallConverse}
        title={title}
        loading={load}
        options={options}
        setConvoState={setState}
      />
    );
  } else if (title[0] === 'Not Found' || title[0] === 'Maaf kami belum dapat melakukan diagnosa penyakit tersebut') {
    currentPage = <ChiefComplaintNotFound callFunction={CallConverse} options={options} />;
  } else if (title[0] === 'Result') {
    localStorage.setItem('DiagnosisID', sessionId || 'none');
    currentPage = (
      <ResultPage sessionId={sessionId} diagnoseResult={diagnoseResult} isValidForRDT={isValidForRDT}></ResultPage>
    );
  } else {
    currentPage = (
      <Conversation
        title={title}
        information={information}
        options={options}
        callFunction={CallConverse}
        loading={load}
        imgSrc={imgSrc}
        search={search}
        setSearchQuery={setSearchQuery}
        state={state}
        sessionId={sessionId || 'none'}
        symptomID={symptomID}
      ></Conversation>
    );
  }

  return currentPage;
};

export default ConversationPage;
