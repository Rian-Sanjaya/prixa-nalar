import React, { useEffect, useContext, useState } from 'react';
import { Button } from 'prixa-design-kit/dist';
import { BookingStep } from './BookingStep';
import { DoctorCard } from './DoctorCard';
import { DateAndTimeCard } from './DateAndTimeCard';
import { BookingCalendar } from './BookingCalendar';
import { BookingContext } from '../booking-page/BookingContext';
import moment from 'moment';
import { HeaderContext } from '../../../components/header/HeaderContext';

export const BookingDatePage = () => {
  const { date } = useContext(BookingContext);
  const [isValid, setIsValid] = useState(false);
  const { setHeader, setMenu } = useContext(HeaderContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeader('Janji Temu Dokter');
    setMenu(false);
  }, [setMenu, setHeader]);

  useEffect(() => {
    moment(date).isValid() ? setIsValid(true) : setIsValid(false);
  }, [date]);

  return (
    <div className="prixa-container is-top is-full">
      <div className="padding-largeX padding-largeB">
        <div>
          <BookingStep step={1} />
        </div>
        <div className="margin-smallB">
          <DoctorCard />
        </div>
        <div className="margin-baseB">
          <DateAndTimeCard />
        </div>
        <div>
          <BookingCalendar />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button link="/booking-time" size="base" variant="primary" disabled={!isValid}>
            Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
};

export { BookingDatePage as default };
