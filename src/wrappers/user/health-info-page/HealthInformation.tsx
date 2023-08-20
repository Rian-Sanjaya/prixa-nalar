import React, { useState, useEffect, useContext } from 'react';
import { Paragraph, InputText, Bottomsheet, Icon, Button, Toast } from 'prixa-design-kit/dist';
import StatusList from '../../../components/statuslist/StatusList';
import StatusSideSheet from '../../diagnostic/StatusSideSheet';
import { LoadPage } from '../../diagnostic/LoadPage';
import { handleSubmit, getPreconditionsList } from './helpers';
import { HeaderContext } from '../../../components/header/HeaderContext';
import './HealthInformation.scss';

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

const HealthInformation = () => {
  const [patientId, setPatientId] = React.useState('');
  const [isNewPrecond, setIsNewPrecond] = React.useState(true);
  const [modal, setModal] = React.useState(false);
  const [gender, setGender] = useState<PrecondListInt | undefined>({});
  const [ageMonth, setAgeMonth] = useState(0);
  const [ageYear, setAgeYear] = useState(0);
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
  const [isLoading, setLoading] = useState(true);
  const [isLoadButton, setIsLoadButton] = useState(false);
  const [isErrorMsg, setError] = useState('');
  const [descriptivePrecondition, setDescriptivePrecondition] = useState<PrecondListInt[]>([]);
  const [preconditionData, setPreconditionData] = useState<PrecondListInt[]>([]);
  const [isFirstHeight, setIsFirstHeight] = useState(true);
  const [isFirstWeight, setIsFirstWeight] = useState(true);

  const { setHeader, editMode, setEditMode, isLoadProfile, setLoadProfile } = useContext(HeaderContext);

  /*eslint-disable */
  useEffect(() => {
    setHeader('Informasi Kesehatan');

    return () => {
      setHeader('');
      handleEditMode(false);
    }
  }, []);

  useEffect(() => {
    const profileDataLocalStorage = localStorage.getItem('profileData');
    const profileData = JSON.parse(String(profileDataLocalStorage));
    const userId = profileData.id;
    const userEmail = profileData.email;
    const genderProfile = profileData.gender === 'm' ? 'Male' : profileData.gender === 'f' ? 'Female' : '';
    setLoading(true);
    getPreconditionsList(
      setAgeYear,
      setAgeMonth,
      setError,
      setLoading,
      setPreconditionData,
      descriptivePrecondition,
      setDescriptivePrecondition,
      setGender,
      setWeight,
      setHeight,
      setDarahTinggi,
      setDiabetes,
      setMerokok,
      setMinumAlkohol,
      setKanker,
      setSakitJantung,
      setGagalGinjal,
      setHamil,
      setMenopause,
      genderProfile,
      userId,
      userEmail,
      setPatientId,
      setIsNewPrecond,
    );
  }, []);
  /*eslint-enable */

  useEffect(() => {
    if (editMode) {
      if (Number(height) > 0 && Number(height) < 301) {
        setErrHeight(false);
      } else {
        setErrHeight(true);
      }
    }
  }, [height]); //eslint-disable-line

  useEffect(() => {
    if (editMode) {
      if (Number(weight) > 0 && Number(weight) < 501) {
        setErrWeight(false);
      } else {
        setErrWeight(true);
      }
    }
  }, [weight]); //eslint-disable-line

  useEffect(() => {
    if (JSON.stringify(gender) === '{}') {
      setErrGender(true);
    } else {
      setErrGender(false);
    }
  }, [gender]);

  useEffect(() => {
    if (editMode) {
      if ((ageMonth === 0 && ageYear === 0) || !gender) {
        setEditMode(false);
        setError(`Jenis Kelamin atau Umur belum diisi. Silahkan isi terlebih dahulu di Data Diri.`);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  }, [editMode, gender, ageMonth, ageYear, setEditMode]);

  const isFemale = gender?.name === 'Female' ? gender : {};
  const age = ageYear;
  const isCanDrinkAndSmoke = !(age < 17);
  const isCanMenopause = age >= 35 && gender?.name === 'Female';
  const isCanPregnant = !(age < 17 || age > 65) && gender?.name === 'Female';
  const showPregnancy = isFemale && isFemale.id && isCanPregnant && !menopause;
  const showMenopause = isFemale && isFemale.id && isCanMenopause && !hamil;
  const showDrinkAndSmoke = isCanDrinkAndSmoke;
  const disableStatusList = !editMode;

  const statusListProps = {
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
    showPregnancy,
    showMenopause,
    showDrinkAndSmoke,
    disableStatusList,
  };

  const handleEditMode = (mode: boolean): void => {
    if (setEditMode) setEditMode(mode);
  };

  const handleHeight = (value: any): void => {
    setHeight(value);
    setIsFirstHeight(false);
  };

  const handleWeight = (value: any): void => {
    setWeight(value);
    setIsFirstWeight(false);
  };

  if (isLoading || isLoadProfile) return <LoadPage />;

  return (
    <React.Fragment>
      <div className="prixa-container is-top" style={{ paddingBottom: 0 }}>
        <form>
          <div className="prixa-title">
            <div className="row margin-smallB">
              <div className="row flex-inline" style={{ marginBottom: 24 }}>
                <div className="margin-baseR">
                  <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
                    TINGGI (CM)
                  </Paragraph>
                  <InputText
                    type="number"
                    max={300}
                    setData={(value: any): void => handleHeight(value)}
                    value={height}
                    placeholder="170"
                    small
                    errors={editMode && errHeight}
                    disabled={!editMode}
                    data-cy="health-info-height-input"
                  />
                </div>
                <div className="margin-baseR">
                  <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
                    BERAT (KG)
                  </Paragraph>
                  <InputText
                    type="number"
                    max={500}
                    setData={(value: any): void => handleWeight(value)}
                    value={weight}
                    placeholder="65"
                    small
                    errors={editMode && errWeight}
                    disabled={!editMode}
                    data-cy="health-info-weight-input"
                  />
                </div>
              </div>
              <StatusList statusListProps={statusListProps} />
              <div className="margin-tinyT" style={{ display: 'flex', alignItems: 'left' }}>
                <div
                  onClick={(): void => {
                    setModal(true);
                  }}
                >
                  <div className="lihat-penjelasan-precond">
                    LIHAT PENJELASAN
                    <Icon type="arrow-circle-right" className="margin-tinyL" color="secondary" />
                  </div>
                </div>
              </div>
              <Bottomsheet
                setShow={setModal}
                show={modal}
                title="Status Kesehatan & Kebiasaan"
                content={
                  <StatusSideSheet
                    isFemale={isFemale}
                    isCanDrinkAndSmoke={isCanDrinkAndSmoke}
                    data={descriptivePrecondition}
                    showMenopause={showMenopause}
                    showPregnancy={showPregnancy}
                  />
                }
              />
            </div>
          </div>
        </form>
      </div>
      {editMode && (ageYear > 0 || ageMonth > 0) && gender && (
        <div className="prixa-footer-button">
          <Button
            type="button"
            variant="primary"
            size="full"
            onClick={(): Promise<void> =>
              handleSubmit(
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
                handleEditMode,
                setLoadProfile,
                patientId,
                isNewPrecond,
              )
            }
            disabled={
              errHeight ||
              errWeight ||
              errGender ||
              (isFirstHeight && !Number(height)) ||
              (isFirstWeight && !Number(weight))
            }
            spinner={isLoadButton}
            data-cy="health-info-save-button"
          >
            Simpan
          </Button>
        </div>
      )}
      <Toast
        timeout={3000}
        message={isErrorMsg}
        variant="danger"
        show={isErrorMsg !== ''}
        data-cy="health-info-toast"
      ></Toast>
    </React.Fragment>
  );
};

export default HealthInformation;
