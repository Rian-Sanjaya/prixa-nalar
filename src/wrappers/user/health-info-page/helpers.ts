import moment from 'moment';
import { PrecondListInt } from './HealthInformation';
import { getAPI, postAPI, patchAPI } from '../../../api/api-method';
import { USER_API } from '../../../api/api-url';

export const calcAge = (dateFrom: Date, dateTo: Date = new Date()): { age: number; type: string } => {
  const endDate = moment(dateTo);
  const startDate = moment(dateFrom);

  const age = endDate.diff(startDate, 'years');

  if (age > 0) return { age, type: 'year' };
  else return { age: endDate.diff(startDate, 'months'), type: 'month' };
};

export const getPreconditionsList = (
  setAgeYear: React.Dispatch<React.SetStateAction<number>>,
  setAgeMonth: React.Dispatch<React.SetStateAction<number>>,
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
  genderProfile: string,
  userId: string,
  userEmail: string,
  setPatientId: React.Dispatch<React.SetStateAction<string>>,
  setIsNewPrecond: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  /*eslint-disable*/
  getAPI(USER_API.FAMILY_MEMBER_LIST(userId))
    .then((res: any) => {
      const families = res.data;
      let patientId = '';
      let family: any;
      if (families && families.length > 0) {
        family = families.filter((f: any) => f.patient_email !== '' && f.patient_email !== null);
        patientId = family[0].id;
      }

      setPatientId(patientId);
      getAPI(USER_API.PRECONDITIONS(patientId))
        .then((res: any) => {
          setAgeYear(0);
          setAgeMonth(0);
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

            if (descPrecondition.length > 0) setDescriptivePrecondition(descPrecondition);

            const profileData = localStorage.getItem('profileData');
            let birthDate;
            let patientAge;
            const patientGender = family[0].patient_gender === 'm' ? 'Male' : family[0].patient_gender === 'f' ? 'Female' : '';

            if (profileData) birthDate = JSON.parse(profileData).birthdate;
            
            if (!birthDate) {
              if (family[0].patient_dob) {
                birthDate = family[0].patient_dob;
              } else if (family[0].patient_age) {
                patientAge = family[0].patient_age;
              }
            }
            
            if (birthDate) {
              const yr = birthDate.substr(0, 4);
              const mt = birthDate.substr(5, 2);
              const dt = birthDate.substr(8, 2);
              const brthDt = new Date(`${yr}/${mt}/${dt}`);

              const cAge = calcAge(brthDt);
              
              if (cAge.type === 'year')
                setAgeYear(cAge.age);
              else 
                setAgeMonth(cAge.age);
            } else if (patientAge) {
              setAgeYear(patientAge);
            }

            let gndr = '';
            if (genderProfile) gndr = genderProfile;
            else if (patientGender) gndr = patientGender;

            if (gList.length > 0) {
              const gender = gList.find(el => {
                return el.name === gndr;
              });
              setGender(gender);
            }

            if (res.precondList && res.precondList.length > 0) {
              setIsNewPrecond(false);
              setUserPrecond(
                res.precondList, 
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
            }

            setWeight(res.weight ? String(res.weight) : '');
            setHeight(res.height ? String(res.height) : '');
          }

          setLoading(false);
        })
    })
    .catch(err => {
      setAgeYear(0);
      setAgeMonth(0);
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

export const handleSubmit = async (
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
  handleEditMode: (mode: boolean) => void,
  setLoadProfile: React.Dispatch<React.SetStateAction<boolean>>,
  patientId: string,
  isNewPrecond: boolean,
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
    // eslint-disable-next-line
    if (isNewPrecond) {
      await postAPI(USER_API.PRECONDITIONS(patientId), precondPayload);
    } else {
      const data = await patchAPI(USER_API.PRECONDITIONS(patientId), precondPayload);
    }
    setIsLoadButton(false);
    handleEditMode(false);
    setLoadProfile(true);
    window.location.reload();
  } catch (err) {
    setError(
      err.response && err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
        ? err.response.data.details[0].metadata.errInd
        : 'Gangguan sistem, mohon coba kembali.',
    );
    setIsLoadButton(false);
    handleEditMode(false);
  }
};
