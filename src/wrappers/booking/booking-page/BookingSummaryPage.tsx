import React, { useEffect, useState } from 'react';
import { Text, Button } from 'prixa-design-kit/dist';
import './bookingPage.scss';
import { BookingSummaryShare } from './BookingSummaryShare';
import { LoadPage } from '../../../wrappers/diagnostic/LoadPage';
import imgHeader from '../../../img/prixa-logo-header.png';
import { removeBookingAppointmentData } from '../../../utils/constant';

export const BookingSummaryPage = () => {
  const [bookingAppointmentData, setBookingAppointmentData] = useState({
    name: null,
    appointmentDate: null,
    appointmentTime: null,
    doctorName: null,
    doctorSpeciality: null,
    hospitalName: null,
    hospitalAddress: null,
  });

  useEffect(() => {
    const getbookingAppointmentData = sessionStorage.getItem('bookingAppointmentData');
    if (getbookingAppointmentData && getbookingAppointmentData !== undefined) {
      const bookingAppointmentDataObject = JSON.parse(String(getbookingAppointmentData));
      setBookingAppointmentData(bookingAppointmentDataObject);
      sessionStorage.removeItem('bookingAppointmentData');
      removeBookingAppointmentData();
    } else {
      window.location.href = '/booking';
    }
  }, []);

  if (!bookingAppointmentData.name) return <LoadPage />;

  return (
    <div
      className="prixa-container is-top is-full"
      style={{
        backgroundImage:
          'linear-gradient(135deg, a(1, 70, 171, 0.95) 16.67%, rgb(1, 70, 171) 16.67%, rgb(1, 70, 171) 50%, rgba(1, 70, 171, 0.95) 50%, rgba(1, 70, 171, 0.95) 66.67%, rgb(1, 70, 171) 66.67%, rgb(1, 70, 171) 100%)',
        backgroundSize: '424.26px 424.26px',
      }}
    >
      <div className="text-center margin-baseT" data-cy="booking-summary-title">
        <Text scale="headerTitle" style={{ color: '#FFFFFF' }}>
          Janji Temu Berhasil Didaftarkan
        </Text>
      </div>
      <div id="booking-appointment" className="padding-baseY padding-largeX">
        <div className="prixa-booking-summary">
          <div
            className="text-center padding-small"
            style={{ borderBottom: '1px dashed var(--dark-20)', position: 'relative' }}
          >
            <img loading="lazy" alt="logo" src={imgHeader} style={{ height: '40px' }} />
          </div>
          <div className="padding-small" style={{ borderBottom: '1px solid var(--dark-20)' }}>
            <Text scale="content" className="color-disabled">
              Dokter
            </Text>
            <br />
            <Text scale="headerTitle">{bookingAppointmentData.doctorName}</Text>
            <br />
            <Text style={{ fontWeight: 'bold' }} scale="content">
              {bookingAppointmentData.doctorSpeciality}
            </Text>
            <br />
            <Text scale="content">{bookingAppointmentData.hospitalName}</Text>
          </div>
          <div className="padding-small" style={{ borderBottom: '1px solid var(--dark-20)' }}>
            <Text scale="content" className="color-disabled">
              Alamat Rumah Sakit
            </Text>
            <br />
            <Text scale="pageTitle">{bookingAppointmentData.hospitalAddress}</Text>
          </div>
          <div
            className="padding-small"
            style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid var(--dark-20)' }}
          >
            <div style={{ width: '50%', borderRight: '1px solid var(--dark-20)' }}>
              <Text scale="content" className="color-disabled">
                Tanggal
              </Text>
              <br />
              <Text scale="pageTitle">{bookingAppointmentData.appointmentDate}</Text>
            </div>
            <div className="margin-smallL" style={{ width: '50%' }}>
              <Text scale="content" className="color-disabled">
                Jam
              </Text>
              <br />
              <Text scale="pageTitle">{bookingAppointmentData.appointmentTime}</Text>
            </div>
          </div>
          <div className="padding-small">
            <Text scale="content" className="color-disabled">
              Nama Pasien
            </Text>
            <br />
            <Text scale="pageTitle">{bookingAppointmentData.name}</Text>
          </div>
          <div
            className="padding-small text-center"
            style={{ borderTop: '1px dashed var(--dark-20)', position: 'relative' }}
          >
            <Button href="/" size="large" variant="outline" className="dav-special">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center margin-baseB">
        <BookingSummaryShare />
      </div>
    </div>
  );
};

export default BookingSummaryPage;
