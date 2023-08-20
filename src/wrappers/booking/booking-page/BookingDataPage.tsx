import React, { useEffect, useState } from 'react';
import { Button } from 'prixa-design-kit/dist';
import { BookingStep } from './BookingStep';
import { DoctorCard } from './DoctorCard';
import { DateAndTimeCard } from './DateAndTimeCard';
import { BookingForm } from './BookingForm';

export const BookingDataPage = () => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="prixa-container is-top is-full">
      <div className="padding-largeX padding-largeB">
        <div>
          <BookingStep step={3} />
        </div>
        <div className="margin-smallB">
          <DoctorCard />
        </div>
        <div className="margin-baseB">
          <DateAndTimeCard />
        </div>
        <div>
          <BookingForm setIsValid={setIsValid} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button link="/booking-confirmation" size="base" variant="primary" disabled={!isValid}>
            Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDataPage;
