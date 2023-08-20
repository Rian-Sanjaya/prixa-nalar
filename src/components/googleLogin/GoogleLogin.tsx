import React, { Fragment } from 'react';
import { Button } from 'prixa-design-kit/dist';
import googleIcon from '../../img/google-icon.png';
import { USER_API } from '../../api/api-url';
import { getAPI } from '../../api/api-method';

export const GoogleLogin = ({ text }: any) => {
  const [load, setLoad] = React.useState(false);

  const googleLogin = () => {
    setLoad(true);
    getAPI(USER_API.GOOGLE).then((res: any) => {
      window.location.href = res.authURL;
    });
  };

  return (
    <Fragment>
      <div className="margin-baseY">
        <span className="prixa-lineonsides">atau</span>
      </div>
      <Button
        size="xLarge"
        variant={load ? 'disabled' : 'outline'}
        disabled={load}
        style={load ? { width: '100%', position: 'relative', height: '38px' } : { width: '100%', position: 'relative' }}
        onClick={googleLogin}
        spinner={load}
      >
        {!load && (
          <img
            height="55%"
            width="auto"
            loading="lazy"
            alt="google"
            src={googleIcon}
            style={{ position: 'absolute', left: 0, marginLeft: '16px', maxHeight: '55%' }}
          />
        )}
        {text}
      </Button>
    </Fragment>
  );
};
