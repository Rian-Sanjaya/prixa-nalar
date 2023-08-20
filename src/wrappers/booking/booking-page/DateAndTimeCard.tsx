import React, { useContext } from 'react';
import { Card, Text } from 'prixa-design-kit/dist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import { BookingContext } from '../booking-page/BookingContext';
import moment from 'moment';
import 'moment/locale/id';

const DateAndTimeCard = () => {
  const { date, time } = useContext(BookingContext);

  const bookingDate = moment(date || '')
    .locale('id')
    .format('DD MMM YYYY');

  return (
    <div style={{ display: 'flex' }}>
      {date ? (
        <Card style={{ width: '50%', marginRight: '8px' }}>
          <FontAwesomeIcon style={{ color: 'var(--primary)', marginRight: '8px' }} icon={faCalendar} />
          <Text scale="content">{bookingDate}</Text>
        </Card>
      ) : (
        ''
      )}
      {Object.keys(time).length !== 0 ? (
        <Card style={{ width: '50%', marginLeft: '8px' }}>
          <FontAwesomeIcon style={{ color: 'var(--primary)', marginRight: '8px' }} icon={faClock} />
          <Text scale="content">{time.from_time.substring(0, time.from_time.length - 3)}</Text>
        </Card>
      ) : (
        ''
      )}
    </div>
  );
};

export { DateAndTimeCard };
