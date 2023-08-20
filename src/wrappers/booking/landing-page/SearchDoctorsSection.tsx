import React, { Fragment } from 'react';
import { Icon } from 'prixa-design-kit/dist';
import { DoctorType } from './DoctorsSection';
import Skeleton from 'react-loading-skeleton';
import { Link, useHistory } from 'react-router-dom';

interface SearchDoctorsSectionType {
  defaultList: Array<DoctorType>;
}
export const SearchDoctorsSection = ({ defaultList }: SearchDoctorsSectionType) => {
  const history = useHistory();

  const doRedirectToSearch = () => {
    history.push('/search-doctor');
  };

  return defaultList.length > 0 ? (
    <Fragment>
      <div className="prixa-search-container">
        <div
          className="padding-small prixa-search-to-open margin-tinyR"
          data-cy="search-doctor-trigger"
          onClick={doRedirectToSearch}
        >
          <Icon color="dark" type="search" />
          <i className="color-disabled margin-smallL" style={{ fontSize: '12px' }}>
            Cari dokter
          </i>
        </div>
        <Link className="prixa-search-filter-button padding-small" to="/filter">
          <Icon color="black" type="sliders-h" width="16px" />
        </Link>
      </div>
    </Fragment>
  ) : (
    <SearchDoctorsSectionSkeleton />
  );
};

const SearchDoctorsSectionSkeleton = () => {
  return (
    <div className="prixa-search-container">
      <div className="search-doctors-skeleton">
        <Skeleton height={50} />
      </div>
      <Skeleton circle={true} height={50} width={50} />
    </div>
  );
};

export default SearchDoctorsSection;
