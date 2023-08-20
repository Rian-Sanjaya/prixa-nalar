import React, { useEffect, useContext, useState } from 'react';
import { Button } from 'prixa-design-kit/dist';
import { BookingStep } from './BookingStep';
import { DoctorCard } from './DoctorCard';
import { DateAndTimeCard } from './DateAndTimeCard';
import { BookingTimeTab } from './BookingTimeTab';
import { BookingContext } from '../booking-page/BookingContext';

export const BookingTimePage = () => {
  const { time } = useContext(BookingContext);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    JSON.stringify(time) !== '{}' ? setIsValid(true) : setIsValid(false);
  }, [time]);

  return (
    <div className="prixa-container is-top is-full">
      <div className="padding-largeX padding-largeB">
        <div>
          <BookingStep step={2} />
        </div>
        <div className="margin-smallB">
          <DoctorCard />
        </div>
        <div className="margin-baseB">
          <DateAndTimeCard />
        </div>
        <div>
          <BookingTimeTab />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button link="/booking-data" size="base" variant="primary" disabled={!isValid}>
            Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
};

export { BookingTimePage as default };
