import React, { Fragment } from 'react';
import { Card, Image, Text } from 'prixa-design-kit/dist';
import { useHistory } from 'react-router-dom';
import { HospitalType } from './AllHospitalPage';
import Skeleton from 'react-loading-skeleton';

const defaultHospitalUrl = `${process.env.REACT_APP_ASSET_URL}/Appointment%20Booking/Rumah%20Sakit.png`;

export const HospitalsSection = ({ data }: { data: Array<HospitalType> }): JSX.Element => {
  const getHospitalInfo = (name: string): void => {
    const hospitalUrl = name.replace(/\s+/g, '-').toLowerCase();
    window.location.href = '/hospital/' + hospitalUrl;
  };

  const whenImageError = (e: any): void => {
    e.target.src = defaultHospitalUrl;
  };

  const history = useHistory();
  return (
    <Fragment>
      <div className="margin-largeX">
        <b>Rumah Sakit</b>
        <div style={{ float: 'right' }}>
          <div className="all-hospital-link" onClick={(): void => history.push('/all-hospital')}>
            Lihat Semua
          </div>
        </div>
      </div>
      <div className="flex-inline padding-smallY" style={{ overflowX: 'auto', width: '100%' }}>
        {data.length > 0 ? (
          data.map(({ id, imageUrl, name, address }, i) => (
            <Card
              key={i}
              className={`margin-baseR margin-miniX ${i === 0 ? 'margin-largeL' : ''}`}
              style={{
                width: '180px',
                height: address ? '125px' : '110px',
                padding: '8px',
                overflow: 'visible',
                cursor: 'pointer',
              }}
              onClick={(): void => getHospitalInfo(name)}
            >
              <Image
                rounded
                size="base"
                src={imageUrl ? imageUrl : defaultHospitalUrl}
                style={{ height: '80px', width: '164px', objectFit: 'cover' }}
                onError={e => whenImageError(e)}
              />
              <div className="text-ellipsis" style={{ width: '164px' }}>
                <Text scale="questionLink2" className="color-black">
                  {name}
                </Text>
                <br />
                <Text scale="content" className="color-disabled">
                  {address.district || '-'}
                </Text>
              </div>
            </Card>
          ))
        ) : (
          <HospitalsSectionSkeleton />
        )}
        &emsp;
      </div>
    </Fragment>
  );
};

const HospitalsSectionSkeleton = (): JSX.Element => {
  return (
    <div className="flex-inline padding-smallY padding-largeL" style={{ overflowX: 'auto', width: '100%' }}>
      {((): JSX.Element[] => {
        const cards = [];
        for (let cardLoops = 1; cardLoops <= 5; cardLoops++) {
          cards.push(
            <Card
              key={cardLoops}
              className="margin-baseR margin-miniX"
              style={{ width: '180px', height: '140px', padding: '8px', overflow: 'visible' }}
            >
              <Skeleton height={80} />
              <div className="text-ellipsis" style={{ width: '164px' }}>
                <Skeleton />
                <br />
                <Skeleton />
              </div>
            </Card>,
          );
        }
        return cards;
      })()}
    </div>
  );
};

export default HospitalsSection;
