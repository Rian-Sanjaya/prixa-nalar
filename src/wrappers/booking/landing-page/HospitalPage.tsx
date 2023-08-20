import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Icon, Image, Button } from 'prixa-design-kit/dist';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { LoadPage } from '../../diagnostic/LoadPage';
import { BookingContext } from '../booking-page/BookingContext';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { HospitalType } from './AllHospitalPage';
import './landingPage.scss';

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;
const defaultHospitalUrl = `${process.env.REACT_APP_ASSET_URL}/Appointment%20Booking/Rumah%20Sakit.png`;

export const HospitalPage = () => {
  const { setFilterData, setAllSpecialities } = useContext(BookingContext);
  const [hospitalInformation, setHospitalInformation] = useState<HospitalType | undefined>(undefined);
  const [hospitalArea, setHospitalArea] = useState();
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const history = useHistory();
  const { setHeader, setMenu } = useContext(HeaderContext);

  useEffect(() => {
    setHeader('');
    setMenu(false);
  }, [setHeader, setMenu]);

  useEffect(() => {
    const hopsitalUrl = window.location.href.split('hospital/')[1];
    const hospitalName = hopsitalUrl.replace(/-/g, ' ');

    setIsSearching(true);
    getAPI(`${BOOKING_API.HOSPITALS}?nameKeyword=${hospitalName}`).then(async (response: any) => {
      const hospitalData = response.data[0];
      setHospitalInformation(hospitalData);
      getAPI(BOOKING_API.AREA(hospitalData.areaId)).then(async (response: any) => {
        setHospitalArea(response.data.name);
        setIsSearching(false);
      });
    });
  }, []);

  const searchDoctorByHospital = (id = '', nameIndo = '') => {
    hospitalInformation &&
      getAPI(`${BOOKING_API.DOCTORS}?param.hospitals=${hospitalInformation.id}`).then(async (response: any) => {
        setFilterData({
          area: { id: hospitalInformation.areaId, name: hospitalArea },
          hospitals: { id: hospitalInformation.id, name: hospitalInformation.name },
          specialities: { id: id, name: nameIndo },
        });
        history.push('/search-doctor');
      });
  };

  const showSpecialitiesByHospital = (specialities: object) => {
    hospitalInformation &&
      setFilterData({
        area: { id: hospitalInformation.areaId, name: hospitalArea },
        hospitals: { id: hospitalInformation.id, name: hospitalInformation.name },
        specialities: { id: '', name: '' },
      });
    setAllSpecialities(specialities);
    history.push('/all-speciality');
  };

  const whenImageError = (e: any) => {
    e.target.src = defaultHospitalUrl;
  };

  if (isSearching) return <LoadPage />;

  return (
    <Fragment>
      <div className="prixa-container is-top is-full">
        <div className="prixa-menuback margin-baseT" onClick={() => window.history.back()}>
          <Icon type="chevron-left" style={{ width: 16 }} />
        </div>
        <div className="prixa-hospital-image">
          <Image
            alt={hospitalInformation && hospitalInformation.name}
            src={
              hospitalInformation && hospitalInformation.imageUrl ? hospitalInformation.imageUrl : defaultHospitalUrl
            }
            onError={e => whenImageError(e)}
          />
        </div>
        <div className="padding-large">
          <div className="prixa-hospital-information">
            <div className="title">
              <Text scale="question" className="color-dark margin-microB">
                {hospitalInformation && hospitalInformation.name}
              </Text>
              <Text scale="content" className="color-disabled">
                {hospitalArea}
              </Text>
            </div>
            <div className="information">
              <Text scale="headerTitle" className="color-dark margin-smallB">
                Informasi
              </Text>
              <div className="information-list">
                <Icon color="disabled" type="map-marker-alt" width="12px" className="margin-smallR" />
                <Text scale="headerSubtitle" fontWeight={400}>
                  {hospitalInformation && (hospitalInformation.address.street || '-')}
                </Text>
              </div>
              <div className="information-list">
                <Icon color="disabled" type="phone-alt" width="12px" className="margin-smallR" />
                <Text scale="headerSubtitle" fontWeight={400}>
                  {hospitalInformation && (hospitalInformation.contact.phoneNumber || '-')}
                </Text>
              </div>
              <div className="information-list">
                <Icon color="disabled" type="envelope" width="12px" className="margin-smallR" />
                <Text scale="headerSubtitle" fontWeight={400}>
                  {hospitalInformation && (hospitalInformation.contact.email || '-')}
                </Text>
              </div>
            </div>
            <div className="specialization">
              <Text scale="headerTitle" className="color-dark margin-smallB">
                Spesialisasi
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                {hospitalInformation &&
                  hospitalInformation.specialities.map(({ id, nameIndo }: any, i: number) =>
                    i < 4 ? (
                      <div
                        key={i}
                        className="prixa-hospital-specialities"
                        onClick={() => searchDoctorByHospital(id, nameIndo)}
                      >
                        <Image avatar size="tiny" src={`${baseIconURL}Icon ${nameIndo}-min.png`} />
                        <span>{nameIndo}</span>
                      </div>
                    ) : (
                      ''
                    ),
                  )}
                {hospitalInformation && hospitalInformation.specialities.length > 4 ? (
                  <div
                    className="prixa-hospital-specialities"
                    onClick={() => showSpecialitiesByHospital(hospitalInformation.specialities)}
                  >
                    <div className="prixa-rest-specialities">+ {hospitalInformation.specialities.length - 4}</div>
                    <span className="rest-specialities">Lainnya</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="prixa-footer-button">
        <Button size="full" variant="primary" onClick={() => searchDoctorByHospital()}>
          Cari Dokter
        </Button>
      </div>
    </Fragment>
  );
};

export default HospitalPage;
