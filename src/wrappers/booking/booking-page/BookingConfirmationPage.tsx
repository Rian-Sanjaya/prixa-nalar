import React, { useEffect, useContext, useState } from 'react';
import { Button, Text, Toast } from 'prixa-design-kit/dist';
import { DoctorCard } from './DoctorCard';
import { DateAndTimeCard } from './DateAndTimeCard';
import { BookingDataCard } from './BookingDataCard';
import { postAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { BookingContext } from '../booking-page/BookingContext';
import moment from 'moment';
import 'moment/locale/id';

export const BookingConfirmationPage = () => {
  const { bookingData, date, time, doctorData } = useContext(BookingContext);
  const [isToastMsg, setToast] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');
  const [isLoad, setLoader] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const createAppointment = () => {
    setLoader(true);

    const appointmentData = {
      ...bookingData,
      appointmentDate: moment(date || '').format('YYYY-MM-DD'),
      appointmentTime: time.from_time,
      doctorId: doctorData.id,
      hospitalId: doctorData.hospitals.id,
      scheduleId: time.schedule_id,
    };

    postAPI(BOOKING_API.CREATE_APPOINTMENT, appointmentData, undefined)
      .then((res: any) => {
        const bookingResponse = res.data;

        const bookingDataSummary = {
          name: bookingResponse.name,
          appointmentDate: moment(bookingResponse.booking_date || '')
            .locale('id')
            .format('DD MMM YYYY'),
          appointmentTime: bookingResponse.booking_time.substring(0, bookingResponse.booking_time.length - 3),
          doctorName: bookingResponse.doctor.Name,
          doctorSpeciality: bookingResponse.doctor.Speciality.nameIndo,
          hospitalName: bookingResponse.hospital.name,
          hospitalAddress: bookingResponse.hospital.Address.street || '-',
        };
        sessionStorage.setItem('bookingAppointmentData', JSON.stringify(bookingDataSummary));
        setToastVariant('success');
        setToast('Janji temu dokter berhasil dibuat');
        setTimeout(() => {
          setToast('');
          window.location.href = '/booking-summary';
        }, 1500);
      })
      .catch(err => {
        setToastVariant('danger');
        setToast(err.response ? err.response.data.error : 'Silahkan Coba Lagi');
        setTimeout(() => {
          setToast('');
        }, 3000);
        setLoader(false);
      });
  };

  return (
    <div className="prixa-container is-top is-full">
      <div className="padding-largeX padding-smallT padding-largeB">
        <div className="margin-smallB">
          <div className="margin-tinyB">
            <Text scale="pagesubtitle">DOKTER</Text>
          </div>
          <DoctorCard />
        </div>
        <div className="margin-smallB">
          <div className="margin-tinyB">
            <Text scale="pagesubtitle">TANGGAL & JAM</Text>
          </div>
          <DateAndTimeCard />
        </div>
        <div>
          <div className="margin-tinyB">
            <Text scale="pagesubtitle">DATA PASIEN</Text>
          </div>
          <BookingDataCard />
        </div>
      </div>
      <Button onClick={() => createAppointment()} size="full" variant="primary" spinner={isLoad}>
        Buat Janji Temu
      </Button>
      <Toast timeout={3000} message={isToastMsg} variant={toastVariant} show={isToastMsg !== ''}></Toast>
    </div>
  );
};

export default BookingConfirmationPage;
