import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Button, Toast, DropdownItem } from 'prixa-design-kit/dist';
import { useInput } from '../../../utils/useInput';
import { patchAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { LoadPage } from '../../diagnostic/LoadPage';
import EmailAndDOBSection from './EmailAndDOBSection';
import InputDataSection from './InputDataSection';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import './personalInformation.scss';
import { HeaderContext } from '../../../components/header/HeaderContext';

type dtBirth = {
  year: number;
  month: number;
  day: number;
};

export const PersonalInformationPage = (): JSX.Element => {
  const [isLoad, setLoad] = useState(false);
  const [isErrorMsg, setError] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [selectedDOB, setSelectedDOB] = useState<dtBirth>();
  const [errNama, setErrNama] = useState(false);
  const [errAlamat, setErrAlamat] = useState(false);
  const [errTelepon, setErrTelepon] = useState(false);
  const { setHeader, editMode, setEditMode, isLoadProfile, setLoadProfile } = useContext(HeaderContext);
  const [firstEdit, setFirstEdit] = useState(true);

  const [kelValue, setKelValue] = useState<string>('');
  const [kelText, setKelText] = useState<string | undefined>('');
  const [errJenisKelamin, setErrJenisKelamin] = useState(false);
  const [validatJKel, setValidateJKel] = useState(false);
  const [firstEditJKel, setFirstEditJKel] = useState(true);

  const handleEditMode = (mode: boolean): void => {
    if (setEditMode) setEditMode(mode);
  };

  /* eslint-disable */
  useEffect(() => {
    setHeader('Data Diri');
    return () => {
      setHeader('')
      handleEditMode(false);
    }
  }, []);

  useEffect(() => {
    if (editMode === false) setHeader('Data Diri');
    else setHeader('Edit Data Diri');
  }, [editMode]);
  /* eslint-enable */

  const name = useInput({
    label: 'Nama',
    type: 'namaDataDiri',
    placeholder: 'Nama Lengkap',
    editMode,
    firstEdit,
    setFirstEdit,
  });

  const address = useInput({
    label: 'Alamat',
    type: 'alamatDataDiri',
    rows: 3,
    placeholder: 'Alamat Lengkap',
    editMode,
    firstEdit,
    setFirstEdit,
  });

  const phoneNumber = useInput({
    label: 'Nomor Telepon',
    type: 'teleponDataDiri',
    placeholder: 'Nomor Telepon',
    editMode,
    firstEdit,
    setFirstEdit,
  });

  const dayOfBirth = ('0' + selectedDOB?.day).slice(-2);
  const monthOfBirth = ('0' + selectedDOB?.month).slice(-2);
  const yearOfBirth = selectedDOB?.year;
  const DOB = selectedDOB
    ? yearOfBirth + '-' + monthOfBirth + '-' + dayOfBirth
    : dateOfBirth
    ? String(dateOfBirth).substring(0, 4) +
      '-' +
      String(dateOfBirth).substring(5, 7) +
      '-' +
      String(dateOfBirth).substring(8, 10)
    : null;

  const savePersonalInformation = (): void => {
    setLoad(true);

    const payload = {
      /* eslint-disable */
      patient_dob: DOB || '',
      patient_phone: phoneNumber.value || '',
      name: name.value || '',
      patient_address: address.value || '',
      patient_gender: kelValue === 'Laki-laki' ? 'm' : kelValue === 'Perempuan' ? 'f' : '',
      /* eslint-enable */
    };

    patchAPI(USER_API.REGISTER, payload, undefined)
      .then(async (res: any) => {
        setLoad(false);
        handleEditMode(false);
        setLoadProfile(true);
        window.location.reload();
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
          setLoad(false);
          setError('');
        }, 3000);
      });
  };

  /* eslint-disable */
  useEffect(() => {
    const profileDataLocalStorage = localStorage.getItem('profileData');
    const profileData = JSON.parse(String(profileDataLocalStorage));
    const gender = profileData.gender === 'm' ? 'Laki-laki' : profileData.gender === 'f' ? 'Perempuan' : '';
    name.setValue && name.setValue(profileData.name);
    setEmail(profileData.email);
    setKelValue(gender);
    setKelText(gender);
    address.setValue && address.setValue(profileData.address);
    phoneNumber.setValue && phoneNumber.setValue(profileData.phone);
    setDateOfBirth(profileData.birthdate);
  }, []);
  /* eslint-enable */

  useEffect(() => {
    const isNameValid = name.value && !name.error;
    isNameValid ? setErrNama(false) : setErrNama(true);
  }, [name]);

  useEffect(() => {
    if (editMode && firstEditJKel === false) {
      const isJenisKelaminValid = kelValue;
      if (isJenisKelaminValid) {
        setErrJenisKelamin(false);
        setValidateJKel(true);
      } else {
        setErrJenisKelamin(true);
        setValidateJKel(false);
      }
    } else {
      setErrJenisKelamin(false);
      setValidateJKel(false);
    }
  }, [kelValue, editMode, firstEditJKel]);

  useEffect(() => {
    const isAddressValid = address.value && !address.error;
    isAddressValid ? setErrAlamat(false) : setErrAlamat(true);
  }, [address]);

  useEffect(() => {
    const isTeleponValid = phoneNumber.value && !phoneNumber.error;
    isTeleponValid ? setErrTelepon(false) : setErrTelepon(true);
  }, [phoneNumber]);

  const handleJKelSelect = useCallback((jenisKelamin: DropdownItem) => {
    setKelValue(jenisKelamin.value);
    setKelText(jenisKelamin.text);
    setFirstEditJKel(false);
  }, []);

  if (isLoadProfile) return <LoadPage />;

  return (
    <React.Fragment>
      <div className="prixa-container is-top">
        {/* <ProfilePictureSection name={name} /> */}
        <EmailAndDOBSection
          email={email}
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
        <InputDataSection
          name={name}
          editMode={editMode}
          errJenisKelamin={errJenisKelamin}
          firstEditJKel={firstEditJKel}
          handleJKelSelect={handleJKelSelect}
          kelText={kelText}
          validatJKel={validatJKel}
          address={address}
          phoneNumber={phoneNumber}
        />
      </div>
      {editMode && (
        <SaveButton
          disabled={errAlamat || errNama || kelValue === '' || errTelepon || !DOB}
          onSave={savePersonalInformation}
          isLoad={isLoad}
        />
      )}
      <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
    </React.Fragment>
  );
};

const SaveButton = ({ disabled, onSave, isLoad }: any): JSX.Element => {
  return (
    <div className="prixa-footer-button">
      <Button
        onClick={(): void => onSave()}
        size="full"
        variant="primary"
        disabled={disabled}
        spinner={isLoad}
        data-cy="data-diri-button-save"
      >
        Simpan
      </Button>
    </div>
  );
};

export default PersonalInformationPage;
