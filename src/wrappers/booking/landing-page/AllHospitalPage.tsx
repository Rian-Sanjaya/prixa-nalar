import React, { useEffect, useState, useContext } from 'react';
import { Image, Text, FlatLoading } from 'prixa-design-kit/dist';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { LoadPage } from '../../diagnostic/LoadPage';
import { SpecialityType } from './SpecialitiesSection';
import { useScrollToFetch } from '../../../utils/useScrollToFetch';
import { HeaderContext } from '../../../components/header/HeaderContext';
import '../../../components/listview/listview.scss';

const defaultHospitalUrl = `${process.env.REACT_APP_ASSET_URL}/Appointment%20Booking/Rumah%20Sakit.png`;

export interface HospitalType {
  id: string;
  name: string;
  alias?: string;
  address?: any;
  contact?: any;
  coordinate?: object;
  areaId?: string;
  specialities: Array<SpecialityType>;
  location?: string;
  imageUrl?: string;
}

const removeDuplicateObject = (arr: any, param: string | number) =>
  arr.filter((data: any, index: number, self: any) => self.findIndex((t: any) => t[param] === data[param]) === index);

export const AllHospitalPage = () => {
  const [isNeedFetching, setIsNeedFetching] = useScrollToFetch();
  const [pageParams, setPageParams] = useState<number>(1);
  const [allHospital, setAllHospital] = useState<Array<HospitalType> | undefined>(undefined);
  const { setHeader, setMenu } = useContext(HeaderContext);

  useEffect(() => {
    setHeader('Rumah Sakit');
    setMenu(false);
  }, [setHeader, setMenu]);

  /* eslint-disable */
  useEffect(() => {
    const getData = () => {
      getAPI(`${BOOKING_API.HOSPITALS}?page=${pageParams}`).then(async (res: any) => {
        if (res.data) {
          setAllHospital(prev => prev 
            ? 
            removeDuplicateObject(prev.concat(res.data), 'id')
            : 
            res.data);
          setPageParams(prev => prev + 1);
        }
        setIsNeedFetching(false);
      });
    };

    if (!allHospital) getData();

    if (isNeedFetching) getData();
  }, [isNeedFetching, allHospital, setPageParams, setAllHospital]);
  /* eslint-enable */

  if (!allHospital) return <LoadPage />;

  const getHospitalInfo = (name: string) => {
    const hospitalUrl = name.replace(/\s+/g, '-').toLowerCase();
    window.location.href = '/hospital/' + hospitalUrl;
  };

  const whenImageError = (e: any) => {
    e.target.src = defaultHospitalUrl;
  };

  return (
    <div className="prixa-container is-top is-full">
      <div className="prixa-list-container" style={{ margin: '0 20px' }}>
        {allHospital.map(({ id, imageUrl, name, address }, i) => (
          <div
            className={`prixa-list hoverable ${i === 0 ? 'no-border-top' : ''}`}
            key={i}
            style={{ display: 'flex' }}
            onClick={() => getHospitalInfo(name)}
          >
            <div style={{ height: '64px', width: '64px' }}>
              <Image
                size="small"
                rounded
                style={{ height: '64px', width: '64px' }}
                src={imageUrl ? imageUrl : defaultHospitalUrl}
                onError={e => whenImageError(e)}
              />
            </div>

            <div className="margin-smallL">
              <Text scale="headerTitle">{name}</Text>
              <br />
              <Text scale="content">
                <Text scale="content" className="color-disabled">
                  {address.district}
                </Text>
              </Text>
              <br />
              <Text scale="content" className="color-disabled">
                {address.street}
              </Text>
            </div>
          </div>
        ))}
      </div>
      {isNeedFetching && (
        <div className="flex-inline centered">
          <FlatLoading className="margin-base " color="primary" size="60px" />
        </div>
      )}
    </div>
  );
};

export default AllHospitalPage;
