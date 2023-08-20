import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './header.scss';
import { Text, Icon, IconSolid } from 'prixa-design-kit/dist';
import { sessionId, currentState } from '../../api/api-utils';
import { UseTracking } from '../../utils/useTracking';
import { partnerTheme, getPartnerAuthStorage } from '../../utils/constant';
import { HeaderContext } from './HeaderContext';

const avatarNone = `${process.env.REACT_APP_ASSET_URL}/home/Account-None.png`;
const avatarMale = `${process.env.REACT_APP_ASSET_URL}/home/Account-Male.png`;
const avatarFemale = `${process.env.REACT_APP_ASSET_URL}/home/Account-Female.png`;

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showMenu?: boolean;
  showAvatar?: boolean;
  showDownload?: boolean;
  isDownloading?: boolean;
  setDownload?: (isDownloading: boolean) => void;
  showReset?: boolean;
  changeMode?: string;
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  deleteMode?: boolean;
  setDeleteMode?: (deleteMode: boolean) => void;
  showEdit?: boolean;
  setHandleReset?: (handleReset: boolean) => void;
  countFamilyMember?: number;
}

const Header = (props: HeaderProps) => {
  const [imgHeader, setImgHeader] = React.useState<any>();
  const [{ title, subtitle }, setHeader] = React.useState({ title: '', subtitle: '' });
  const [withBack, setWithBack] = React.useState(false);
  const theme = partnerTheme.get();
  const { setLoadProfile, setErrorHeader, setHandleClose } = React.useContext(HeaderContext);
  const history = useHistory();

  let gender = '';
  let imgContent = avatarNone;
  const profileData = localStorage.getItem('profileData');
  if (profileData) {
    gender = JSON.parse(profileData).gender ? JSON.parse(profileData).gender : '';
    imgContent = gender === 'm' ? avatarMale : gender === 'f' ? avatarFemale : avatarNone;
  }

  /* eslint-disable  */
  useEffect(() => {
    setHeader({ title: props.title || '', subtitle: props.subtitle || '' });
  }, [props.title]);
  
  useEffect(() => {
    if (theme.partnerLogo) {
      setImgHeader(theme.partnerLogo);
    } else {
      setImgHeader(`${process.env.REACT_APP_ASSET_URL}/prixa-header.png`);
    }
  }, [theme.partnerLogo]);

  /* eslint-enable  */

  const pageWithoutBack = ['/', '/home', '/verification-sent', '/unverified'];

  useEffect(() => {
    if (
      pageWithoutBack.includes(history.location.pathname) ||
      history.location.pathname.includes('/reset-password') ||
      history.location.pathname.includes('/verification-check')
    ) {
      setWithBack(false);
    } else {
      setWithBack(true);
    }
  }, [history.location.pathname, pageWithoutBack]);

  const handleSetDownload = (mode: boolean) => {
    if (props.setDownload) props.setDownload(mode);
  };

  const handleSetEdit = (mode: boolean) => {
    if (props.setEditMode) props.setEditMode(mode);
  };

  const handleSetDelete = (mode: boolean) => {
    if (props.setDeleteMode) props.setDeleteMode(mode);
  };

  if (!title && !props.showMenu && !props.showAvatar && !imgHeader) {
    return null;
  }

  return (
    <>
      <div
        className="prixa-header"
        style={
          theme
            ? {
                backgroundImage: `linear-gradient(to bottom right, ${(theme.colors && theme.colors.default) ||
                  '#ffffff'}, ${(theme.colors && theme.colors.default) || '#ffffff'}aa`,
              }
            : {}
        }
      >
        {(() => {
          if (props.editMode === true)
            return <HeaderBackCancelEdit handleSetEdit={handleSetEdit} setLoadProfile={setLoadProfile} />;
          if (withBack) return <HeaderBackButton />;
        })()}
        <HeaderTitle title={title} subtitle={subtitle} imgHeader={imgHeader} />
        <div className="prixa-menubar">
          <div style={{ display: 'flex' }}>
            {props.showAvatar && <HeaderAvatarButton imgContent={imgContent} />}
            {props.showDownload && (
              <HeaderDownloadButton handleSetDownload={handleSetDownload} isDownloading={props.isDownloading} />
            )}

            {props.editMode === false && (
              <HeaderEditButton
                handleSetEdit={handleSetEdit}
                changeMode={props.changeMode}
                handleSetDelete={handleSetDelete}
                countFamilyMember={props.countFamilyMember}
                setErrorHeader={setErrorHeader}
              />
            )}

            {props.showReset && <HeaderResetButton setHandleReset={props.setHandleReset} />}

            {getPartnerAuthStorage && <HeaderCloseButton setHandleClose={setHandleClose} />}
          </div>
        </div>
      </div>
    </>
  );
};

