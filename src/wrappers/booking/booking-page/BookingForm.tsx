import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Text } from 'prixa-design-kit/dist';
import { useInput } from '../../../utils/useInput';
import { useBirthDateInput } from '../../../utils/useBirthDateInput';
import { BookingContext } from '../booking-page/BookingContext';
import moment from 'moment';
import { FormLabel } from 'prixa-design-kit/dist';
import Select from 'react-select';
import { getAPI } from '../../../api/api-method';
import { BOOKING_API } from '../../../api/api-url';
import { addToLocalStorageObject } from '../../../utils/addToLocalStorage';

const BookingForm = ({ setIsValid }: any) => {
  const { bookingData, setBookingData } = useContext(BookingContext);
  const [paymentMethodObject, setPaymentMethodObject] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const name = useInput({
    label: 'Nama',
    type: 'text',
    placeholder: 'Nama Pasien',
  });

  const dateOfBirth = useBirthDateInput({
    label: 'Tanggal Lahir',
  });

  const ktp = useInput({
    label: 'KTP',
    type: 'nik',
    placeholder: '1234567890xxxxxx',
  });

  const email = useInput({
    label: 'Email',
    type: 'email',
    placeholder: 'nama@mail.com',
  });

  const phoneNumber = useInput({
    label: 'No. Ponsel',
    type: 'phoneNumber',
    placeholder: '0812345xxxx',
  });

  /* eslint-disable */
  useEffect(() => {
    if (bookingData.name) {
      name.setValue(bookingData.name);
      dateOfBirth.setDate(moment(bookingData.birthDate).format("D"));
      dateOfBirth.setMonth(moment(bookingData.birthDate).format("MM"));
      dateOfBirth.setYear(moment(bookingData.birthDate).format("YYYY"));
      ktp.setValue(bookingData.nik);
      email.setValue(bookingData.email);
      phoneNumber.setValue(bookingData.phoneNumber);
      setPaymentMethod(bookingData.paymentMethod);
    }
  }, []);

  useEffect(() => {
    const userData = {
      name: name.value,
      birthDate: dateOfBirth.fullDate,
      nik: ktp.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      paymentMethod: paymentMethod,
    };
    setBookingData(userData);
  }, [name.value, dateOfBirth.fullDate, ktp.value, email.value, phoneNumber.value, paymentMethod]);

  useEffect(() => {
    addToLocalStorageObject('bookingAppointmentData', 'bookingData', bookingData);
  }, [bookingData]);

  useEffect(() => {
    const isNameValid = name.value && !name.error;
    const isDateOfBirthValid = !dateOfBirth.errorYear && !dateOfBirth.errorDate && dateOfBirth.fullDate.length === 10;
    const isKTPValid = ktp.value && !ktp.error;
    const isEmailValid = email.value && !email.error;
    const isPhoneNumberValid = phoneNumber.value && !phoneNumber.error;
    const isPaymentMethodValid = paymentMethod;
    isNameValid && isDateOfBirthValid && isKTPValid && isEmailValid && isPhoneNumberValid && isPaymentMethodValid
      ? setIsValid(true)
      : setIsValid(false);
  }, [name, dateOfBirth, ktp, email, phoneNumber, paymentMethod]);

  useEffect(() => {
    getAPI(`${BOOKING_API.PAYMENT_METHOD}`).then(async (res: any) => {
      let paymentMethodList:any = [];
      res.data.forEach((item: any) => {
        paymentMethodList.push({ value: item, label: item });
      });

      setPaymentMethodObject(paymentMethodList);
    });
  }, []);
  /* eslint-enable */

  return (
    <Fragment>
      <Text scale="headerTitle">Terakhir, lengkapi data pasien berikut:</Text>
      <div className="margin-baseT margin-xLargeB">
        <div className="margin-baseB">{name.input}</div>
        <div className="margin-baseB">{dateOfBirth.input}</div>
        <div className="margin-baseB">{ktp.input}</div>
        <div className="margin-baseB">{email.input}</div>
        <div className="margin-baseB">{phoneNumber.input}</div>
        <div className="margin-baseB" data-cy="payment-method-input">
          <FormLabel errors={false}>Metode Pembayaran</FormLabel>
          <Select
            maxMenuHeight={200}
            options={paymentMethodObject}
            placeholder="Pilih Metode Pembayaran"
            onChange={(data: any) => setPaymentMethod(data.value)}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: 'var(--primary)',
              },
            })}
            value={paymentMethodObject[paymentMethodObject.findIndex((object: any) => object.value === paymentMethod)]}
          />
        </div>
      </div>
    </Fragment>
  );
};

export { BookingForm };
