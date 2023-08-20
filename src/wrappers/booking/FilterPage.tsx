import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  FormLabel,
  Dropdown,
  DropdownItem,
  Image,
  Button,
  Link,
  Sidesheet,
  openSideSheet,
  closeSideSheet,
  SearchBox,
} from 'prixa-design-kit/dist';
import { BookingContext } from './booking-page/BookingContext';
import { getAPI } from '../../api/api-method';
import { BOOKING_API } from '../../api/api-url';
import { LoadPage } from '../diagnostic/LoadPage';
import { SpecialityType } from './landing-page/SpecialitiesSection';
import { useHistory } from 'react-router-dom';
import { HeaderContext } from '../../components/header/HeaderContext';
import AllSpecialitySideSheet from './landing-page/AllSpecialitySideSheet';

interface FilterDetailType {
  id: string;
  name: string;
}
export interface FilterDataType {
  area: FilterDetailType;
  hospitals: FilterDetailType;
  specialities: FilterDetailType;
}

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;

export const FilterPage = () => {
  const { filterData, setFilterData, allSpecialities, setAllSpecialities } = useContext(BookingContext);
  const [areaOptions, setAreaOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [areaText, setareaText] = useState(filterData.area.name);
  const [areaValue, setareaValue] = useState(filterData.area.id);
  const [hospitalText, sethospitalText] = useState(filterData.hospitals.name);
  const [hospitalValue, sethospitalValue] = useState(filterData.hospitals.id);
  const [specialitiesValue, setspecialitiesValue] = useState(filterData.specialities.id);
  const [specialitiesText, setspecialitiesText] = useState(filterData.specialities.name);
  const history = useHistory();
  const { setHeader, setMenu, setReset, handleReset, setHandleReset } = useContext(HeaderContext);
  const topSpecialities = [
    'Dokter Umum',
    'Penyakit Dalam',
    'Pediatri (Anak)',
    'Kebidanan & Kandungan',
    'Kedokteran Gigi',
  ];
  const [specialitySideSheet, setSpecialitySideSheet] = React.useState(false);
  const [options, setOptions] = React.useState([{}]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeader('Filter');
    setMenu(false);
  }, [setMenu, setHeader]);

  useEffect(() => {
    setReset(true);
  }, [setReset]);

  const setSpecialityModalSideSheet = (val: boolean) => {
    setSpecialitySideSheet(val);
    if (!val) closeSideSheet();
  };

  const resetFilterHandler = () => {
    setareaText('');
    sethospitalText('');
    setAreaOptions(areaOptions);
    setAreaOptions(areaOptions);
    setHospitalOptions(hospitalOptions);
    setspecialitiesValue('');
    setspecialitiesText('');
    setFilterData({ area: { id: '', name: '' }, hospitals: { id: '', name: '' }, specialities: { id: '', name: '' } });
  };

  const resetData = () => {
    resetFilterHandler();
    setHandleReset(false);
  };

  const searchContent = async (value: string) => {
    getAPI(`${BOOKING_API.SPECIALITIES}?name=${value}`).then((resp: any) => {
      const resultList: Array<object> = [];
      if (resp.data) {
        resp.data.forEach((res: any) => {
          const limitResult = { value: res.id, text: res.nameIndo, icon: `${baseIconURL}Icon ${res.nameIndo}-min.png` };
          resultList.push(limitResult);
        });
      }
      setOptions(resultList);
    });
  };

  const selectSpeciality = ({ value, text }: { value?: any; text?: string }) => {
    setspecialitiesText(text!);
    setspecialitiesValue(value);
  };

  /* eslint-disable */
  useEffect(() => {
    if (handleReset) resetData();
  }, [handleReset]);
  /* eslint-enable */

  const selectArea = useCallback((props: DropdownItem) => {
    getAPI(`${BOOKING_API.HOSPITALS}?areaId=${props.value}`).then((resp: any) => {
      setHospitalOptions(resp.data ? resp.data.map((hspitl: any) => ({ value: hspitl.id, text: hspitl.name })) : []);
      setareaText(props.text!);
      setareaValue(props.value);
      sethospitalText('');
      sethospitalValue('');
    });
  }, []);

  const selectHospital = useCallback((props: DropdownItem) => {
    sethospitalText(props.text!);
    sethospitalValue(props.value);
  }, []);

  const selectSpecialities = useCallback((props: DropdownItem) => {
    setspecialitiesText(props.text!);
    setspecialitiesValue(props.value);
  }, []);

  useEffect(() => {
    if (filterData.area.id) {
      selectArea({ text: filterData.area.name, value: filterData.area.id });
    }
  }, [filterData.area, selectArea]);

  useEffect(() => {
    if (filterData.specialities.id) {
      selectSpecialities({ text: filterData.specialities.name, value: filterData.specialities.id });
    }
  }, [filterData.specialities, selectSpecialities]);

  useEffect(() => {
    if (
      filterData.hospitals.name &&
      hospitalOptions.find((hsptl: DropdownItem) => hsptl.value === filterData.hospitals.id)
    ) {
      setTimeout(() => sethospitalText(filterData.hospitals.name), 200);
    }
  }, [hospitalOptions, filterData.hospitals]);

  useEffect(() => {
    getAPI(BOOKING_API.AREAS).then((resp: any) => {
      setAreaOptions(resp.data.map((area: any) => ({ value: area.id, text: area.name })));
    });

    Promise.all([getAPI(BOOKING_API.SPECIALITIES), getAPI(BOOKING_API.SPECIALITIES + '?page=2')]).then(
      (allResp: any) => {
        const merge = allResp[0].data.concat(allResp[1].data);
        setAllSpecialities(merge);
      },
    );
  }, [setAllSpecialities]);

  const setFilterDataHandler = () => {
    setFilterData({
      area: { id: areaValue, name: areaText },
      hospitals: { id: hospitalValue, name: hospitalText },
      specialities: { id: specialitiesValue, name: specialitiesText },
    });
    history.push('/search-doctor');
  };

  const showAllSpeciality = () => {
    setSpecialitySideSheet(true);
    openSideSheet();
  };

  const clearSpeciality = () => {
    setspecialitiesText('');
    setspecialitiesValue('');
  };

  if (areaOptions.length === 0 || !allSpecialities) return <LoadPage />;

  return (
    <div className="prixa-container is-top is-full">
      <div className="margin-largeX">
        <div className="margin-baseT">
          <FormLabel errors={false}>Area</FormLabel>
          <Dropdown options={areaOptions} placeholder="Pilih Area" onSelect={selectArea} value={areaText} />
        </div>
        <div className="margin-smallT">
          <FormLabel errors={false}>Rumah Sakit</FormLabel>
          <Dropdown
            options={hospitalOptions}
            placeholder="Pilih Rumah Sakit"
            onSelect={selectHospital}
            value={hospitalText}
            disabled={!areaText}
          />
        </div>
        <div className="margin-smallT">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <FormLabel errors={false}>Spesialisasi</FormLabel>
            <Link scale="feedbackLink" onClick={() => showAllSpeciality()}>
              LIHAT SEMUA
            </Link>
          </div>
          <SearchBox
            options={options}
            placeholder="Misal: Kandungan"
            onSearch={() => searchContent(specialitiesText)}
            onSelect={selectSpeciality}
            setData={setspecialitiesText}
            withDebounce={true}
            value={specialitiesText}
            onClear={clearSpeciality}
          />
        </div>
        <div className="margin-smallT">
          <FormLabel style={{ fontSize: '12px' }} errors={false}>
            Sering Dicari
          </FormLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {allSpecialities.map(({ id, nameIndo }: SpecialityType, i: number) =>
              topSpecialities.includes(nameIndo) ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                  }}
                  key={i}
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
                    onClick={() => selectSpecialities({ value: id, text: nameIndo })}
                  >
                    <Image
                      avatar
                      size="tiny"
                      className="margin-tinyR"
                      style={{
                        height: '32px',
                        width: '32px',
                      }}
                      src={`${baseIconURL}Icon ${nameIndo}-min.png`}
                    />
                    <span className="color-default">{nameIndo}</span>
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
          </div>
        </div>
      </div>
      <div className="prixa-fixed-footer">
        <Button size="full" variant="primary" onClick={setFilterDataHandler}>
          Cari
        </Button>
      </div>
      <Sidesheet
        setModal={setSpecialitySideSheet}
        show={specialitySideSheet}
        title="Daftar Spesialisasi"
        className="prixa-sidesheet"
        content={<AllSpecialitySideSheet setModal={setSpecialityModalSideSheet} />}
      ></Sidesheet>
    </div>
  );
};

export default FilterPage;
