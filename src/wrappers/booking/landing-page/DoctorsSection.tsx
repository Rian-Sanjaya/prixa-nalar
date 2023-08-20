import React, { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Image, Text } from 'prixa-design-kit/dist';
import { SpecialityType } from './SpecialitiesSection';
import { BookingContext } from '../booking-page/BookingContext';
import Skeleton from 'react-loading-skeleton';
import { HospitalType } from './AllHospitalPage';
import { addToLocalStorageObject } from '../../../utils/addToLocalStorage';
import '../../../components/listview/listview.scss';
import { removeBookingAppointmentData } from '../../../utils/constant';

export interface DoctorType {
  id: string;
  name: string;
  speciality: SpecialityType;
  imageUrl?: string;
  hospitals: Array<HospitalType>;
}

const defaultDoctor = `${process.env.REACT_APP_ASSET_URL}/telemed/Cari Dokter.png`;

export const DoctorsSection = ({ data }: { data: Array<DoctorType> }) => {
  const history = useHistory();
  const { setDoctorData, setDate, setTime, setBookingData } = useContext(BookingContext);

  /* eslint-disable */
  useEffect(() => {
    setDoctorData({});
    setDate(null);
    setTime({});
    setBookingData({});
  }, []);
  /* eslint-enable */

  const goToBookingDatePage = (id: string, imageUrl: any, name: string, speciality: any, hospitals: any) => {
    history.push('/booking-date');

    const doctorData = {
      id: id,
      imageUrl: imageUrl,
      name: name,
      speciality: speciality,
      hospitals: hospitals,
    };

    setDoctorData(doctorData);
    removeBookingAppointmentData();
    addToLocalStorageObject('bookingAppointmentData', 'doctorData', doctorData);
  };

  return (
    <Fragment>
      <div className="margin-largeX margin-baseY">
        <b>Dokter</b>
      </div>

      <div className="prixa-list-container margin-largeB">
        {data.length > 0 ? (
          data.map(({ id, imageUrl, name, speciality, hospitals }, i) => (
            <div
              className={`prixa-list ${i === 0 ? 'no-border-top' : ''}`}
              key={i}
              style={{ display: 'flex', cursor: 'pointer', margin: '0 20px', padding: '20px' }}
              data-cy="landing-doctor-list"
              onClick={() => goToBookingDatePage(id, imageUrl, name, speciality, hospitals[0])}
            >
              <div style={{ height: '64px', width: '64px' }}>
                <Image
                  avatar
                  size="small"
                  style={{ height: '64px', width: '64px', objectFit: 'cover' }}
                  src={imageUrl ? imageUrl : defaultDoctor}
                />
              </div>

              <div className="margin-smallL text-ellipsis">
                <Text scale="headerTitle">{name}</Text>
                <br />
                <Text scale="content">
                  <b>{speciality.nameIndo}</b>
                </Text>
                <br />
                <Text scale="content">{hospitals[0].name}</Text>
              </div>
            </div>
          ))
        ) : (
          <DoctorsSectionSkeleton />
        )}
      </div>
    </Fragment>
  );
};

const DoctorsSectionSkeleton = () => {
  return (
    <div className="prixa-list-container margin-largeB">
      {(() => {
        const list = [];
        for (let listLoops = 1; listLoops <= 5; listLoops++) {
          list.push(
            <div
              className={`prixa-list ${listLoops === 1 ? 'no-border-top' : ''}`}
              key={listLoops}
              style={{ display: 'flex', cursor: 'pointer', margin: '0 20px', padding: '20px' }}
            >
              <div style={{ height: '64px', width: '64px' }}>
                <Skeleton circle height={64} width={64} />
              </div>
              <div className="margin-smallL text-ellipsis">
                <Skeleton width={200} />
                <br />
                <Skeleton width={100} />
                <br />
                <Skeleton width={150} />
              </div>
            </div>,
          );
        }
        return list;
      })()}
    </div>
  );
};

export default DoctorsSection;
