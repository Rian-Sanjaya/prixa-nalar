import React, { Fragment } from 'react';
import { Button } from 'prixa-design-kit/dist';
import googleIcon from '../../../img/google-icon.png';

export const GoogleLogin = () => {
  return (
    <Fragment>
      <div className="margin-baseY">
        <span className="prixa-lineonsides">atau</span>
      </div>
      <Button size="xLarge" variant="outline" className="dav-special" style={{ width: '100%', position: 'relative' }}>
        <img
          height="55%"
          width="auto"
          loading="lazy"
          alt="google"
          src={googleIcon}
          style={{ position: 'absolute', left: 0, marginLeft: '16px', maxHeight: '55%' }}
        />
        Masuk dengan Google
      </Button>
    </Fragment>
  );
};
