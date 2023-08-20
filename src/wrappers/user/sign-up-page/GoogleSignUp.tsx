import React, { Fragment } from 'react';
import { Button } from 'prixa-design-kit/dist';
import googleIcon from '../../../img/google-icon.png';

export const GoogleSignUp = () => {
  return (
    <Fragment>
      <div className="margin-baseY">
        <span className="prixa-lineonsides">atau</span>
      </div>
      <Button size="xLarge" variant="outline" className="dav-special" style={{ width: '100%', position: 'relative' }}>
        <img
          loading="lazy"
          height="55%"
          width="auto"
          alt="google"
          src={googleIcon}
          style={{ position: 'absolute', left: 0, maxHeight: '55%', marginLeft: '16px' }}
        />
        Lanjutkan dengan Google
      </Button>
    </Fragment>
  );
};
