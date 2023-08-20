import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { HeaderContext } from '../../components/header/HeaderContext';
import LandingCarousel from './LandingCarousel';
import './testLab.scss';

const TestLab = (): JSX.Element => {
  const { setHeader } = useContext(HeaderContext);
  const history = useHistory();

  /* eslint-disable */
  useEffect(() => {
    setHeader('Tes Lab');
  }, []);
  /* eslint-enable */

  return (
    <div className="prixa-container is-top" style={{ position: 'relative' }}>
      <LandingCarousel />
      <div
        style={{
          position: 'absolute',
          top: '575px',
          fontWeight: 'bold',
          color: 'var(--primary)',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'inline-block',
        }}
        onClick={(): void => history.push('/coupon')}
      >
        Lewat
      </div>
    </div>
  );
};

export default TestLab;
