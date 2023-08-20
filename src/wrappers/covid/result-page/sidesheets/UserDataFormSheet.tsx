import React, { useRef } from 'react';
import { Paragraph, Button, FormLabel, InputText, Dropdown, Toast } from 'prixa-design-kit/dist';
import data from '../../../../utils/data/location.json';
import { getPartnerID, getAppID } from '../../../../utils/constant';
import { DIAGNOSTIC_API } from '../../../../api/api-url';
import { sessionId } from '../../../../api/api-utils';
import { postAPI } from '../../../../api/api-method';
import { UseTracking } from '../../../../utils/useTracking';
const imgConsent = `${process.env.REACT_APP_ASSET_URL}/covid/On%20Boarding%20-%201.png`;
const imgSuccess = `${process.env.REACT_APP_ASSET_URL}/covid/On%20Boarding%20-%206.png`;

const pages = {
  CONSENT: 'Send UserDataForm Page',
  FORM: 'Send UserDataForm Success Page',
  SUCCESS: 'Send UserDataForm Close Page',
};

const UserDataFormSideSheet = (props: any) => {
  const [userDataFormPage, setUserDataFormPage] = React.useState(pages.CONSENT);

  if (userDataFormPage === pages.CONSENT) {
    return <UserDataConsent sessionId={props.sessionId} setPage={setUserDataFormPage}></UserDataConsent>;
  } else if (userDataFormPage === pages.FORM) {
    return (
      <UserDataForm setPage={setUserDataFormPage} setModal={props.setModal} sessionId={props.sessionId}></UserDataForm>
    );
  } else if (userDataFormPage === pages.SUCCESS) {
    return <UserDataSuccess setModal={props.setModal} setPage={setUserDataFormPage} />;
  }
  return <div></div>;
};

