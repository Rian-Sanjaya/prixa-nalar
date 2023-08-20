import React, { useEffect, useState, useContext } from 'react';
import './landingPage.scss';
import { HospitalsSection } from './HospitalsSection';
import { SpecialitiesSection } from './SpecialitiesSection';
import { DoctorsSection, DoctorType } from './DoctorsSection';
import { SearchDoctorsSection } from './SearchDoctorsSection';
import { useScrollToFetch } from '../../../utils/useScrollToFetch';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { HospitalType } from './AllHospitalPage';
import { FlatLoading } from 'prixa-design-kit/dist';
import { BookingContext } from '../booking-page/BookingContext';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { ErrorPage } from '../../../wrappers/diagnostic/ErrorPage';

export const LandingPage = (): JSX.Element => {
  const [isNeedFetching, setIsNeedFetching] = useScrollToFetch();
  const [pageDoctor, setPageDoctor] = useState<number>(-1);
  const [hospitals, setHospitals] = useState<Array<HospitalType> | undefined>(undefined);
  const [tmpDoctor, setTmpDoctor] = useState<Array<DoctorType>>([]);
  const [listDoctor, setListDoctor] = useState<Array<DoctorType> | undefined>(undefined);
  const [error, setError] = useState('');
  const { setFilterData } = useContext(BookingContext);
  const { setHeader, setMenu } = useContext(HeaderContext);

  /* eslint-disable */
  useEffect(() => {
    getAPI(`${BOOKING_API.DOCTORS}?page=${pageDoctor}`).then(async (res: any) => {
      // only show 5 in the first load
      const tmp = res.data;
      setListDoctor(tmp.slice(0, 5));
      setTmpDoctor(tmp);
      setPageDoctor(prev => prev + 1);
    });

    getAPI(`${BOOKING_API.HOSPITALS}`).then(async (res: any) => {
      setHospitals(res.data.slice(0, 5));
    });

    setHeader('Janji Temu Dokter')
    setMenu(false);

    setFilterData({
      area: { id: '', name: '' },
      hospitals: { id: '', name: '' },
      specialities: { id: '', name: '' },
    });
  }, []);

  useEffect(() => {
    if (isNeedFetching && pageDoctor > 0) {
      getAPI(`${BOOKING_API.DOCTORS}?page=${pageDoctor}`).then(async (res: any) => {
        //after done fetch more data, do false on isNeedFetching
        if (res.data) {
          setListDoctor(prev => prev && prev.concat(res.data));
          setPageDoctor(prev => prev + 1);
        }
        setIsNeedFetching(false);
      });
    } else if (isNeedFetching && pageDoctor === 0) {
      setListDoctor(tmpDoctor);
      setPageDoctor(prev => prev + 1);
    }
  }, [isNeedFetching, pageDoctor, setPageDoctor, setListDoctor]);
  /* eslint-enable */

  if (error) return <ErrorPage text={error} goTo="/" />;

  return (
    <div className="prixa-container is-top is-full">
      {<SearchDoctorsSection defaultList={listDoctor?.slice(0, 5) || []} />}

      {<HospitalsSection data={hospitals || []} />}

      <SpecialitiesSection setError={setError} />

      {<DoctorsSection data={listDoctor || []} />}

      {isNeedFetching && (
        <div className="flex-inline centered">
          <FlatLoading className="margin-base " color="primary" size="60px" />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
