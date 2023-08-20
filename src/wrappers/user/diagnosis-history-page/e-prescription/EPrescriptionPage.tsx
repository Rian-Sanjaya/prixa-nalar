import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { HeaderContext } from '../../../../components/header/HeaderContext';
import { Text, Card, IconSolid } from 'prixa-design-kit/dist';
import '../../../booking/booking-page/bookingPage.scss';
import { getAPI } from '../../../../api/api-method';
import { BAYMAX_API } from '../../../../api/api-url';
import { getYear, getMonth, getDate } from '../../../../utils/constant';
import 'moment/locale/id';
import { consultationStatusText } from '../utils';
import Skeleton from 'react-loading-skeleton';

const consultationViaChatImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Chat-Consultation.png`;

export const EPrescriptionPage = () => {
  interface EPrescriptionType {
    id: string;
    chief_complaint: string;
    doctor: Record<string, any>;
    state: string;
    created_at: string;
    patient: Record<string, string>;
    prescription: Record<string, string>;
  }

  const history = useHistory();

  const { setHeader } = useContext(HeaderContext);
  const [ePrescription, setEPrescription] = useState<EPrescriptionType | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setHeader('Konsultasi via Chat');
    return () => setHeader('');
  }, [setHeader]);

  const trxId: any = Object(useParams()).id;
  useEffect(() => {
    getAPI(BAYMAX_API.CONSULTATION_WITH_PRESCRIPTION(trxId)).then((res: any) => {
      setEPrescription(res.data);
      setLoading(false);
    });
  }, [trxId]);

  const yearDt = getYear(String(ePrescription?.created_at));
  const monthDt = getMonth(String(ePrescription?.created_at));
  const dateDt = getDate(String(ePrescription?.created_at));

  const viewPrescription = () => {
    history.push({
      pathname: `/diagnosis-history/eprescription/detail/patientid/${ePrescription?.patient.id}/prescid/${ePrescription?.prescription.id}`,
      state: {
        prescriptionNumber: ePrescription?.prescription.prescription_number,
        prescriptionImgUrl: ePrescription?.prescription.img_url,
      },
    });
  };

  return (
    <div className="prixa-container is-top">
      <div className="prixa-cta" style={{ backgroundColor: '#55B9E6', cursor: 'default' }}>
        <div className="content">
          {isLoading ? <Skeleton /> : <span className="title">{ePrescription?.patient.patient_f_name}</span>}
          {/* {isLoading ? <Skeleton /> : <span className="subtitle">Diri Sendiri</span>} */}
        </div>
        <img src={consultationViaChatImg} alt="CTA Icon" />
      </div>
      <Text scale="headerTitle">Rangkuman</Text>
      <Card className="margin-tinyT margin-baseB">
        <div className="prixa-booking-data">
          <Text style={{ color: '#AAAAAA' }} scale="content">
            Tanggal Konsultasi
          </Text>
          {isLoading ? <Skeleton /> : <Text scale="pageTitle">{`${dateDt}-${monthDt}-${yearDt}`}</Text>}
        </div>
        <div className="prixa-booking-data">
          <Text style={{ color: '#AAAAAA' }} scale="content">
            Keluhan Utama
          </Text>
          {isLoading ? <Skeleton /> : <Text scale="pageTitle">{ePrescription?.chief_complaint || '-'}</Text>}
        </div>
        <div className="prixa-booking-data">
          <Text style={{ color: '#AAAAAA' }} scale="content">
            Nama Dokter
          </Text>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text scale="pageTitle">{ePrescription?.doctor ? ePrescription.doctor.doctor_name : '-'}</Text>
          )}
        </div>
        <div className="prixa-booking-data">
          <Text style={{ color: '#AAAAAA' }} scale="content">
            Spesialisasi
          </Text>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text scale="pageTitle">
              {ePrescription?.doctor.specialities ? ePrescription.doctor.specialities[0].speciality_name : '-'}
            </Text>
          )}
        </div>
        <div className="prixa-booking-data">
          <Text style={{ color: '#AAAAAA' }} scale="content">
            Status
          </Text>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text scale="pageTitle">{consultationStatusText(String(ePrescription?.state))}</Text>
          )}
        </div>
      </Card>
      <Text scale="headerTitle">Resep Obat</Text>
      <Card className="margin-tinyT">
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="prixa-doctor-card">
            <Text
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '24px' }}
              scale="pageTitle"
            >
              {ePrescription?.prescription.prescription_number}
            </Text>
            <IconSolid
              style={{ cursor: 'pointer' }}
              onClick={() => viewPrescription()}
              backgroundColor="secondary"
              backgroundSize="24px"
              type="chevron-right"
              width="12px"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default EPrescriptionPage;
