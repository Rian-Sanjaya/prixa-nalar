import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Text } from 'prixa-design-kit/dist';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import DatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingContext } from '../booking-page/BookingContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { addToLocalStorageObject } from '../../../utils/addToLocalStorage';
registerLocale('id', id);

const BookingCalendar = () => {
  const { doctorData, setTime } = useContext(BookingContext);
  const [availableDays, setAvailableDays] = useState([]);
  const [isCalendarReady, setCalendarReady] = useState(false);
  const [isDateAvailable, setDateAvailability] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    setTime({});
    getAPI(BOOKING_API.SCHEDULE(doctorData.hospitals.id, doctorData.id)).then(async (res: any) => {
      const isScheduleExist = res.data.schedules;
      if (isScheduleExist) {
        const availableDaysResult = res.data.schedules.map((schedule: any) => schedule.day);
        availableDaysResult.forEach((item: any, i: number) => (item === 7 ? (availableDaysResult[i] = 0) : null));
        setDateAvailability(true);
        setAvailableDays(availableDaysResult);
        setCalendarReady(true);
      }
      else {
        setDateAvailability(false);
        setCalendarReady(true);
      }
    });
  }, []);
  /* eslint-enable */

  return (
    <div className="margin-largeB">
      {isCalendarReady ? (
        <Calendar availableDays={availableDays} isDateAvailable={isDateAvailable} />
      ) : (
        <SkeletonTheme>
          <div className="margin-tinyB">
            <Skeleton />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '14%' }}>
              <Skeleton height={37} />
            </span>
          </div>
        </SkeletonTheme>
      )}
    </div>
  );
};

const Calendar = ({ availableDays, isDateAvailable }: any) => {
  const { date, setDate } = useContext(BookingContext);

  const isWeekday = (dateSelected: any) => {
    const availableDaysArray: number[] = availableDays;
    const day: number = dateSelected.getDay();
    return availableDaysArray.includes(day);
  };

  useEffect(() => {
    addToLocalStorageObject('bookingAppointmentData', 'bookingDate', String(date));
  }, [date]);

  return (
    <Fragment>
      {isDateAvailable ? (
        <Fragment>
          <Text scale="headerTitle">Pilih tanggal kunjungan Anda:</Text>
          <div className="prixa-booking-calendar">
            <DatePicker
              selected={date}
              minDate={new Date()}
              onChange={(currentDate: any) => {
                setDate(currentDate);
                addToLocalStorageObject('bookingAppointmentData', 'bookingTime', {});
              }}
              filterDate={isWeekday}
              locale="id"
              inline
            />
          </div>
        </Fragment>
      ) : (
        <div
          data-cy="not-found-date"
          style={{ height: '200px', display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <Text className="color-danger" scale="pageTitle">
            Maaf jadwal belum tersedia. Silahkan kembali untuk memilih dokter yang lain.
          </Text>
        </div>
      )}
    </Fragment>
  );
};

export { BookingCalendar };
