import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Image } from 'prixa-design-kit/dist';
import { useHistory } from 'react-router-dom';
import { BookingContext } from '../booking-page/BookingContext';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import Skeleton from 'react-loading-skeleton';

export interface SpecialityType {
  id: string;
  name: string;
  nameIndo: string;
}

interface SpecialitySectionProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;

export const SpecialitiesSection = ({ setError }: SpecialitySectionProps): JSX.Element => {
  const [specialities, setSpecialities] = useState<Array<SpecialityType>>([]);
  const { filterData, setFilterData } = useContext(BookingContext);
  const history = useHistory();

  useEffect(() => {
    getAPI(`${BOOKING_API.SPECIALITIES}`).then(async (res: any) => {
      const defaultSpecialities = ['Dokter Umum', 'Kedokteran Gigi', 'Pediatri', 'Penyakit Dalam', 'Kebidanan'];
      const regex = new RegExp(defaultSpecialities.join('|'), 'i');

      if (res && res.data) {
        setSpecialities(res.data.filter((item: SpecialityType) => regex.test(item.nameIndo)));
      } else {
        setError('Maaf, ada kesalahan dari kami');
      }
    });
  }, [setError]);

  const clickedSpecialities = (id: string, name: string): void => {
    setFilterData({
      ...filterData,
      specialities: { id, name },
    });
    history.push('/search-doctor');
  };

  return (
    <Fragment>
      <div className="margin-largeX margin-baseY">
        <b>Spesialisasi</b>
        <div style={{ float: 'right' }}>
          <div className="all-speciality-link" onClick={(): void => history.push('/all-speciality')}>
            Lihat Semua
          </div>
        </div>
      </div>

      {specialities.length > 0 ? (
        <div className="flex-inline" style={{ overflowX: 'auto', alignItems: 'baseline' }}>
          {specialities.map(({ id, nameIndo }, i) => (
            <div
              key={i}
              className={`text-center margin-tinyX ${i === 0 ? 'margin-largeL' : ''}`}
              style={{ fontSize: 12, cursor: 'pointer' }}
              onClick={(): void => clickedSpecialities(id, nameIndo)}
            >
              <Image
                avatar
                size="tiny"
                style={{ height: '64px', width: '64px' }}
                src={`${baseIconURL}Icon ${nameIndo}-min.png`}
              />
              {nameIndo}
            </div>
          ))}
          &emsp;
        </div>
      ) : (
        <SpecialitiesSectionSkeleton />
      )}
    </Fragment>
  );
};

const SpecialitiesSectionSkeleton = (): JSX.Element => {
  return (
    <div className="flex-inline" style={{ overflowX: 'auto', alignItems: 'baseline' }}>
      {((): JSX.Element[] => {
        const cicle = [];
        for (let cardLoops = 0; cardLoops < 5; cardLoops++) {
          cicle.push(
            <div key={cardLoops} className={`text-center margin-tinyX ${cardLoops === 0 ? 'margin-largeL' : ''}`}>
              <Skeleton circle={true} height={64} width={64} />
            </div>,
          );
        }
        return cicle;
      })()}
    </div>
  );
};
export default SpecialitiesSection;
