import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button, Toast, Bottomsheet } from 'prixa-design-kit/dist';
import { USER_API } from '../../../api/api-url';
import { getAPI, postAPI, patchAPI, deleteAPI } from '../../../api/api-method';
import { useInput } from '../../../utils/useInput';
import { HeaderContext } from '../../../components/header/HeaderContext';
import HealthInformation from './HealthInformation';
import { PrecondListInt } from './AddFamilyHealthInfo';
import ModifyFamilyData from './ModifyFamilyData';
import { useInputDOB } from '../../../utils/useInputDOB';
import { FamilyMemberContext } from './FamilyMemberContext';
import { getPreconditionsList } from './helpers';
import './familyMember.scss';
import { LoadPage } from '../../diagnostic/LoadPage';

interface IntHistory {
  patientId: string;
  patientAge: { age: number; type: string };
  patientGender: string;
  patientName: string;
  patientDOB: string;
  familyMemberAddedMsg: string;
}

const ModifyFamilyMember = (): JSX.Element => {
  const history = useHistory<IntHistory>();

  const [firstEdit, setFirstEdit] = useState(true); /* for using existing useInput type: namaDataDiri */
  const [errNama, setErrNama] = useState(false);
  const [isErrMsg, setError] = useState('');
  const [age, setAge] = useState(0);
  const [errFullDate, setErrFullDate] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [descriptivePrecondition, setDescriptivePrecondition] = useState<PrecondListInt[]>([]);
  const [isNewPrecond, setIsNewPrecond] = useState(false);
  const [genderList, setGenderList] = useState<PrecondListInt[]>([]);
  const [genderDw, setGenderDw] = useState('');
  const [gender, setGender] = useState<PrecondListInt | undefined>({});
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [errHeight, setErrHeight] = useState(false);
  const [errWeight, setErrWeight] = useState(false);
  const [errGender, setErrGender] = useState(true);
  const [darahTinggi, setDarahTinggi] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [merokok, setMerokok] = useState(false);
  const [minumAlkohol, setMinumAlkohol] = useState(false);
  const [menopause, setMenopause] = useState(false);
  const [hamil, setHamil] = useState(false);
  const [kanker, setKanker] = useState(false);
  const [sakitJantung, setSakitJantung] = useState(false);
  const [gagalGinjal, setGagalGinjal] = useState(false);
  const [isLoadButton, setIsLoadButton] = useState(false);
  const [preconditionData, setPreconditionData] = useState<PrecondListInt[]>([]);
  const [isFirstHeight, setIsFirstHeight] = useState(true);
  const [isFirstWeight, setIsFirstWeight] = useState(true);
  const [toastVariant, setToastVariant] = useState('danger');

  const { setHeader, setMenu, deleteMode, setDeleteMode, setLoadProfile } = useContext(HeaderContext);
  const editMode = true; /* for using existing useInput type: namaDataDiri */

  const healthProps = {
    darahTinggi,
    diabetes,
    merokok,
    minumAlkohol,
    menopause,
    hamil,
    kanker,
    sakitJantung,
    gagalGinjal,
    setDarahTinggi,
    setDiabetes,
    setMerokok,
    setMinumAlkohol,
    setMenopause,
    setHamil,
    setKanker,
    setSakitJantung,
    setGagalGinjal,
    setHeight,
    setWeight,
    height,
    weight,
    gender,
    setGender,
  };

  const name = useInput({
    label: 'Nama',
    type: 'namaDataDiri',
    placeholder: 'Nama Lengkap',
    editMode,
    firstEdit,
    setFirstEdit,
  });

  const dateOfBirth = useInputDOB({
    label: 'Tanggal Lahir',
  });

  /* eslint-disable */
  useEffect(() => {
    setLoading(true);
    if ((history.location.state.patientAge.type = 'year')) {
      setAge(history.location.state.patientAge.age);
    }
    getAPI(USER_API.FAMILY_MEMBER_DETAIL(history.location.state.patientId))
      .then((res: any) => {
        if (res.data) {
          name.setValue(`${res.data.patient_f_name} ${res.data.patient_l_name}`);
          dateOfBirth.setDOfBirth(res.data.patient_dob.substr(8, 2));
          dateOfBirth.setMOfBirth(res.data.patient_dob.substr(5, 2));
          dateOfBirth.setYOfBirth(res.data.patient_dob.substr(0, 4));
          dateOfBirth.setNameMOfBirth(dateOfBirth.monthOptions[parseInt(res.data.patient_dob.substr(5, 2)) - 1].text)
          setGenderDw(res.data.patient_gender);

          getPreconditionsList(
            setError,
            setLoading,
            setPreconditionData,
            descriptivePrecondition,
            setDescriptivePrecondition,
            healthProps.setGender,
            healthProps.setWeight,
            healthProps.setHeight,
            healthProps.setDarahTinggi,
            healthProps.setDiabetes,
            healthProps.setMerokok,
            healthProps.setMinumAlkohol,
            healthProps.setKanker,
            healthProps.setSakitJantung,
            healthProps.setGagalGinjal,
            healthProps.setHamil,
            healthProps.setMenopause,
            history.location.state.patientId,
            history.location.state.patientGender,
            setGenderList,
            setIsNewPrecond,
          )
        }
        setLoading(false);
        setHeader('Ubah Data Keluarga');
        setMenu(false);
      })
      .catch(err => {
        if (err.response.data.detail === 'Record not exists') {
          history.replace({ pathname: '/profile' });
          setLoading(false);
        } else {
          setError(
            err.response && err.response.data ? err.response.data.detail : 'Gangguan sistem, mohon coba kembali.',
          );
          setLoading(false);
          setHeader('Ubah Data Keluarga');
          setMenu(false);
        }
      });

    return () => {
      setHeader('');
    };
  }, []);
  /* eslint-enable */

  useEffect(() => {
    const isNameValid = name.value && !name.error;
    isNameValid ? setErrNama(false) : setErrNama(true);
  }, [name]);

  useEffect(() => {
    const isDateOfBirthValid = dateOfBirth.isValid && dateOfBirth.fullDate.length === 10;
    isDateOfBirthValid ? setErrFullDate(false) : setErrFullDate(true);
  }, [dateOfBirth]);

  const isDisabled = errNama || errFullDate || errGender || errHeight || errWeight;

  const handleSubmit = async (): Promise<void> => {
    setIsLoadButton(true);

    const precondList = [];

    if (darahTinggi) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Hypertensive';
        }),
      );
    }

    if (diabetes) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Diabetic';
        }),
      );
    }

    if (merokok) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Smoker';
        }),
      );
    }

    if (minumAlkohol) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Alcohol drinker';
        }),
      );
    }

    if (kanker) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Cancer';
        }),
      );
    }

    if (sakitJantung) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Cardiovascular Disease';
        }),
      );
    }

    if (gagalGinjal) {
      precondList.push(
        preconditionData.find(el => {
          return el.name === 'Chronic Kidney Failure';
        }),
      );
    }

    if (gender?.name === 'Female') {
      if (hamil) {
        precondList.push(
          preconditionData.find(el => {
            return el.name === 'Pregnant';
          }),
        );
      }

      if (menopause) {
        precondList.push(
          preconditionData.find(el => {
            return el.name === 'Menopause';
          }),
        );
      }
    }

    const precondPayload = {
      precondList: precondList,
      height: Number(height),
      weight: Number(weight),
    };

    try {
      if (isNewPrecond) {
        await postAPI(USER_API.PRECONDITIONS(history.location.state.patientId), precondPayload);
      } else {
        await patchAPI(USER_API.PRECONDITIONS(history.location.state.patientId), precondPayload);
      }
      setIsLoadButton(false);
      setLoadProfile(true);
      setToastVariant('success');
      history.push({
        pathname: '/family-member',
        state: {
          patientDOB: '',
          patientName: '',
          patientAge: { age: 0, type: '' },
          patientGender: '',
          patientId: '',
          familyMemberAddedMsg: `Data anggota keluarga ${name.value} berhasil diubah.`,
        },
      });
    } catch (err) {
      setError(
        err.response &&
          err.response.data.details &&
          err.response.data.details[0] &&
          err.response.data.details[0].metadata
          ? err.response.data.details[0].metadata.errInd
          : 'Gangguan sistem, mohon coba kembali.',
      );
      setIsLoadButton(false);
    }
  };

  const handleSave = () => {
    const data = {
      name: name.value,
      birthdate: dateOfBirth.fullDate,
      gender: gender?.name === 'Male' ? 'm' : gender?.name === 'Female' ? 'f' : '',
    };

    patchAPI(USER_API.MODIFY_FAMILY_MEMBER(history.location.state.patientId), data)
      .then(() => {
        handleSubmit();
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
      });
  };

  const handleDelete = () => {
    setDeleteMode(false);
    deleteAPI(USER_API.DELETE_FAMILY_MEMBER(history.location.state.patientId))
      .then((res: any) => {
        if (res.status === 'success') {
          history.push({
            pathname: '/family-member',
            state: {
              patientDOB: '',
              patientName: '',
              patientAge: { age: 0, type: '' },
              patientGender: '',
              patientId: '',
              familyMemberAddedMsg: `${history.location.state.patientName} telah dihapus sebagai anggota keluarga`,
            },
          });
        }
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
      });
  };

  const bottomSheetContent = (): JSX.Element => {
    return (
      <div>
        <div className="padding-largeX">
          <div style={{ width: '227px' }}>
            <Text className="margin-baseB" scale="heroTitle" style={{ color: 'var(--alert)' }}>
              Hapus daftar anggota keluarga.
            </Text>
          </div>
          <div style={{ marginTop: '24px' }}>
            <Text
              className="margin-baseB"
              scale="caption"
              style={{ color: 'var(--dark)', fontSize: 14, fontStyle: 'normal' }}
            >
              {name.value} akan dihapus dari daftar anggota keluarga. Apakah Anda ingin melanjutkan?
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '40px' }}>
          <Button
            onClick={(): void => {
              setDeleteMode(false);
            }}
            size="full"
            variant="disabled"
            className="prixa-cancel-button"
            style={{ background: 'var(--dark-20)', color: 'var(--dark)' }}
          >
            Batal
          </Button>
          <Button onClick={handleDelete} size="full" variant="primary" style={{ backgroundColor: 'var(--alert)' }}>
            Hapus
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadPage />;

  return (
    <>
      <div className="prixa-container is-top">
        <FamilyMemberContext.Provider value={{ setAge, dateOfBirth, genderDw, setGender, genderList }}>
          <ModifyFamilyData name={name} />
        </FamilyMemberContext.Provider>
        <hr style={{ margin: '24px 0', borderTop: '1px solid rgba(170, 170, 170, 0.16)' }} />
        <HealthInformation
          patientAge={age}
          setErrHeight={setErrHeight}
          setErrWeight={setErrWeight}
          setErrGender={setErrGender}
          errHeight={errHeight}
          errWeight={errWeight}
          healthProps={healthProps}
          setIsFirstHeight={setIsFirstHeight}
          setIsFirstWeight={setIsFirstWeight}
          isFirstHeight={isFirstHeight}
          isFirstWeight={isFirstWeight}
          descriptivePrecondition={descriptivePrecondition}
        />
      </div>
      <div className="prixa-footer-button">
        <Button
          data-cy="save-modified-family-member"
          type="button"
          variant="primary"
          size="full"
          onClick={handleSave}
          disabled={isDisabled}
          spinner={isLoadButton}
        >
          Simpan
        </Button>
      </div>
      <Toast timeout={3000} message={isErrMsg} variant={toastVariant} show={isErrMsg !== ''}></Toast>
      <Bottomsheet show={deleteMode} setShow={setDeleteMode} content={bottomSheetContent()} />
    </>
  );
};

export default ModifyFamilyMember;
