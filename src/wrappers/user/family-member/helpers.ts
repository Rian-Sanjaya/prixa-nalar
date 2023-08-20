import moment from 'moment';
import { PrecondListInt } from './AddFamilyHealthInfo';
import { getAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';

export const calcAge = (dateFrom: Date, dateTo: Date = new Date()): { age: number; type: string } => {
  const endDate = moment(dateTo);
  const startDate = moment(dateFrom);

  const age = endDate.diff(startDate, 'years');

  if (age > 0) return { age, type: 'year' };
  else return { age: endDate.diff(startDate, 'months'), type: 'month' };
};

export const getPreconditionsList = (
  setError: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPreconditionData: React.Dispatch<React.SetStateAction<PrecondListInt[]>>,
  descriptivePrecondition: PrecondListInt[],
  setDescriptivePrecondition: React.Dispatch<React.SetStateAction<PrecondListInt[]>>,
  setGender: React.Dispatch<React.SetStateAction<PrecondListInt | undefined>>,
  setWeight: React.Dispatch<React.SetStateAction<string>>,
  setHeight: React.Dispatch<React.SetStateAction<string>>,
  setDarahTinggi: React.Dispatch<React.SetStateAction<boolean>>,
  setDiabetes: React.Dispatch<React.SetStateAction<boolean>>,
  setMerokok: React.Dispatch<React.SetStateAction<boolean>>,
  setMinumAlkohol: React.Dispatch<React.SetStateAction<boolean>>,
  setKanker: React.Dispatch<React.SetStateAction<boolean>>,
  setSakitJantung: React.Dispatch<React.SetStateAction<boolean>>,
  setGagalGinjal: React.Dispatch<React.SetStateAction<boolean>>,
  setHamil: React.Dispatch<React.SetStateAction<boolean>>,
  setMenopause: React.Dispatch<React.SetStateAction<boolean>>,
  patientId: string,
  patientGender: string,
  setGenderList: React.Dispatch<React.SetStateAction<PrecondListInt[]>> | undefined,
  setIsNewPrecond: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  /*eslint-disable*/
  getAPI(USER_API.PRECONDITIONS(patientId))
    .then((res: any) => {
      setError('');
      
      if (res && res['allPreconditions']) {
        setPreconditionData(res['allPreconditions']);

        const gList: PrecondListInt[] = [];
        const descPrecondition: PrecondListInt[] = [];

        res['allPreconditions'].map((precond: PrecondListInt) => {
          if (precond.name === 'Female' || precond.name === 'Male') {
            gList.push(precond);
          } else if (precond.preconditionsDescription) {
            descriptivePrecondition.push(precond);
          }
        });

        if (gList.length > 0 && setGenderList) setGenderList(gList);

        if (descPrecondition.length > 0) setDescriptivePrecondition(descPrecondition);

        if (res.precondList && res.precondList.length > 0) {
          setIsNewPrecond(false);
          setUserPrecond(
            res.precondList, 
            setGender, 
            setDarahTinggi, 
            setDiabetes, 
            setMerokok, 
            setMinumAlkohol, 
            setKanker, 
            setSakitJantung, 
            setGagalGinjal, 
            setHamil, 
            setMenopause
          );
        } else {
          setIsNewPrecond(true);
          const patientGen = patientGender === 'm' ? 'Male' : patientGender === 'f' ? 'Female' : '';
          if (gList.length > 0) {
            const gender = gList.find(el => {
              return el.name === patientGen;
            });
            setGender(gender);
          }
        }

        setWeight(res.weight ? String(res.weight) : '');
        setHeight(res.height ? String(res.height) : '');
      }

      setLoading(false);
    })
    .catch(err => {
      setError(
        err.response && err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
          ? err.response.data.details[0].metadata.errInd
          : 'Gangguan sistem, mohon coba kembali.',
      );
      setLoading(false);
    });
    /*esling-enable*/
};

export const setUserPrecond = (
  userPrecond: PrecondListInt[],
  setGender: React.Dispatch<React.SetStateAction<PrecondListInt | undefined>>,
  setDarahTinggi: React.Dispatch<React.SetStateAction<boolean>>,
  setDiabetes: React.Dispatch<React.SetStateAction<boolean>>,
  setMerokok: React.Dispatch<React.SetStateAction<boolean>>,
  setMinumAlkohol: React.Dispatch<React.SetStateAction<boolean>>,
  setKanker: React.Dispatch<React.SetStateAction<boolean>>,
  setSakitJantung: React.Dispatch<React.SetStateAction<boolean>>,
  setGagalGinjal: React.Dispatch<React.SetStateAction<boolean>>,
  setHamil: React.Dispatch<React.SetStateAction<boolean>>,
  setMenopause: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  setGender(
    userPrecond.find(el => {
      return el.type === 'gender';
    }),
  );

  if (
    userPrecond.find(el => {
      return el.name === 'Hypertensive';
    })
  )
    setDarahTinggi(true);
  else setDarahTinggi(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Diabetic';
    })
  )
    setDiabetes(true);
  else setDiabetes(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Smoker';
    })
  )
    setMerokok(true);
  else setMerokok(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Alcohol drinker';
    })
  )
    setMinumAlkohol(true);
  else setMinumAlkohol(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Cancer';
    })
  )
    setKanker(true);
  else setKanker(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Cardiovascular Disease';
    })
  )
    setSakitJantung(true);
  else setSakitJantung(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Chronic Kidney Failure';
    })
  )
    setGagalGinjal(true);
  else setGagalGinjal(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Pregnant';
    })
  )
    setHamil(true);
  else setHamil(false);

  if (
    userPrecond.find(el => {
      return el.name === 'Menopause';
    })
  )
    setMenopause(true);
  else setMenopause(false);
};