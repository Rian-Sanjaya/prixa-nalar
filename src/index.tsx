import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import './styles/base.scss';
import './styles/media.scss';
// eslint-disable-next-line
// @ts-ignore
import { Detector } from 'react-detect-offline'; // eslint-disable-line
import { PrixaStyle } from 'prixa-design-kit/dist';
import { ErrorPage } from './wrappers/diagnostic/ErrorPage';
import { LoadPage } from './wrappers/diagnostic/LoadPage';
import App from './wrappers/App';
import * as serviceWorker from './serviceWorker';
import { getAPI } from './api/api-method';
import { PARTNER_APP_API } from './api/api-url';
import Container from './components/container/Container';
import { BrowserRouter } from 'react-router-dom';
import { getPartnerID, getAppID, partnerTheme, setAncillary, getUID, getPartnerAuth, logOut } from './utils/constant';
import { changeTheme } from './utils/changeTheme';
import { HeaderContext } from './components/header/HeaderContext';
import NoInternet from './wrappers/user/NoInternet';
import OnboardingPage from './wrappers/partner/OnboardingPage';
import { ApolloProvider } from '@apollo/client/react';
import defaultClient from './graphql/utils';

declare global {
  interface Window {
    CRISP_WEBSITE_ID: string;
    $crisp: any;
    baymaxSDK: Record<string, Function>;
    ptrack: Record<string, Function>;
    ReactNativeWebView: any;
    webkit: any;
  }
}

const CallAPI: React.FC = () => {
  const [load, setLoader] = useState(true);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  // const [showMenu, setShowMenu] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState('');
  const [errorHeader, setErrorHeader] = useState('');
  const [{ title, subtitle }, setHeader] = useState({ title: '', subtitle: '' });
  const [percentage, setPercentage] = useState(0);
  const [isDownloading, setDownload] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isLoadProfile, setLoadProfile] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [handleReset, setHandleReset] = useState(false);
  const [handleClose, setHandleClose] = useState(false);
  const [countFamilyMember, setCountFamilyMember] = useState(0); // to keep track of family member list (/family-member, /add-family-member)

  const doSetShowAvatar = useCallback((show = false) => {
    setShowAvatar(show);
  }, []);

  const doSetShowDownload = useCallback((show = false) => {
    setShowDownload(show);
  }, []);

  const doSetShowMenu = useCallback((menu = true) => {
    setShowMenu(menu);
  }, []);

  const doSetHeader = useCallback((title?: string, subtitle?: string) => {
    setHeader({ title: title || '', subtitle: subtitle || '' });
  }, []);

  function doSetPercentage(percent?: number): void {
    setPercentage(percent || 0);
  }

  function doSetError(error?: string): void {
    setError(error || '');
  }

  function doSetErrorHeader(error?: string): void {
    setErrorHeader(error || '');
  }

  const doSetDownload = (isDownloading = false): void => {
    setDownload(isDownloading);
  };

  const doSetEditMode = (editMode = false): void => {
    setEditMode(editMode);
  };

  const doSetDeleteMode = (deleteMode = false): void => {
    setDeleteMode(deleteMode);
  };

  const doSetShowReset = (reset = false): void => {
    setShowReset(reset);
  };

  const doSetHandleReset = (handleReset = false): void => {
    setHandleReset(handleReset);
  };

  const doSetHandleClose = (handleClose = false): void => {
    setHandleClose(handleClose);
  };

  useEffect(() => {
    /* precache image for offline */
    // let image;
    new Image().src = `${process.env.REACT_APP_ASSET_URL}/telemed/Tidak%20Menemukan%20Sinyal.png`; // eslint-disable-line no-undef
    // image.src = ;
    getAPI(PARTNER_APP_API.PARTNER_APP_ID(getPartnerID, getAppID))
      .then((res: any) => {
        localStorage.setItem('getPartnerID', getPartnerID);
        localStorage.setItem('getAppID', getAppID);
        localStorage.setItem('getUID', getUID);
        localStorage.setItem('isCovid', res.data.is_covid);
        localStorage.setItem('telemedicineSDKURL', res.data.telemedicine_sdk_url || '');
        localStorage.setItem('isDependent', res.data.is_dependent_enabled);
        partnerTheme.set(res.data.theme);
        setAncillary(res.data.ancillary);
        setLoader(false);
        changeTheme(res.data.theme.main_theme_color_presets);
      })
      .catch((): void => {
        setError('Maaf, ada kesalahan dari kami');
        setLoader(false);
        if (localStorage.getItem('referrer')) {
          setTimeout(() => {
            window.location.href = localStorage.getItem('referrer') || '';
          }, 1000);
        }
      });
  }, []);

  if (getPartnerAuth !== undefined) {
    logOut();
    return <OnboardingPage />;
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={defaultClient}>
        <HeaderContext.Provider
          value={{
            setHeader: doSetHeader,
            setPercentage: doSetPercentage,
            setError: doSetError,
            setShowAvatar: doSetShowAvatar,
            setShowDownload: doSetShowDownload,
            setMenu: doSetShowMenu,
            isDownloading: isDownloading,
            setDownload: doSetDownload,
            editMode: editMode,
            setEditMode: doSetEditMode,
            deleteMode: deleteMode,
            setDeleteMode: doSetDeleteMode,
            setReset: doSetShowReset,
            handleReset: handleReset,
            setHandleReset: doSetHandleReset,
            handleClose: handleClose,
            setHandleClose: setHandleClose,
            isLoadProfile: isLoadProfile,
            setLoadProfile: setLoadProfile,
            countFamilyMember,
            setCountFamilyMember,
            setErrorHeader: doSetErrorHeader,
            errorHeader: errorHeader,
          }}
        >
          <Container
            title={title}
            subtitle={subtitle}
            percentage={percentage}
            showAvatar={showAvatar}
            showDownload={showDownload}
            showMenu={showMenu}
            showReset={showReset}
            isDownloading={isDownloading}
            setDownload={doSetDownload}
            editMode={editMode}
            setEditMode={doSetEditMode}
            deleteMode={deleteMode}
            setDeleteMode={doSetDeleteMode}
            setHandleReset={doSetHandleReset}
            setHandleClose={doSetHandleClose}
            handleClose={handleClose}
            countFamilyMember={countFamilyMember}
            content={
              // <Detector
              //   polling={{ url: 'https://dev.api.core.prixa.ai', interval: 10000 }}
              //   render={({ online }: { online: boolean }): JSX.Element => {
              //     let app = <NoInternet />;
              //     if (online) {
              //       if (load) app = <LoadPage />;
              //       else if (error) app = <ErrorPage text={error} goTo="/" goToString="Ke Halaman Utama" />;
              //       else app = <App />;
              //     }
              //     return app;
              //   }}
              // />
              (() => {
                let app = <NoInternet />;
                if (load) app = <LoadPage />;
                else if (error) app = <ErrorPage text={error} goTo="/" goToString="Ke Halaman Utama" />;
                else app = <App />;
                return app;
              })()
            }
          />
        </HeaderContext.Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <PrixaStyle>
    <CallAPI />
  </PrixaStyle>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
