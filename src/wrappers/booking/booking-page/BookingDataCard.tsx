import React, { useContext } from 'react';
import { Card, Text } from 'prixa-design-kit/dist';
import './bookingPage.scss';
import { BookingContext } from '../booking-page/BookingContext';
import moment from 'moment';
import 'moment/locale/id';

const BookingDataCard = () => {
  const { bookingData } = useContext(BookingContext);
  const { name, birthDate, nik, email, phoneNumber, paymentMethod } = bookingData;

  return (
    <Card>
      <div className="prixa-booking-data">
        <Text style={{ color: 'var(--dark-50)' }} scale="content">
          Nama Depan
        </Text>
        <Text scale="pageTitle">{name}</Text>
      </div>
      <div className="prixa-booking-data">
        <Text style={{ color: 'var(--dark-50)' }} scale="content">
          Tanggal Lahir
        </Text>
        <Text scale="pageTitle">
          {moment(birthDate)
            .locale('id')
            .format('DD MMMM YYYY')}
        </Text>
      </div>
      <div className="prixa-booking-data">
        <Text style={{ color: 'var(--dark-50)' }} scale="content">
          No KTP
        </Text>
        <Text scale="pageTitle">{nik}</Text>
      </div>
      <div className="prixa-booking-data">
        <Text style={{ color: 'var(--dark-50)' }} scale="content">
          Email
        </Text>
        <Text scale="pageTitle">{email}</Text>
      </div>
      <div className="prixa-booking-data">
        <Text style={{ color: 'var(--dark-50)' }} scale="content">
          No. HP
        </Text>
        <Text scale="pageTitle">{phoneNumber}</Text>
      </div>
      <div className="prixa-booking-data">
        <Text style={{ color: 'var(--dark-50)' }} scale="content">
          Metode Pembayaran
        </Text>
        <Text scale="pageTitle">{paymentMethod}</Text>
      </div>
    </Card>
  );
};

export { BookingDataCard };
