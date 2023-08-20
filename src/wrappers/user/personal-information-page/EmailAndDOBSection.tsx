import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Text, Button, Dropdown, DropdownItem, Bottomsheet, InputText } from 'prixa-design-kit/dist';
import { patchAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';

const monthOptions = [
  { value: 1, text: 'Januari' },
  { value: 2, text: 'Februari' },
  { value: 3, text: 'Maret' },
  { value: 4, text: 'April' },
  { value: 5, text: 'Mei' },
  { value: 6, text: 'Juni' },
  { value: 7, text: 'Juli' },
  { value: 8, text: 'Agustus' },
  { value: 9, text: 'September' },
  { value: 10, text: 'Oktober' },
  { value: 11, text: 'November' },
  { value: 12, text: 'Desember' },
];

const EmailAndDOBSection = ({
  email,
  dateOfBirth,
  editMode,
  selectedDOB,
  setSelectedDOB,
  name,
  address,
  phoneNumber,
  kelValue,
  setError,
}: any): JSX.Element => {
  return (
    <div className="prixa-pop-container margin-baseB">
      <EmailSection email={email} />
      <DateOfBirthSection
        dateOfBirth={dateOfBirth}
        editMode={editMode}
        selectedDOB={selectedDOB}
        setSelectedDOB={setSelectedDOB}
        name={name}
        address={address}
        phoneNumber={phoneNumber}
        kelValue={kelValue}
        setError={setError}
      />
    </div>
  );
};

const EmailSection = ({ email }: any): JSX.Element => {
  return (
    <div className="prixa-space-between padding-smallB" style={{ borderBottom: '1px solid rgb(112,112,112, .25)' }}>
      <Text scale="content" style={{ fontWeight: 'bold' }}>
        Email
      </Text>
      <Text scale="content">{email}</Text>
    </div>
  );
};

const DateOfBirthSection = ({
  dateOfBirth,
  editMode,
  selectedDOB,
  setSelectedDOB,
  name,
  address,
  phoneNumber,
  kelValue,
  setError,
}: any): JSX.Element => {
  const [showBottomSheet, setShowBottomSheet] = React.useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [dOfBirth, setDOfBirth] = useState<string>('');
  const [mOfBirth, setMOfBirth] = useState<string>('');
  const [yOfBirth, setYOfBirth] = useState<string>('');
  const [nameMOfBirth, setNameMOfBirth] = useState<string | undefined>('');
  const [isLoadButton, setIsLoadButton] = useState(false);

  useEffect(() => {
    if (!selectedDOB) {
      setDOfBirth('');
      setMOfBirth('');
      setYOfBirth('');
      setNameMOfBirth('');
    }
  }, [selectedDOB]);

  useEffect(() => {
    if (!dOfBirth || !mOfBirth || !yOfBirth) setDisabled(true);
    else if (parseInt(dOfBirth) < 1 || parseInt(dOfBirth) > 31) setDisabled(true);
    else if (yOfBirth.length < 4) setDisabled(true);
    else if (`${yOfBirth}${('0' + mOfBirth).slice(-2)}${('0' + dOfBirth).slice(-2)}` > moment().format('YYYYMMDD'))
      setDisabled(true);
    else if (mOfBirth) {
      let isValidDate;
      const february = ['2'];
      const date31List = ['1', '3', '5', '7', '8', '10', '12'];
      const date30List = ['4', '6', '9', '11'];
      const isDate30 = date30List.includes(String(mOfBirth));
      const isDate31 = date31List.includes(String(mOfBirth));
      const isFebruary = february.includes(String(mOfBirth));
      if (isDate30) {
        isValidDate = /^(0?[1-9]|[12][0-9]|3[00])$/.test(String(dOfBirth));
        isValidDate ? setDisabled(false) : setDisabled(true);
      } else if (isDate31) {
        isValidDate = /^(0?[1-9]|[12][0-9]|3[01])$/.test(String(dOfBirth));
        isValidDate ? setDisabled(false) : setDisabled(true);
      } else if (isFebruary) {
        const isLeapYear = Number(yOfBirth) % 100 === 0 ? Number(yOfBirth) % 400 === 0 : Number(yOfBirth) % 4 === 0;
        if (isLeapYear) {
          isValidDate = /^(0?[1-9]|[1][0-9]|[2][0-9])$/.test(String(dOfBirth));
          isValidDate ? setDisabled(false) : setDisabled(true);
        } else {
          isValidDate = /^(0?[1-9]|[1][0-9]|[2][0-8])$/.test(String(dOfBirth));
          isValidDate ? setDisabled(false) : setDisabled(true);
        }
      }
    }
  }, [dOfBirth, mOfBirth, yOfBirth]);

  const handleDayChange = (value: string): void => {
    const regexp = /^[0-9\b]+$/;
    if (value === '' || regexp.test(value)) {
      setDOfBirth(value);
    }
  };

  const handleYearChange = (value: string): void => {
    const regexp = /^[0-9\b]+$/;
    if (value === '' || regexp.test(value)) {
      setYOfBirth(value);
    }
  };

  const handleMonthSelect = useCallback((month: DropdownItem) => {
    setMOfBirth(month.value);
    setNameMOfBirth(month.text);
  }, []);

  const saveBirthDate = (): void => {
    setIsLoadButton(true);

    const DOB = `${yOfBirth}-${('0' + mOfBirth).slice(-2)}-${('0' + dOfBirth).slice(-2)}`;

    let payload;
    if (kelValue) {
      payload = {
        /* eslint-disable */
        patient_dob: DOB || '',
        patient_phone: phoneNumber.value || '',
        name: name.value || '',
        patient_address: address.value || '',
        patient_gender: kelValue === 'Laki-laki' ? 'm' : 'f',
        /* eslint-enable */
      };
    } else {
      payload = {
        /* eslint-disable */
        patient_dob: DOB || '',
        name: name.value || '',
        /* eslint-enable */
      };
    }

    patchAPI(USER_API.REGISTER, payload, undefined)
      .then(async () => {
        setIsLoadButton(false);
        setShowBottomSheet(false);
      })
      .catch(err => {
        setError(
          err.response &&
            err.response.data.details &&
            err.response.data.details[0] &&
            err.response.data.details[0].metadata
            ? err.response.data.details[0].metadata.errInd
            : 'Gangguan sistem, mohon coba kembali.',
        );
        setTimeout(() => {
          setIsLoadButton(false);
          setError('');
        }, 3000);
      });
  };

  const bottomSheetContent = (): JSX.Element => {
    return (
      <div>
        <div className="padding-largeX">
          <div className="personalinfoDOB-box" style={{ display: 'flex', marginBottom: 24 }}>
            <InputText
              setData={(value: string): void => handleDayChange(value)}
              value={dOfBirth}
              maxLength={2}
              type="text"
              placeholder="Tanggal"
              style={{ flex: 1, flexBasis: '27.5%', width: 81, fontSize: '14px' }}
              data-cy="data-diri-input-date-dob"
            />
            <Dropdown
              options={monthOptions}
              placeholder="Bulan"
              onSelect={handleMonthSelect}
              value={nameMOfBirth}
              styleContainer={{ width: 117, margin: '0 8px 0' }}
              styleInput={{ fontSize: 14, height: 6 }}
              styleItems={{ fontSize: 13, maxHeight: 135, top: 36 }}
              styleIcon={{ top: 10, width: '0.7em' }}
              data-cy="data-diri-input-month-dob"
            />
            <InputText
              setData={(value: string): void => handleYearChange(value)}
              value={yOfBirth}
              maxLength={4}
              type="text"
              placeholder="Tahun"
              style={{ flex: 1, flexBasis: '27.5%', width: 81, fontSize: '14px' }}
              data-cy="data-diri-input-year-dob"
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text
              className="margin-baseB"
              scale="caption"
              style={{ color: 'var(--dark)', fontSize: 14, marginBottom: 28 }}
            >
              Tanggal lahir yang Anda tambahkan tidak dapat diganti setelah disimpan. Pastikan tanggal lahir Anda
              sesuai.
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '40px' }}>
          <Button
            onClick={(): void => {
              if (!selectedDOB) setSelectedDOB(undefined);
              setShowBottomSheet(false);
            }}
            size="full"
            variant="disabled"
            className="prixa-cancel-button"
            style={{ background: 'var(--dark-20)', color: 'var(--dark)' }}
          >
            Batal
          </Button>
          <Button
            onClick={(): void => {
              setSelectedDOB({ year: parseInt(yOfBirth), month: parseInt(mOfBirth), day: parseInt(dOfBirth) });
              saveBirthDate();
            }}
            size="full"
            variant="primary"
            disabled={isDisabled}
            spinner={isLoadButton}
            data-cy="data-diri-button-save-dob"
          >
            Simpan
          </Button>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="prixa-space-between" style={{ paddingTop: '16px' }}>
        <Text scale="content" style={{ fontWeight: 'bold' }}>
          Tanggal Lahir
        </Text>
        {dateOfBirth ? (
          <Text scale="content" style={{ display: 'flex', alignItems: 'center' }} data-cy="data-diri-dob-text">
            {/* {dateOfBirth} */}
            {String(dateOfBirth).substring(8, 10) +
              ' ' +
              monthOptions[parseInt(String(dateOfBirth).substring(5, 7)) - 1].text +
              ' ' +
              String(dateOfBirth).substring(0, 4)}
          </Text>
        ) : selectedDOB ? (
          <Text scale="content" style={{ display: 'flex', alignItems: 'center' }} data-cy="data-diri-dob-text">
            {('0' + selectedDOB.day).slice(-2)} {monthOptions[selectedDOB.month - 1].text} {selectedDOB.year}
          </Text>
        ) : (
          <div onClick={editMode ? (): void => setShowBottomSheet(true) : (): object => ({})}>
            <Text
              scale="feedbackLink"
              style={{ cursor: editMode ? 'pointer' : 'default', color: editMode ? '' : 'var(--dark-50)' }}
              data-cy="data-diri-add-dob"
            >
              Tambah
            </Text>
          </div>
        )}
      </div>
      <Bottomsheet
        show={showBottomSheet}
        setShow={setShowBottomSheet}
        title="Tanggal Lahir"
        content={bottomSheetContent()}
      />
    </React.Fragment>
  );
};

export default EmailAndDOBSection;
