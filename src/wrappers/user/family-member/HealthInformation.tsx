import React, { useState, useEffect } from 'react';
import { Paragraph, InputText, Bottomsheet, Icon } from 'prixa-design-kit/dist';
import StatusList from '../../../components/statuslist/StatusList';
import StatusSideSheet from '../../diagnostic/StatusSideSheet';
import { PrecondListInt } from './AddFamilyHealthInfo';
import '../health-info-page/HealthInformation.scss';

const HealthInformation = ({
  patientAge,
  setErrHeight,
  setErrWeight,
  setErrGender,
  errHeight,
  errWeight,
  healthProps,
  setIsFirstHeight,
  setIsFirstWeight,
  isFirstHeight,
  isFirstWeight,
  descriptivePrecondition,
}: {
  patientAge: number;
  setErrHeight: React.Dispatch<React.SetStateAction<boolean>>;
  setErrWeight: React.Dispatch<React.SetStateAction<boolean>>;
  setErrGender: React.Dispatch<React.SetStateAction<boolean>>;
  errHeight: boolean;
  errWeight: boolean;
  healthProps: any;
  setIsFirstHeight: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFirstWeight: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstHeight: boolean;
  isFirstWeight: boolean;
  descriptivePrecondition: PrecondListInt[];
}): JSX.Element => {
  const [modal, setModal] = useState(false);

  // useEffect(() => {
  //   if (modal === true) {
  //     if (document && document.querySelector('.ReactSwipeableBottomSheet--open') !== null) {
  //       const el = document.querySelector('.ReactSwipeableBottomSheet--open') as HTMLElement;
  //       el.style.setProperty('padding', '0 40px');
  //     }
  //   }
  // }, [modal]);
  useEffect(() => {
    if (isFirstHeight) return;

    if (Number(healthProps.height) > 0 && Number(healthProps.height) < 301) {
      setErrHeight(false);
    } else {
      setErrHeight(true);
    }
  }, [healthProps.height, setErrHeight, isFirstHeight]);

  useEffect(() => {
    if (isFirstWeight) return;

    if (Number(healthProps.weight) > 0 && Number(healthProps.weight) < 501) {
      setErrWeight(false);
    } else {
      setErrWeight(true);
    }
  }, [healthProps.weight, setErrWeight, isFirstWeight]);

  useEffect(() => {
    if (JSON.stringify(healthProps.gender) === '{}') {
      setErrGender(true);
    } else {
      setErrGender(false);
    }
  }, [healthProps.gender, setErrGender]);

  const isFemale = healthProps.gender?.name === 'Female' ? healthProps.gender : {};
  const age = patientAge;
  const isCanDrinkAndSmoke = !(age < 17);
  const isCanMenopause = age >= 35 && isFemale && isFemale.name === 'Female';
  const isCanPregnant = !(age < 17 || age > 65) && isFemale && isFemale.name === 'Female';
  const showPregnancy = isFemale && isFemale.id && isCanPregnant && !healthProps.menopause;
  const showMenopause = isFemale && isFemale.id && isCanMenopause && !healthProps.hamil;
  const showDrinkAndSmoke = isCanDrinkAndSmoke;

  const statusListProps = {
    darahTinggi: healthProps.darahTinggi,
    diabetes: healthProps.diabetes,
    merokok: healthProps.merokok,
    minumAlkohol: healthProps.minumAlkohol,
    menopause: healthProps.menopause,
    hamil: healthProps.hamil,
    kanker: healthProps.kanker,
    sakitJantung: healthProps.sakitJantung,
    gagalGinjal: healthProps.gagalGinjal,
    setDarahTinggi: healthProps.setDarahTinggi,
    setDiabetes: healthProps.setDiabetes,
    setMerokok: healthProps.setMerokok,
    setMinumAlkohol: healthProps.setMinumAlkohol,
    setMenopause: healthProps.setMenopause,
    setHamil: healthProps.setHamil,
    setKanker: healthProps.setKanker,
    setSakitJantung: healthProps.setSakitJantung,
    setGagalGinjal: healthProps.setGagalGinjal,
    showPregnancy,
    showMenopause,
    showDrinkAndSmoke,
  };

  const handleHeight = (value: any): void => {
    healthProps.setHeight(value);
    setIsFirstHeight(false);
  };

  const handleWeight = (value: any): void => {
    healthProps.setWeight(value);
    setIsFirstWeight(false);
  };

  return (
    <>
      <form>
        <div className="prixa-title">
          <div className="row margin-smallB">
            <div className="row flex-inline" style={{ marginBottom: 24 }}>
              <div className="margin-baseR">
                <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
                  TINGGI (CM)
                </Paragraph>
                <InputText
                  data-cy="height"
                  type="number"
                  max={300}
                  setData={(value: any): void => handleHeight(value)}
                  value={healthProps.height}
                  placeholder="170"
                  small
                  errors={errHeight}
                />
              </div>
              <div className="margin-baseR">
                <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
                  BERAT (KG)
                </Paragraph>
                <InputText
                  data-cy="weight"
                  type="number"
                  max={500}
                  setData={(value: any): void => handleWeight(value)}
                  value={healthProps.weight}
                  placeholder="65"
                  small
                  errors={errWeight}
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
    </>
  );
};

export default HealthInformation;
