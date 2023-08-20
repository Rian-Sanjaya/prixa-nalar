import React, { useState } from 'react';
import { Toast } from 'prixa-design-kit/dist';
import BannerInssurance from '../../../components/intro/banner-inssurance/BannerInssurance';
import { sessionId } from '../../../api/api-utils';
import { getHighestDisease, getConvertedDisease } from './utils';
import { priority, triageMessage } from './constant';
import CtaFeature from '../../../components/cta-feature/CtaFeature';
import { getPartnerID, getAppID, showInsuranceFeature, isCovid } from '../../../utils/constant';
import '../../covid/result-page/resultPageStyle.scss';
import { LoadPage } from '../LoadPage';
import FinishButton from './FinishButton';
import DisclaimerSection from './DisclaimerSection';
import SummarySection from './SummarySection';
import ResultList from './ResultList';
import { PARTNER_APP_API } from '../../../api/api-url';
import { getAPI } from '../../../api/api-method';
import { SummaryMessage } from '../../covid/result-page/SummaryMessage';
// import BannerCovid from '../../../components/intro/BannerCovid';
import '../../../components/intro/intro.scss';

export interface UserType {
  gender?: string;
  weight: number;
  height: number;
  insurance?: any;
}

export interface UserDetailsType {
  ageMonth?: number;
  ageYear?: number;
}

export interface ProfileType {
  id?: string;
  name?: string;
  nameIndo?: string;
  description?: string;
  type?: string;
  order?: number;
}

export interface SymptomType {
  symptomID?: string;
  symptomName?: string;
  answer?: string;
  propNames?: Array<string>;
  chief?: boolean;
  symptomsTriage?: Array<string>;
}

export interface TriageDiseaseType {
  id: string;
  name: string;
  nameIndo: string;
  description: string;
}

export interface DiseaseType {
  id: string;
  name: string;
  description: string;
  likeliness: string;
  score: number;
  url: string;
  triage: TriageDiseaseType;
  prognosis?: string;
}
export interface DiagnoseResultType {
  profiles: Array<ProfileType>;
  userDetails: UserDetailsType;
  user: UserType;
  symptoms: Array<SymptomType>;
  diseases: Array<DiseaseType>;
}
interface ResultType {
  sessionId: string | null;
  diagnoseResult: DiagnoseResultType;
  isValidForRDT?: boolean;
}

const ResultPage = (props: ResultType) => {
  const { user, userDetails, profiles, symptoms, diseases } = props.diagnoseResult;
  const [load, setLoad] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [formUrl, setFormUrl] = React.useState<string>('');
  const [rdtUrl, setRdtUrl] = React.useState<string>('');
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    getAPI(PARTNER_APP_API.PARTNER_APP_META(getPartnerID, getAppID))
      .then((resp: any) => {
        setFormUrl(resp.data.formURL);
        setRdtUrl(resp.data.rdtURL);
        setIsReady(true);
      })
      .catch(() => setIsReady(true));
  }, []);

  const highestDisease = getHighestDisease(diseases);
  const summaryMessage = highestDisease.triage === priority.homecare ? triageMessage.homecare : triageMessage.opd;

  const disclaimerProps = {
    user: user,
    profiles: profiles,
    symptoms: symptoms,
    userDetails: userDetails,
    sessionId: props.sessionId,
  };

  const ctaFeatureSection = (
    <div className="margin-largeY margin-largeX">
      <CtaFeature isShowDiagnonseMenu={isCovid ? true : false} setLoad={setLoad} isFromResultPage={true} />
    </div>
  );

  // const banner = !isCovid ? <BannerCovid /> : '';
  const bannerInsuraceSection = showInsuranceFeature() && <BannerInssurance setErrMessage={setErrMessage} />;
  const showSelfForm = highestDisease.triage === priority.homecare ? false : true;
  const showRDTForm = props.isValidForRDT && rdtUrl ? true : false;

  if (load) return <LoadPage />;

  return (
    <div className="prixa-container is-top is-full">
      {isCovid ? (
        !isReady ? (
          <div
            className="margin-largeX margin-baseT margin-largeB"
            style={{ height: 295, width: 295, background: 'var(--dark-40)', borderRadius: '15px' }}
          />
        ) : (
          <SummaryMessage
            showRDTForm={showRDTForm}
            showSelfForm={showSelfForm}
            rdtUrl={rdtUrl}
            formUrl={formUrl}
            sessionId={String(sessionId)}
          />
        )
      ) : (
        <SummarySection summaryMessage={summaryMessage} />
      )}
      <ResultList convertedDisease={getConvertedDisease(diseases)} />
      <DisclaimerSection {...{ ...disclaimerProps }} />
      {ctaFeatureSection}
      {/* {banner} */}
      {bannerInsuraceSection}
      <FinishButton sessionId={props.sessionId} />
      <Toast timeout={3000} variant="danger" show={errMessage !== ''} message={errMessage} />
    </div>
  );
};

export default ResultPage;
