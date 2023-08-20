import React from 'react';
import './bookingPage.scss';

const BookingStep = ({ step }: any) => {
  return (
    <div className="prixa-booking-step">
      <ul className="progress-bar">
        <li className={step === 1 || step === 2 || step === 3 ? 'active' : ''}></li>
        <li className={step === 2 || step === 3 ? 'active' : ''}></li>
        <li className={step === 3 ? 'active' : ''}></li>
      </ul>
    </div>
  );
};

export { BookingStep };