const HeaderBackCancelEdit = ({ handleSetEdit, setLoadProfile }: any): JSX.Element => {
  return (
    <span
      className="prixa-menuback"
      onClick={() => {
        handleSetEdit(false);
        setLoadProfile(true);
        window.location.reload();
      }}
    >
      <Icon type="chevron-left" style={{ width: 16 }} />
    </span>
  );
};

const HeaderBackButton = () => {
  return (
    <div
      className="prixa-menuback"
      onClick={() => {
        UseTracking({ event: `Back clicked`, properties: { sessionId, state: currentState } });
        window.history.back();
      }}
      data-cy="header-back-button"
    >
      <Icon type="chevron-left" style={{ width: 16 }} />
    </div>
  );
};

const HeaderTitle = ({ title, subtitle, imgHeader }: any) => {
  return (
    <div className="prixa-caption">
      <Text scale="headerTitle">
        {(() => {
          if (title) {
            return title;
          } else {
            return (
              <img
                loading="lazy"
                width="auto"
                height="24px"
                alt="logo"
                className="prixa-header-image"
                src={imgHeader}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  UseTracking({ event: `Logo clicked`, properties: { sessionId, state: currentState } });
                  window.location.href = '/';
                }}
              />
            );
          }
        })()}
      </Text>
      {(() => {
        if (subtitle) {
          return <Text scale="headerSubtitle">{subtitle}</Text>;
        }
      })()}
    </div>
  );
};

const HeaderDownloadButton = ({ handleSetDownload, isDownloading }: any) => {
  const [isLoading, setDownloading] = useState(false);

  useEffect(() => {
    isDownloading ? setDownloading(true) : setDownloading(false);
  }, [isDownloading]);

  return (
    <div
      onClick={() => {
        handleSetDownload(true);
        setDownloading(true);
      }}
    >
      {isLoading ? (
        <Icon color="disabled" type="circle-notch" width="24px" spin />
      ) : (
        <IconSolid backgroundColor="secondary" backgroundSize="24px" type="download" width="12px" />
      )}
    </div>
  );
};

const HeaderAvatarButton = ({ imgContent }: { imgContent: string }): JSX.Element => {
  const history = useHistory();

  return (
    <div
      style={{
        height: '32px',
        width: '32px',
        position: 'relative',
        border: '1px solid var(--dark-20)',
        borderRadius: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onClick={() => {
          UseTracking({ event: `Avatar clicked`, properties: { sessionId, state: currentState } });
          history.push({ pathname: '/profile' });
        }}
      >
        <img loading="lazy" src={imgContent} alt="Avatar" style={{ width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
};

const HeaderResetButton = ({ setHandleReset }: any) => {
  return (
    <span
      onClick={() => {
        UseTracking({ event: `Reset clicked`, properties: { sessionId, state: currentState } });
        setHandleReset(true);
      }}
    >
      <Text scale="feedbackLink">Reset</Text>
    </span>
  );
};

const HeaderEditButton = ({
  handleSetEdit,
  changeMode,
  handleSetDelete,
  countFamilyMember,
  setErrorHeader,
}: any): JSX.Element => {
  return (
    <span
      data-cy="header-icon-button"
      className="prixa-header-edit-button"
      onClick={() => {
        if (changeMode === 'add') {
          if (window.location.pathname === '/family-member') {
            if (countFamilyMember < 5) {
              UseTracking({ event: `Add clicked`, properties: { sessionId, state: currentState } });
              window.location.href = '/add-family-member';
            } else {
              setErrorHeader('Penambahan Daftar Keluarga maximum 5');
              setTimeout(() => {
                setErrorHeader('');
              }, 3000);
            }
          }
        } else if (changeMode === 'delete') {
          if (window.location.pathname === '/modify-family-member') {
            UseTracking({ event: `Delete clicked`, properties: { sessionId, state: currentState } });
            handleSetDelete(true);
          }
        } else {
          UseTracking({ event: `Edit clicked`, properties: { sessionId, state: currentState } });
          handleSetEdit(true);
        }
      }}
    >
      {changeMode === 'add' ? (
        <Icon type="user-plus" style={{ color: 'var(--secondary)', width: '24px', height: '19.2px' }} />
      ) : changeMode === 'delete' ? (
        <Icon type="trash-alt" style={{ color: 'var(--alert)', width: '14px', height: '16px' }} />
      ) : (
        <Icon type="user-edit" style={{ color: 'var(--secondary)', width: '24px', height: '19.2px' }} />
      )}
    </span>
  );
};

const HeaderCloseButton = ({ setHandleClose }: any): JSX.Element => {
  return (
    <div
      style={{ marginLeft: '8px' }}
      onClick={() => {
        setHandleClose(true);
      }}
    >
      <Icon type="times" style={{ width: '24px', height: '24px' }} />
    </div>
  );
};

export default Header;
