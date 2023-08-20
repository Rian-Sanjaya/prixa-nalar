import React, { useEffect, useContext, useState } from 'react';
import { Image, Button } from 'prixa-design-kit/dist';
import { SpecialityType } from './SpecialitiesSection';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { LoadPage } from '../../diagnostic/LoadPage';
import { ErrorPage } from '../../../wrappers/diagnostic/ErrorPage';
import { BookingContext } from '../booking-page/BookingContext';
import { HeaderContext } from '../../../components/header/HeaderContext';

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;

interface AllSpecialityProps {
  setModal: any;
}

export const AllSpecialitySideSheet = ({ setModal }: AllSpecialityProps): JSX.Element => {
  const [error, setError] = useState('');
  const { filterData, setFilterData, allSpecialities, setAllSpecialities } = useContext(BookingContext);
  const { setHeader, setMenu } = useContext(HeaderContext);
  const [specialityId, setSpecialityId] = useState('');
  const [specialityName, setSpecialityName] = useState('');

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

  useEffect(() => {
    if (filterData.specialities.id) {
      setSpecialityId(filterData.specialities.id);
      setSpecialityName(filterData.specialities.name);
    }
  }, [filterData]);

  const clickedSpecialities = (id: string, name: string): void => {
    setSpecialityId(id);
    setSpecialityName(name);
  };

  const selectSpeciality = () => {
    setFilterData({
      ...filterData,
      specialities: { id: specialityId, name: specialityName },
    });
    setModal(false);
  };

  if (error) return <ErrorPage text={error} goTo="/" />;

  if (!allSpecialities) return <LoadPage />;

  return (
    <div className="prixa-container is-topi is-full">
      <div className="margin-largeX margin-baseT margin-xLargeB padding-baseB">
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
                  style={{
                    height: '32px',
                    width: '32px',
                    boxShadow: id === specialityId ? '0 1px 1px 0 var(--primary), 0 0 0 2px var(--primary)' : 'none',
                  }}
                  src={`${baseIconURL}Icon ${nameIndo}-min.png`}
                />
                <span className={id === specialityId ? 'color-primary text-bold' : 'color-default'}>{nameIndo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="prixa-fixed-footer">
        <div className="padding-small bg-white" style={{ boxShadow: '0 -4px 8px 0 rgba(76, 79, 84, 0.16)' }}>
          <Button
            disabled={specialityId === ''}
            style={{ borderRadius: '4px', height: '40px' }}
            size="full"
            variant="primary"
            onClick={selectSpeciality}
          >
            Pilih
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllSpecialitySideSheet;