const UserDataSuccess = (props: any) => {
  const closeModal = () => {
    props.setModal(false);
    props.setPage(pages.CONSENT);
  };

  return (
    <React.Fragment>
      <div className="prixa-container">
        <div className="prixa-body">
          <div className="prixa-question-image">
            <img loading="lazy" alt="Covid success page" src={imgSuccess} width="240px" height="auto" />
          </div>
          <Paragraph scale="heroTitle" style={{ width: '275px', margin: 'auto auto 24px' }}>
            Data diri anda telah dikirim.
          </Paragraph>
          <Paragraph scale="content" style={{ width: '275px', margin: 'auto auto 24px' }}>
            Pemerintah setempat akan menghubungi Anda jika diperlukan penanganan lebih lanjut.
          </Paragraph>
          <Button size="base" variant="primary" style={{ float: 'right' }} onClick={() => closeModal()}>
            Tutup
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

const UserDataConsent = (props: any) => {
  return (
    <React.Fragment>
      <div className="prixa-container">
        <div className="prixa-body">
          <div className="prixa-question-image">
            <img loading="lazy" alt="Prixa Form Consent" src={imgConsent} width="240px" height="auto" />
          </div>
          <Paragraph className="text-center" data-cy="text-form-explanation">
            Data yang Anda masukkan akan disampaikan ke Pemerintah Provinsi Jawa Barat untuk mengetahui potensi sebaran
            COVID-19 di wilayah Jawa Barat. Kontribusi Anda sangat berarti untuk mengurangi laju penyebaran COVID-19 di
            Jawa Barat.
          </Paragraph>
        </div>
      </div>
      <div className="prixa-footer-button">
        <Button
          onClick={() => props.setPage(pages.FORM)}
          size="full"
          variant="primary"
          data-cy="button-agree_and_continue"
        >
          Setuju dan Lanjutkan
        </Button>
      </div>
    </React.Fragment>
  );
};

const useInput = ({ type = 'text', err, placeholder }: any) => {
  const [value, setValue] = React.useState('');
  const input = (
    <InputText
      errors={err}
      placeholder={placeholder}
      setData={setValue}
      small={false}
      type={type}
      style={{ height: '48px' }}
    />
  );
  return [value, input];
};

const UserDataForm = (props: any) => {
  const [errUserName, setErrUserName] = React.useState(false);
  const [errEmail, setErrEmail] = React.useState(false);
  const [errPhone, setErrPhone] = React.useState(false);
  const [optionsProvince, setOptionsProvince] = React.useState<Array<any>>([]);
  const [optionsCities, setOptionsCities] = React.useState<Array<any>>([]);
  const [provinceVal, setProvinceVal] = React.useState('');
  const [citiesVal, setCitiesVal] = React.useState('');
  const [error, setError] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(true);
  const [sent, setSent] = React.useState(false);

  /*eslint-disable */
  const [userName, userNameInput] = useInput({
    type: 'text',
    err: errUserName,
    placeholder: 'Nama Anda',
  });

  const [email, emailInput] = useInput({
    type: 'email',
    err: errEmail,
    placeholder: 'nama@email.com',
  });

  const [phone, phoneInput] = useInput({
    type: 'number',
    err: errPhone,
    placeholder: '0812345xxx',
  });
  /*eslint-enable */

  React.useEffect(() => {
    setOptionsProvince(data.map(prov => ({ value: prov.nama, text: prov.nama })));
  }, []);

  const isFirstUserName = useRef(true);
  React.useEffect(() => {
    if (isFirstUserName.current) {
      isFirstUserName.current = false;
      return;
    }

    userName ? setErrUserName(false) : setErrUserName(true);
  }, [userName]);

  const isFirstEmail = useRef(true);
  React.useEffect(() => {
    if (isFirstEmail.current) {
      isFirstEmail.current = false;
      return;
    }

    email && typeof email === 'string' && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
      ? setErrEmail(false)
      : setErrEmail(true);
  }, [email]);

  const isFirstPhone = useRef(true);
  React.useEffect(() => {
    if (isFirstPhone.current) {
      isFirstPhone.current = false;
      return;
    }

    phone && typeof phone === 'string' && phone.length > 9 ? setErrPhone(false) : setErrPhone(true);
  }, [phone]);

  React.useEffect(() => {
    const isValidUserName = userName && !errUserName;
    const isValidEmail = email && !errEmail;
    const isValidPhone = phone && !errPhone;
    const isValidCity = citiesVal;

    const isAllValid = isValidUserName && isValidEmail && isValidPhone && isValidCity;
    isAllValid ? setDisabled(false) : setDisabled(true);
  }, [userName, errUserName, email, errEmail, phone, errPhone, citiesVal]);

  const selectProvince = (props: any) => {
    const selectedProvince = data.find(prov => prov.nama === props.value);
    setOptionsCities(selectedProvince!.kabkot.map(city => ({ value: city.nama, text: city.nama })));
    setCitiesVal('');
    setProvinceVal(props.value);
  };

  const onSubmit = () => {
    setSent(true);
    setDisabled(true);

    const covidForm = {
      partnerID: getPartnerID,
      appID: getAppID,
      diagnosticSessionID: props.sessionId,
      name: userName,
      phone: phone,
      email: email,
      city: citiesVal,
      province: provinceVal,
      timestamp: new Date().toISOString(),
    };
    UseTracking({ event: '[SUBMIT]-[FORM][SELF]', properties: { sessionId } });

    postAPI(DIAGNOSTIC_API.FORM_COVID, { covidForm })
      .then(() => {
        props.setPage(pages.SUCCESS);
        setSent(false);
        setDisabled(false);
      })
      .catch(err => {
        setError(true);
        setSent(false);
        setDisabled(false);
      });
  };

  return (
    <React.Fragment>
      <div className="prixa-container is-top padding-baseY">
        <div className="prixa-title">
          <Paragraph scale="heroTitle" fontSize="24px">
            Mohon lengkapi data pribadi Anda:
          </Paragraph>
        </div>
        <div className="margin-smallB">
          <FormLabel errors={false}>Nama Lengkap</FormLabel>
          {userNameInput}
        </div>
        <div className="margin-smallB">
          <FormLabel errors={false}>Email</FormLabel>
          {emailInput}
        </div>
        <div className="margin-smallB">
          <FormLabel errors={false}>Nomer Ponsel</FormLabel>
          {phoneInput}
          <Paragraph style={{ margin: '8px 0px' }} fontStyle="italic" fontSize="10px" lineHeight="1.17">
            Nomor ponsel Anda dibutuhkan agar pemerintah setempat dapat menghubungi Anda jika dibutuhkan penanganan
            lanjutan
          </Paragraph>
        </div>
        <div className="margin-largeB">
          <FormLabel errors={false}>Provinsi</FormLabel>
          <Dropdown
            options={optionsProvince}
            placeholder="Pilih Provinsi"
            onSelect={selectProvince}
            error={!provinceVal}
            data-cy="dropdown-select-province"
          />
        </div>
        <div className="margin-largeB">
          <FormLabel errors={false}>Kota/Kabupaten</FormLabel>
          <Dropdown
            options={optionsCities}
            placeholder="Pilih Kota"
            disabled={optionsCities.length === 0 ? true : false}
            onSelect={(val: any) => setCitiesVal(val.value)}
            error={!citiesVal}
            value={citiesVal}
            data-cy="dropdown-select-city"
          />
        </div>
      </div>
      <div className="prixa-footer-button">
        <Button
          onClick={onSubmit}
          type="submit"
          size="full"
          variant="primary"
          data-cy="button-submit-self-form"
          disabled={isDisabled}
          spinner={sent}
        >
          Kirim
        </Button>
      </div>
      <Toast show={error} message={'Data diri anda belum berhasi dikirim, mohon ulang kembali'} variant="error"></Toast>
    </React.Fragment>
  );
};

export default UserDataFormSideSheet;
