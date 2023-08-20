import React, { useEffect, useState } from 'react';
import { Text } from 'prixa-design-kit/dist';
import CtaFeature from '../../components/cta-feature/CtaFeature';
import Skeleton from 'react-loading-skeleton';
import { showUserManagement } from '../../utils/constant';

const HomePage = () => {
  return (
    <div className="prixa-container is-top">
      <WelcomeMessage />
      {showUserManagement() ? (
        <div className="margin-largeY">
          <CtaFeature isTitle={false} isShowDiagnonseMenu={true} />
        </div>
      ) : (
        <span />
      )}
    </div>
  );
};

const WelcomeMessage = () => {
  const [name, setName] = useState();
  const [isTitleReady, setTitleReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const profileDataLocalStorage = localStorage.getItem('profileData');
      const profileData = JSON.parse(String(profileDataLocalStorage));
      if (profileData !== null) {
        setName(profileData.name);
      }
    }, 500);
    if (name !== undefined) {
      setTitleReady(true);
      clearInterval(timer);
    }
  }, [name]);

  return <div className="prixa-title margin-baseB">{isTitleReady ? <TitleSection name={name} /> : <Skeleton />}</div>;
};

const TitleSection = ({ name }: any) => {
  return (
    <React.Fragment>
      <Text scale="question" style={{ color: 'var(--dark)', wordBreak: 'break-all' }}>
        Hai, {name}!
      </Text>
      <br />
      <Text scale="content" style={{ color: 'var(--dark-50)' }}>
        Ada yang bisa Prixa bantu?
      </Text>
    </React.Fragment>
  );
};

export { HomePage as default };
