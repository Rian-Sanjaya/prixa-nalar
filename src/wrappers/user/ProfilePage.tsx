import React, { useEffect, useState, useContext } from 'react';
import { Text, Button, Icon } from 'prixa-design-kit/dist';
import { useHistory } from 'react-router-dom';
import { HeaderContext } from '../../components/header/HeaderContext';
import { logOut, getPartnerAuthStorage } from '../../utils/constant';
import './profilePageIcon.scss';

const avatarNone = `${process.env.REACT_APP_ASSET_URL}/home/Account-None.png`;
const avatarMale = `${process.env.REACT_APP_ASSET_URL}/home/Account-Male.png`;
const avatarFemale = `${process.env.REACT_APP_ASSET_URL}/home/Account-Female.png`;
interface ProfileList {
  title: string;
  link: string;
  show: boolean;
  class: string;
}

export const ProfilePage = (): JSX.Element => {
  const profileList: ProfileList[] = [
    {
      class: 'icon-menu imgProfile',
      title: 'Data Diri',
      link: '/personal-information',
      show: getPartnerAuthStorage === '' || getPartnerAuthStorage === null,
    },
    { class: 'icon-menu imgHealth', title: 'Informasi Kesehatan', link: '/precondition-info', show: true },
    {
      class: 'icon-menu imgPassword',
      title: 'Ganti Password',
      link: '/change-password',
      show: getPartnerAuthStorage === '' || getPartnerAuthStorage === null,
    },
  ];
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [loadUrl, setLoadUrl] = useState(true);
  const { setHeader, setMenu, setShowAvatar } = useContext(HeaderContext);

  const history = useHistory();

  let gender = '';
  let imgContent = avatarNone;
  const profileData = localStorage.getItem('profileData');
  if (profileData) {
    gender = JSON.parse(profileData).gender ? JSON.parse(profileData).gender : '';
    imgContent = gender === 'm' ? avatarMale : gender === 'f' ? avatarFemale : avatarNone;
  }

  /* eslint-disable */
  useEffect(() => {
    setHeader('Profil');
    setMenu(false);
    setShowAvatar(false);

    return () => {
      setHeader('');
    }
  }, []);
  /* eslint-enable */

  useEffect(() => {
    const timer = setInterval(() => {
      const profileDataLocalStorage = localStorage.getItem('profileData');
      const profileData = JSON.parse(String(profileDataLocalStorage));
      if (profileData !== null) {
        setName(profileData.name);
        setEmail(profileData.email);
        setTimeout(() => {
          setLoadUrl(false);
        }, 1000);
      }
    }, 500);
    if (name !== undefined) {
      clearInterval(timer);
    }
  });

  return (
    <div className="prixa-container is-top">
      <div style={{ display: 'flex' }}>
        <div
          style={{
            border: '1px solid var(--dark-20)',
            borderRadius: '100%',
            width: '64px',
            height: '64px',
            position: 'relative',
          }}
        >
          {loadUrl ? (
            <Icon style={{ height: '64px', color: 'var(--primary)', margin: 'auto' }} type="circle-notch" spin />
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img
                loading="lazy"
                alt="User Profile"
                src={imgContent}
                style={{
                  height: 'auto',
                  width: '100%',
                }}
              />
            </div>
          )}
        </div>
        <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Text scale="pageTitle" style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>
            {name}
          </Text>
          {(getPartnerAuthStorage === '' || getPartnerAuthStorage === null) && (
            <Text scale="content" style={{ color: 'var(--dark-50)' }}>
              {email}
            </Text>
          )}
        </div>
      </div>
      <div className="prixa-profile-list margin-baseY margin-baseB" style={{ marginTop: '28px' }}>
        <div style={{ marginBottom: '6px' }}>
          <Text scale="pageTitle">Akun Saya</Text>
        </div>
        {profileList.map((item: ProfileList, key: number) => {
          return item.show ? <ProfileList key={key} item={item} /> : null;
        })}
      </div>
      {(getPartnerAuthStorage === '' || getPartnerAuthStorage === null) && (
        <>
          <div className="prixa-profile-list margin-baseY" style={{ marginBottom: '73px' }}>
            <div style={{ marginBottom: '6px' }}>
              <Text scale="pageTitle">Keluarga</Text>
            </div>
            <div style={{ position: 'relative' }}>
              <div onClick={(): void => history.push('/family-member')} className="list" style={{ border: 'none' }}>
                <div className="item">
                  <div style={{ width: '24px', height: '24px', marginRight: '16px' }}>
                    <div className={'icon-menu imgFamily'} />{' '}
                  </div>
                  <span className="title">Daftar Keluarga</span>
                </div>
                <Icon style={{ color: '#c3c4c6' }} type="chevron-right" />
              </div>
              <div
                style={{
                  borderBottom: '1px solid rgba(112, 112, 112, 0.25)',
                  position: 'absolute',
                  bottom: 0,
                  left: '22px',
                  width: '110%',
                  maxWidth: '375px',
                }}
              ></div>
            </div>
          </div>
          <ButtonSignOut />
        </>
      )}
    </div>
  );
};

const ProfileList = ({ item }: { item: ProfileList }): JSX.Element => {
  const history = useHistory();

  const goToNavigation = (): void => {
    history.push(item.link);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={(): void => goToNavigation()} className="list" style={{ borderBottom: 'none' }}>
        <div className="item">
          <div style={{ width: '24px', height: '24px', marginRight: '16px' }}>
            <div className={item.class} />
          </div>
          <span className="title">{item.title}</span>
        </div>
        <Icon style={{ color: 'var(--grey)' }} type="chevron-right" />
      </div>
      <div
        style={{
          borderBottom: '1px solid rgba(112, 112, 112, 0.25)',
          position: 'absolute',
          bottom: 0,
          left: '22px',
          width: '110%',
          maxWidth: '375px',
        }}
      ></div>
    </div>
  );
};

export const signOut = (): void => {
  logOut();
  window.location.href = '/';
};

const ButtonSignOut = (): JSX.Element => {
  return (
    <Button
      onClick={(): void => signOut()}
      size="xLarge"
      className="dav-special"
      variant="outline"
      style={{ color: 'var(--alert)', borderColor: 'var(--alert)', width: '100%' }}
    >
      <Icon type="sign-out-alt" style={{ color: 'var(--alert)', margin: 'auto', paddingLeft: '100px' }}>
        <Text style={{ fontSize: '16px', color: 'var(--alert)', margin: 'auto', paddingRight: '100px' }}>
          <b> Keluar</b>
        </Text>
      </Icon>
    </Button>
  );
};

export default ProfilePage;
