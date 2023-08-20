import React, { useEffect, useContext, useState } from 'react';
import { Image, Text } from 'prixa-design-kit/dist';
import { SpecialityType } from './SpecialitiesSection';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { LoadPage } from '../../diagnostic/LoadPage';
import { ErrorPage } from '../../../wrappers/diagnostic/ErrorPage';
import { BookingContext } from '../booking-page/BookingContext';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { useHistory } from 'react-router-dom';

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;

export const AllSpecialityPage = (): JSX.Element => {
  const [error, setError] = useState('');
  const { filterData, setFilterData, allSpecialities, setAllSpecialities } = useContext(BookingContext);
  const history = useHistory();
  const { setHeader, setMenu } = useContext(HeaderContext);

  useEffect(() => {
    setHeader('Spesialisasi');
    setMenu(false);

    if (!allSpecialities)
      Promise.all([getAPI(BOOKING_API.SPECIALITIES), getAPI(BOOKING_API.SPECIALITIES + '?page=2')]).then(
        (allResp: any) => {
          if (allResp && allResp.length > 0 && allResp[0].data && allResp[1].data) {
            const merge = allResp[0].data.concat(allResp[1].data);
            setAllSpecialities(merge);
          } else {
            setError('Maaf, ada kesalahan dari kami');
          }
        },
      );
  }, [allSpecialities, setAllSpecialities, setHeader, setMenu]);

  const clickedSpecialities = (id: string, name: string): void => {
    setFilterData({
      ...filterData,
      specialities: { id, name },
    });
    history.push('/search-doctor');
  };

  if (error) return <ErrorPage text={error} goTo="/" />;

  if (!allSpecialities) return <LoadPage />;

  return (
    <div className="prixa-container is-top">
      {filterData.hospitals.name ? (
        <div className="margin-baseB padding-baseX">
          <Text scale="content">
            Ditemukan <b>{allSpecialities.length} Spesialisasi</b> di <b>{filterData.hospitals.name}</b>
          </Text>
        </div>
      ) : (
        ''
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {allSpecialities.map(({ id, nameIndo }: SpecialityType, i: number) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <div
              className={`margin-smallB padding-microX`}
              style={{
                fontSize: 12,
                display: 'flex',
                flexDirection: 'row',
                cursor: 'pointer',
                alignItems: 'center',
              }}
              onClick={(): void => clickedSpecialities(id, nameIndo)}
            >
              <Image
                avatar
                size="tiny"
                className="margin-tinyR"
                style={{ height: '32px', width: '32px' }}
                src={`${baseIconURL}Icon ${nameIndo}-min.png`}
              />
              {nameIndo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSpecialityPage;
