import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button, Toast } from 'prixa-design-kit/dist';
import { LoadPage } from '../../diagnostic/LoadPage';
import { HeaderContext } from '../../../components/header/HeaderContext';
import HealthInformation from './HealthInformation';
import { postAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';
import { getPreconditionsList } from './helpers';
import '../health-info-page/HealthInformation.scss';

interface IntHistory {
  patientId: string;
  patientAge: { age: number; type: string };
  patientGender: string;
  patientName: string;
  familyMemberAddedMsg: string;
}

export interface PrecondListInt {
  id?: string;
  type?: string;
  nameIndo?: string;
  preconditionsDescription?: string;
  preconditionsDescriptionCopy?: string;
  ageMonth?: number;
  ageYear?: number;
  weight?: number;
  height?: number;
  name?: string;
}

const AddFamilyHealthInfo = () => {
  const history = useHistory<IntHistory>();

  const [isLoading, setLoading] = useState(true);
  const [descriptivePrecondition, setDescriptivePrecondition] = useState<PrecondListInt[]>([]);
  // eslint-disable-next-line
  const [genderList, setGenderList] = useState<PrecondListInt[]>([]);
  // eslint-disable-next-line
  const [isNewPrecond, setIsNewPrecond] = useState(false);
  const [gender, setGender] = useState<PrecondListInt | undefined>({});
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [errHeight, setErrHeight] = useState(false);
  const [errWeight, setErrWeight] = useState(false);
  const [errGender, setErrGender] = useState(false);
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
  const [isErrorMsg, setError] = useState('');
  const [preconditionData, setPreconditionData] = useState<PrecondListInt[]>([]);
  const [isFirstHeight, setIsFirstHeight] = useState(true);
  const [isFirstWeight, setIsFirstWeight] = useState(true);

  const { setHeader, setMenu } = useContext(HeaderContext);

  /* eslint-disable */
  useEffect(() => {
    setHeader('Tambah Keluarga');
    setMenu(false);

    if (history.location.state.patientAge.type = 'year') {
      setAge(history.location.state.patientAge.age);
    }

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

    return () => {
      setHeader('');
    };
  }, []);
  /* eslint-enable */

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

  const hdlSubmit = async (
    setIsLoadButton: React.Dispatch<React.SetStateAction<boolean>>,
    gender: PrecondListInt | undefined,
    height: string,
    weight: string,
    preconditionData: PrecondListInt[],
    darahTinggi: boolean,
    diabetes: boolean,
    merokok: boolean,
    minumAlkohol: boolean,
    kanker: boolean,
    sakitJantung: boolean,
    gagalGinjal: boolean,
    hamil: boolean,
    menopause: boolean,
    setError: React.Dispatch<React.SetStateAction<string>>,
  ): Promise<void> => {
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
      await postAPI(USER_API.PRECONDITIONS(history.location.state.patientId), precondPayload);
      setIsLoadButton(false);
      history.push({
        pathname: '/family-member',
        state: {
          patientName: '',
          patientAge: { age: 0, type: '' },
          patientGender: '',
          patientId: '',
          familyMemberAddedMsg: `${history.location.state.patientName} telah ditambahkan sebagai anggota keluarga`,
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

  if (isLoading) return <LoadPage />;

  return (
    <>
      <div className="prixa-container is-top" style={{ paddingBottom: 0 }}>
        <div className="margin-largeB">
          <Text scale="question">Masukan informasi kesehatan berikut:</Text>
        </div>
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
          data-cy="submit-family-member"
          type="button"
          variant="primary"
          size="full"
          onClick={(): Promise<void> =>
            hdlSubmit(
              setIsLoadButton,
              gender,
              height,
              weight,
              preconditionData,
              darahTinggi,
              diabetes,
              merokok,
              minumAlkohol,
              kanker,
              sakitJantung,
              gagalGinjal,
              hamil,
              menopause,
              setError,
            )
          }
          disabled={errHeight || errWeight || errGender || isFirstHeight || isFirstWeight}
          spinner={isLoadButton}
        >
          Tambah Keluarga
        </Button>
      </div>
      <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
    </>
  );
};

export default AddFamilyHealthInfo;
