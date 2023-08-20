import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button, Toast, Icon } from 'prixa-design-kit/dist';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { LoadPage } from '../../diagnostic/LoadPage';
import { USER_API } from '../../../api/api-url';
import { getAPI } from '../../../api/api-method';
import { calcAge } from './helpers';

const avatarNone = `${process.env.REACT_APP_ASSET_URL}/home/Account-None.png`;
const avatarMale = `${process.env.REACT_APP_ASSET_URL}/home/Account-Male.png`;
const avatarFemale = `${process.env.REACT_APP_ASSET_URL}/home/Account-Female.png`;

interface FamilyList {
  id?: string;
  patient_f_name?: string;
  patient_l_name?: string;
  patient_gender?: string;
  patient_dob?: string;
}

interface IntHistory {
  patientId: string;
  patientAge: { age: number; type: string };
  patientGender: string;
  patientName: string;
  familyMemberAddedMsg: string;
}

const FamilyMember = (): JSX.Element => {
  const [isLoad, setIsLoad] = useState(true);
  const [isErrMsg, setErrMsg] = useState('');
  const [familyList, setFamilyList] = useState<FamilyList[]>([]);
  const [loadUrlPhoto, setLoadUrlPhoto] = useState(true);
  const { setHeader, setMenu, setCountFamilyMember, errorHeader } = useContext(HeaderContext);

  const history = useHistory<IntHistory>();

  /* eslint-disable */
  useEffect(() => {
    setHeader('Daftar Keluarga');
    setMenu(false);

    return () => {
      setHeader('');
    };
  }, []);

  useEffect(() => {
    const pData = localStorage.getItem('profileData');
    let userId = '';
    let userEmail = '';
    if (pData) {
      const profileData = JSON.parse(pData);
      userId = profileData.id ? profileData.id : '';
      userEmail = profileData.email ? profileData.email : '';
    }
    getAPI(USER_API.FAMILY_MEMBER_LIST(userId))
      .then((res: any) => {
        setIsLoad(false);
        const family = res.data;
        if (family && family.length > 0) {
          const familyList = family.filter((f: any) => f.patient_email !== userEmail);
          setCountFamilyMember(familyList.length);
          setFamilyList(familyList);
          setTimeout(() => {
            setLoadUrlPhoto(false);
            if (history.location.state && history.location.state.familyMemberAddedMsg && history.location.state.familyMemberAddedMsg !== '') {
              setErrMsg(history.location.state.familyMemberAddedMsg);
              history.replace({ ...history.location, state: {...history.location.state, familyMemberAddedMsg: '' } });
              setTimeout(() => {
                setErrMsg('');
              }, 3000);
            }
          }, 1000);
        }
      })
      .catch(err => {
        setErrMsg(
          err.response && err.response.data.details && err.response.data.details[0] && err.response.data.details[0].metadata
          ? err.response.data.details[0].metadata.errInd
          : 'Gangguan sistem, mohon coba kembali.',
        );
        setIsLoad(false);
      });
  }, []);
  /* eslint-enable */

  if (isLoad) return <LoadPage />;

  return (
    <>
      <div className={`prixa-container ${familyList.length === 0 ? 'is-bottom' : 'is-top'}`}>
        {familyList.length > 0 ? <FamilyList familyList={familyList} loadUrlPhoto={loadUrlPhoto} /> : <NoFamilyList />}
      </div>
      <Toast
        timeout={3000}
        message={isErrMsg || errorHeader}
        variant={
          history.location.state &&
          history.location.state.familyMemberAddedMsg &&
          history.location.state.familyMemberAddedMsg !== ''
            ? 'success'
            : 'danger'
        }
        show={isErrMsg !== '' || errorHeader !== ''}
      ></Toast>
    </>
  );
};

const NoFamilyList = (): JSX.Element => {
  const history = useHistory();

  return (
    <>
      <div className="margin-baseB">
        <Text data-cy="no-family-member" scale="heroTitle">
          Belum ada anggota keluarga yang ditambahkan.
        </Text>
      </div>
      <div>
        <Text scale="content">Daftar anggota keluarga yang telah Anda tambahkan akan ditampilkan di halaman ini.</Text>
      </div>
      <div className="text-center margin-largeT margin-xLargeB">
        <Button size="xLarge" onClick={(): void => history.push('/add-family-member')}>
          Tambah Keluarga
        </Button>
      </div>
    </>
  );
};

const FamilyList = ({ familyList, loadUrlPhoto }: { familyList: FamilyList[]; loadUrlPhoto: boolean }): JSX.Element => {
  const history = useHistory();

  return (
    <>
      {familyList.map(family => {
        let cAge: { age: number; type: string };
        let age = '';
        let patientAge: string;
        if (family.patient_dob) {
          const yr = family.patient_dob.substr(0, 4);
          const mt = family.patient_dob.substr(5, 2);
          const dt = family.patient_dob.substr(8, 2);
          const brthDt = new Date(`${yr}/${mt}/${dt}`);

          cAge = calcAge(brthDt);

          patientAge = String(cAge.age);
          if (cAge.type === 'year') {
            age = patientAge + ' tahun';
          } else {
            age = patientAge + ' bulan';
          }
        }

        let gender: string | undefined = '';
        let imgContent = avatarNone;
        const profileData = localStorage.getItem('profileData');
        if (profileData) {
          gender = family.patient_gender;
          imgContent = gender === 'm' ? avatarMale : gender === 'f' ? avatarFemale : avatarNone;
        }

        return (
          <div
            data-cy="family-member"
            key={family.id}
            style={{ padding: '20px 0', borderBottom: '1px solid rgba(112, 112, 112, 0.25)' }}
          >
            <div
              style={{ display: 'flex', cursor: 'pointer' }}
              onClick={(): void =>
                history.push({
                  pathname: '/modify-family-member',
                  state: {
                    patientId: family.id,
                    patientAge: cAge,
                    patientGender: family.patient_gender,
                    patientName: family.patient_f_name,
                    patientDOB: family.patient_dob,
                  },
                })
              }
            >
              <div
                style={{
                  border: '1px solid var(--dark-20)',
                  borderRadius: '100%',
                  width: '64px',
                  height: '64px',
                  position: 'relative',
                }}
              >
                {loadUrlPhoto ? (
                  <Icon style={{ height: '64px', color: 'var(--primary)', margin: 'auto' }} type="circle-notch" spin />
                ) : (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <img
                      loading="lazy"
                      alt="Family Profile"
                      src={imgContent}
                      style={{
                        height: 'auto',
                        width: '100%',
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', paddingTop: '9px' }}>
                <div>
                  <Text scale="pageTitle">{`${family.patient_f_name} ${family.patient_l_name}`}</Text>
                </div>
                <div style={{ display: 'inherit' }}>
                  <Text scale="content">{`${
                    family.patient_gender === 'm' ? 'Laki-laki, ' : family.patient_gender === 'f' ? 'Perempuan, ' : ', '
                  } ${age}`}</Text>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FamilyMember;
