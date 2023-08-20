import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Text } from 'prixa-design-kit/dist';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { BookingContext } from '../booking-page/BookingContext';
import moment from 'moment';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { addToLocalStorageObject } from '../../../utils/addToLocalStorage';

const BookingTimeTab = () => {
  const { doctorData, date } = useContext(BookingContext);
  const [slots, setSlots] = useState([]);

  const [isTimeTabReady, setTimeTabReady] = useState(false);
  const [isTimeSlotAvailable, setTimeSlotAvailability] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    const bookingDate = moment(date || '').format('YYYY-MM-DD');
    getAPI(BOOKING_API.TIME_SLOT(doctorData.hospitals.id, doctorData.id, String(bookingDate))).then(
      async (res: any) => {
        const timeSlotList = res.data;
        if (timeSlotList.length > 0) {
          const format = 'hh:mm:ss';
          const tabPagi = timeSlotList.filter((timeSlot: any) => {
            const time = moment(timeSlot.from_time, format);
            const beforeTime = moment('06:59:00', format);
            const afterTime = moment('11:01:00', format);

            return time.isBetween(beforeTime, afterTime) && !('isFull' in timeSlotList);
          });

          const tabSiang = timeSlotList.filter((timeSlot: any) => {
            const time = moment(timeSlot.from_time, format);
            const beforeTime = moment('11:00:00', format);
            const afterTime = moment('15:01:00', format);

            return time.isBetween(beforeTime, afterTime) && !('isFull' in timeSlotList);
          });

          const tabSore = timeSlotList.filter((timeSlot: any) => {
            const time = moment(timeSlot.from_time, format);
            const beforeTime = moment('15:00:00', format);
            const afterTime = moment('18:01:00', format);

            return time.isBetween(beforeTime, afterTime) && !('isFull' in timeSlotList);
          });

          const tabMalam = timeSlotList.filter((timeSlot: any) => {
            const time = moment(timeSlot.from_time, format);
            const beforeTime = moment('18:00:00', format);
            const afterTime = moment('22:01:00', format);

            return time.isBetween(beforeTime, afterTime) && !('isFull' in timeSlotList);
          });

          const timeSlotGroup: any = [
            { title: 'Pagi', data: tabPagi },
            { title: 'Siang', data: tabSiang },
            { title: 'Sore', data: tabSore },
            { title: 'Malam', data: tabMalam },
          ];

          setSlots(timeSlotGroup);
          setTimeSlotAvailability(true);
          setTimeTabReady(true);
        } else {
          setTimeSlotAvailability(false);
          setTimeTabReady(true);
        }
      },
    );
  }, []);
  /* eslint-enable */

  return (
    <div className="margin-baseB">
      {isTimeTabReady ? (
        <TimeTab slots={slots} isTimeSlotAvailable={isTimeSlotAvailable} />
      ) : (
        <SkeletonTheme>
          <div className="margin-smallB">
            <Skeleton />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ width: '20%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '20%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '20%' }}>
              <Skeleton height={37} />
            </span>
            <span style={{ width: '20%' }}>
              <Skeleton height={37} />
            </span>
          </div>
        </SkeletonTheme>
      )}
    </div>
  );
};

const TimeTab = ({ slots, isTimeSlotAvailable }: any) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { time, setTime } = useContext(BookingContext);

  useEffect(() => {
    addToLocalStorageObject('bookingAppointmentData', 'bookingTime', time);
  }, [time]);

  return (
    <Fragment>
      {isTimeSlotAvailable ? (
        <Fragment>
          <Text scale="headerTitle">Pilih jam kunjungan Anda:</Text>
          <div className="prixa-tabs margin-baseT">
            <Tabs selectedIndex={tabIndex} onSelect={tabIndex => setTabIndex(tabIndex)}>
              <TabList>
                {/* eslint-disable */
                  slots.map((tab: any, key: number) => {
                    if (tab.data.length > 0) {
                      return <Tab key={key}>{tab.title}</Tab>;
                    }
                  })}
              </TabList>
              {slots.map((tabPanel: any, key: number) => {
                if (tabPanel.data.length > 0) {
                  return (
                    <TabPanel key={key}>
                      <div className="flex-4-cols margin-baseY">
                        {tabPanel.data.map((item: any, key: number) => {
                          return (
                            <div key={key}>
                              <label className="prixa-time-slot">
                                <input
                                  type="radio"
                                  className="prixa-time-slot-button"
                                  name="radio-btn"
                                  checked={time === item}
                                  value={item.from_time}
                                  onChange={() => {
                                    setTime(item);
                                  }}
                                  data-cy="time-slot"
                                />
                                <span className="prixa-time-slot-label">
                                  {item.from_time.substring(0, item.from_time.length - 3)}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </TabPanel>
                  );
                }
              })
               /* eslint-enable */}
            </Tabs>
          </div>
        </Fragment>
      ) : (
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Text className="color-danger" scale="pageTitle">
            Maaf slot waktu belum tersedia. Silahkan kembali untuk memilih tanggal yang lain.
          </Text>
        </div>
      )}
    </Fragment>
  );
};

export { BookingTimeTab };
