import React, { useState, useContext, useEffect, Fragment } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { SearchBar, Image, Text, Icon } from 'prixa-design-kit/dist';
import { DoctorType } from './landing-page/DoctorsSection';
import { BookingContext } from './booking-page/BookingContext';
import { search } from '../../api/api-utils';
import { BOOKING_API } from '../../api/api-url';
import { LoadPage } from '../diagnostic/LoadPage';
import { addToLocalStorageObject } from '../../utils/addToLocalStorage';
import { HeaderContext } from '../../components/header/HeaderContext';
import '../../components/listview/listview.scss';
import './landing-page/landingPage.scss';
import { removeBookingAppointmentData } from '../../utils/constant';

const defaultDoctor = `${process.env.REACT_APP_ASSET_URL}/telemed/Cari Dokter.png`;
const noDoctorFound = `${process.env.REACT_APP_ASSET_URL}/error/Tidak Menemukan Daftar Dokter.png`;

export const SearchDoctorPage = (): JSX.Element => {
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [defaultList, setDefaultList] = useState<Array<DoctorType>>([]);
  const [resultSearch, setResultSearch] = useState<any>();
  const { setDoctorData, filterData } = useContext(BookingContext);
  const history = useHistory();
  const { setHeader, setMenu } = useContext(HeaderContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeader('Janji Temu Dokter');
    setMenu(false);
  }, [setMenu, setHeader]);

  const searchDoctors = (typedVal: string): void => {
    setSearchValue(typedVal);
    if (typedVal.length > 2) {
      setResultSearch([]);
      setIsSearching(true);
      let searchUrl = `${BOOKING_API.DOCTORS}?nameKeyword=${typedVal}&keywordIncludeSpeciality=true&`;
      if (filterData.hospitals.id) searchUrl = searchUrl + `hospitals[]=${filterData.hospitals.id}&`;
      if (filterData.area.id) searchUrl = searchUrl + `areaId=${filterData.area.id}&`;
      if (filterData.specialities.id) searchUrl = searchUrl + `specialities[]=${filterData.specialities.id}`;
      search(searchUrl).then(async (res: any) => {
        setResultSearch(res);
        setIsSearching(false);
      });
    } else {
      setResultSearch(defaultList);

      // requested: if input field on cari dokter is empty after type, go back to previous page
      if (typedVal === '') {
        history.goBack();
      }
    }
  };

  useEffect(() => {
    let searchUrl = `${BOOKING_API.DOCTORS}?`;
    if (filterData.hospitals.id) searchUrl = searchUrl + `hospitals[]=${filterData.hospitals.id}&`;
    if (filterData.area.id) searchUrl = searchUrl + `areaId=${filterData.area.id}&`;
    if (filterData.specialities.id) searchUrl = searchUrl + `specialities[]=${filterData.specialities.id}`;

    search(searchUrl).then(async (res: any) => {
      setResultSearch(res);
      setDefaultList(res);
      setIsSearching(false);
    });
  }, [filterData]);

  const goToBookingDatePage = (id: string, imageUrl: any, name: string, speciality: any, hospital: any): void => {
    history.push('/booking-date');

    const doctorData = {
      id: id,
      imageUrl: imageUrl,
      name: name,
      speciality: speciality,
      hospitals: hospital,
    };

    setDoctorData(doctorData);
    removeBookingAppointmentData();
    addToLocalStorageObject('bookingAppointmentData', 'doctorData', doctorData);
  };

  return (
    <div className="prixa-container is-top is-full">
      <div className="prixa-search-container">
        <SearchBar
          iconType="search"
          placeholder="Cari dokter"
          inputVal={searchValue}
          setInputVal={searchDoctors}
          width="100%"
          autoFocus
          isLoading={isSearching}
          withDebounce={true}
        />
        <Link className="prixa-search-filter-button padding-small margin-tinyL" to="/filter">
          <Icon color="black" type="sliders-h" width="16px" />
        </Link>
      </div>

      {isSearching && (
        <div className="prixa-center-middle">
          <LoadPage />
        </div>
      )}

      {!isSearching && resultSearch.length > 0 && (
        <div className="prixa-list-container margin-largeB">
          <div className="margin-baseY padding-largeX">
            <Text scale="content">
              Ditemukan{' '}
              <b>
                {resultSearch.length} Dokter {filterData.specialities.name}
              </b>{' '}
              {filterData.hospitals.name ? (
                <Fragment>
                  di <b>{filterData.hospitals.name}</b>
                </Fragment>
              ) : (
                ''
              )}
            </Text>
          </div>

          {resultSearch.map(({ id, imageUrl, name, speciality, hospitals }: any, i: number) => {
            const workedOnHospital: any = filterData.hospitals.name ? filterData.hospitals : hospitals[0];
            return (
              <div
                onClick={(): void => goToBookingDatePage(id, imageUrl, name, speciality, workedOnHospital)}
                className={`prixa-list ${i === 0 ? 'no-border-top' : ''}`}
                key={i}
                style={{ display: 'flex', cursor: 'pointer', margin: '0 20px', padding: '20px' }}
                data-cy="doctor-results"
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
                  <Text scale="content">{workedOnHospital.name}</Text>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isSearching && resultSearch.length === 0 && (
        <div className="prixa-center-middle">
          <Image
            src={noDoctorFound}
            alt="Tidak Menemukan Daftar Dokter"
            className="margin-smallB"
            style={{ height: 200 }}
          />
          <Text scale="content" data-cy="doctor-not-found">
            Dokter Tidak Ditemukan
          </Text>
        </div>
      )}
    </div>
  );
};

export default SearchDoctorPage;
