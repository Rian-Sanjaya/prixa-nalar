import React, { useContext } from 'react';
import { Card, Image, Text } from 'prixa-design-kit/dist';
import './bookingPage.scss';
import { BookingContext } from '../booking-page/BookingContext';

const defaultDoctor = `${process.env.REACT_APP_ASSET_URL}/telemed/Cari Dokter.png`;

const DoctorCard = () => {
  const { doctorData } = useContext(BookingContext);

  return (
    <Card className="prixa-doctor-card">
      <div className="image">
        <Image
          alt=""
          avatar
          size="small"
          src={doctorData.imageUrl ? doctorData.imageUrl : defaultDoctor}
          style={{ height: '64px', width: '64px', objectFit: 'cover' }}
        />
      </div>
      <div style={{ paddingLeft: 16 }}>
        <Text scale="headerTitle">{doctorData.name}</Text>
        <br />
        <Text style={{ fontWeight: 'bold' }} scale="content">
          {doctorData.speciality.nameIndo}
        </Text>
        <br />
        <Text scale="content">{doctorData.hospitals.name}</Text>
      </div>
    </Card>
  );
};

export { DoctorCard };
