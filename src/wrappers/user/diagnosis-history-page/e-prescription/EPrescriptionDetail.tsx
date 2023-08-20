import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Text, Button } from 'prixa-design-kit/dist';
import { HeaderContext } from '../../../../components/header/HeaderContext';
import { getAPI } from '../../../../api/api-method';
import { PHARMACY_API } from '../../../../api/api-url';
import Skeleton from 'react-loading-skeleton';
import { getYear, getMonth, getDate, showPharmacyFeature } from '../../../../utils/constant';

const prixaLogo = `${process.env.REACT_APP_ASSET_URL}/prixa-header.png`;

export const EPrescriptionDetail = () => {
  interface EPrescriptionType {
    doctor: Record<string, any>;
    patient: Record<string, any>;
    patient_gender: string;
    patient_age: number;
    patient_weight: number;
    transaction: Record<string, any>;
    allergy: string;
    prescription_number: string;
    medicine_prescriptions: Record<string, any>;
    created_at: string;
    client_supply_logo: string;
    client_logo: string;
    is_available_for_order: boolean;
  }

  const { setHeader, setShowDownload, setShowAvatar, setDownload, isDownloading } = useContext(HeaderContext);
  const location = useLocation();
  const { prescriptionNumber, prescriptionImgUrl }: any = location.state;
  const [prescDetail, setPrescDetail] = useState<EPrescriptionType | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  const buttonOrder = document.getElementById('button-order');

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        (document.getElementById('button-order') as HTMLInputElement).style.padding = '0px';
        (document.querySelector('#button-order .full-button') as HTMLInputElement).style.borderRadius = '0px';
        (document.querySelector('#button-order .full-button') as HTMLInputElement).style.height = '64px';
        (document.getElementById('button-order') as HTMLInputElement).style.transition = 'all 250ms';
        (document.querySelector('#button-order .full-button') as HTMLInputElement).style.transition = 'all 250ms';
      } else {
        (document.getElementById('button-order') as HTMLInputElement).style.padding = '16px';
        (document.querySelector('#button-order .full-button') as HTMLInputElement).style.borderRadius = '8px';
        (document.querySelector('#button-order .full-button') as HTMLInputElement).style.height = '48px';
      }
    };
    if (buttonOrder) {
      window.addEventListener('scroll', onScroll);
      return () => {
        window.removeEventListener('scroll', onScroll);
      };
    }
  }, [buttonOrder]);

  useEffect(() => {
    setHeader('Resep Obat');
    setShowAvatar(false);
    setShowDownload(true);
    return () => setHeader('');
  }, [setHeader, setShowAvatar, setShowDownload]);

  useEffect(() => {
    const saveImage = () => {
      setDownload(true);
      fetch(String(`${prescriptionImgUrl}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })
        .then(response => response.blob())
        .then(blob => {
          // Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link: any | null = document.createElement('a');
          link.href = url;
          link.setAttribute('download', prescriptionNumber + '.jpeg');

          // Append to html link element page
          document.body.appendChild(link);

          // Start download
          link.click();

          // Clean up and remove the link
          link.parentNode.removeChild(link);
          setDownload(false);
        });
    };

    isDownloading && saveImage();
  }, [isDownloading, prescriptionImgUrl, prescriptionNumber, setDownload]);

  const patientId: any = Object(useParams()).patientid;
  const prescId: any = Object(useParams()).prescid;
  useEffect(() => {
    getAPI(PHARMACY_API.PRESCRIPTION_DETAIL(patientId, prescId)).then((res: any) => {
      setPrescDetail(res.data);
      setLoading(false);
    });
  }, [patientId, prescId]);

  const yearDt = getYear(String(prescDetail?.created_at));
  const monthDt = getMonth(String(prescDetail?.created_at));
  const dateDt = getDate(String(prescDetail?.created_at));

  return (
    <div className="prixa-container is-top is-full" style={{ width: 'inherit' }}>
      <div className="padding-largeX padding-largeY margin-xLargeB padding-xLargeB">
        <div className="prixa-eprescription-logo">
          {isLoading ? <Skeleton height={28} /> : <img alt="logo" height="28" src={prescDetail?.client_supply_logo} />}
          {isLoading ? <Skeleton height={28} /> : <img alt="logo" height="28" src={prescDetail?.client_logo} />}
        </div>
        <div className="prixa-eprescription-header">
          <Text scale="headerTitle" style={{ width: '50%', marginRight: '16px' }}>
            RESEP OBAT
          </Text>
          <div className="prescription-info">
            <Text style={{ color: 'var(--dark)' }} scale="headerSubtitle">
              {isLoading ? <Skeleton /> : prescDetail?.prescription_number}
            </Text>
            <Text fontSize="10px" fontWeight={400} style={{ color: 'var(--dark-60)' }} scale="headerSubtitle">
              {isLoading ? <Skeleton /> : `${dateDt}/${monthDt}/${yearDt}`}
            </Text>
          </div>
        </div>
        <div className="prixa-eprescription-information border-bottom">
          <div className="detail half">
            {isLoading ? (
              <Skeleton count={4} />
            ) : (
              <div className="data">
                <Text fontSize="10px" scale="headerSubtitle">
                  {`dr. ${prescDetail?.doctor.doctor_f_name} ${prescDetail?.doctor.doctor_l_name}`}
                </Text>
                <Text fontSize="10px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                  {prescDetail?.doctor.specialities[0].speciality_name}
                </Text>
                <Text fontSize="10px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                  {prescDetail?.doctor.doctor_sip}
                </Text>
                <Text fontSize="10px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                  {prescDetail?.doctor.doctor_phone}
                </Text>
              </div>
            )}
          </div>
          <div className="detail half" style={{ textAlign: 'right' }}>
            {isLoading ? (
              <Skeleton count={3} />
            ) : (
              <div className="data">
                <Text fontSize="10px" scale="headerSubtitle">
                  {prescDetail?.doctor.hospital.hospital_name}
                </Text>
                <Text fontSize="10px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                  {prescDetail?.doctor.hospital.hospital_address}
                </Text>
              </div>
            )}
          </div>
        </div>
        <div className="prixa-eprescription-information-column">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Pasien
          </Text>
          <Text className="padding-microT" style={{ color: 'var(--dark)' }} scale="headerSubtitle">
            {isLoading ? <Skeleton /> : `${prescDetail?.patient.patient_f_name} ${prescDetail?.patient.patient_l_name}`}
          </Text>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
              {prescDetail?.patient_gender === 'f' ? 'Perempuan' : 'Laki-Laki'}, {`${prescDetail?.patient_age} tahun`},{' '}
              {`${prescDetail?.patient_weight} kg`}
            </Text>
          )}
        </div>
        <div className="prixa-eprescription-information">
          <div className="detail">
            <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
              Diagnosis Banding
            </Text>
            {isLoading ? (
              <Skeleton count={3} />
            ) : (
              <div className="data">
                <Text
                  fontSize="12px"
                  lineHeight="18px"
                  style={{ color: 'var(--dark-60)' }}
                  fontWeight={400}
                  scale="headerSubtitle"
                >
                  <ol style={{ marginBlockStart: '0px', paddingInlineStart: '10px', marginBlockEnd: '0px' }}>
                    {prescDetail?.transaction.differential_diagnosis_label.map((diagnosis: string, index: number) => {
                      return <li key={index}>{diagnosis}</li>;
                    })}
                  </ol>
                </Text>
              </div>
            )}
          </div>
        </div>
        <div className="prixa-eprescription-information">
          <div className="detail">
            <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
              Alergi
            </Text>
            <div className="data">
              <Text fontSize="12px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                {isLoading ? <Skeleton /> : prescDetail?.allergy}
              </Text>
            </div>
          </div>
        </div>
        <div className="margin-baseT">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Daftar Obat
          </Text>
          {prescDetail?.medicine_prescriptions.map((presc: any, index: number) => {
            return (
              <div key={index} className="prixa-eprescription-medicine">
                <div className="header">
                  <Text scale="questionLink2" lineHeight="0px" style={{ color: 'var(--primary)' }}>
                    R/
                  </Text>
                  <Text scale="questionLink2" lineHeight="0px" style={{ color: 'var(--primary)' }}>
                    {presc.medicine.brand}
                  </Text>
                </div>
                <div className="information margin-smallT">
                  <Text fontSize="12px" scale="headerSubtitle">
                    Frekuensi
                  </Text>
                  <Text fontSize="12px" fontWeight={400} scale="headerSubtitle">
                    {presc.frequency}x{Number(presc.frequency_dd)} {presc.amount_unit} per hari, {presc.timing}
                  </Text>
                </div>
                <div className="information">
                  <Text fontSize="12px" scale="headerSubtitle">
                    Durasi
                  </Text>
                  <Text fontSize="12px" fontWeight={400} scale="headerSubtitle">
                    {`${presc.duration} ${presc.duration_unit}`}
                  </Text>
                </div>
                <div className="information">
                  <Text fontSize="12px" scale="headerSubtitle">
                    Jumlah
                  </Text>
                  <Text fontSize="12px" fontWeight={400} scale="headerSubtitle">
                    {`${presc.amount} ${presc.amount_unit}`}
                  </Text>
                </div>
                <div className="information">
                  <Text fontSize="12px" scale="headerSubtitle">
                    Substitusi
                  </Text>
                  <Text fontSize="12px" fontWeight={400} scale="headerSubtitle">
                    {presc.substitution === 0 ? 'Tidak' : 'Iya'}
                  </Text>
                </div>
                <div className="information border-top">
                  <Text fontSize="12px" lineHeight="0px" scale="headerSubtitle">
                    Catatan
                  </Text>
                  <Text fontSize="12px" lineHeight="0px" fontWeight={400} scale="headerSubtitle">
                    {presc.notes}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
        <div className="prixa-eprescription-information">
          <div className="detail">
            <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
              Catatan Resep
            </Text>
            <div className="data">
              <Text
                fontSize="12px"
                lineHeight="18px"
                style={{ color: 'var(--dark-60)' }}
                fontWeight={400}
                scale="headerSubtitle"
              >
                <ol style={{ marginBlockStart: '0px', paddingInlineStart: '10px' }}>
                  <li className="margin-tinyB">
                    Subtitusi berarti obat dapat digantikan dengan merek lain selama kandungan dan kekuatannya sama
                  </li>
                  <li className="margin-tinyB">Obat yang diresepkan hanya untuk penggunaan sesuai instruksi dokter</li>
                  <li>Penyalahgunaan obat bukan tanggung jawab Pihak Asuransi maupun Dokter</li>
                </ol>
              </Text>
            </div>
          </div>
        </div>
        <div className="prixa-eprescription-sign">
          {isLoading ? (
            <Skeleton height={32} />
          ) : (
            <img alt="signature" src={prescDetail?.doctor.doctor_signature} width="184" />
          )}
          <div className="separator" />
          <Text fontSize="12px" style={{ color: 'var(--dark-60)' }} scale="content">
            {isLoading ? <Skeleton /> : `dr. ${prescDetail?.doctor.doctor_f_name} ${prescDetail?.doctor.doctor_l_name}`}
          </Text>
        </div>
        <div className="prixa-eprescription-footer">
          <div className="content">
            {isLoading ? <Skeleton /> : <img src={prixaLogo} height="12px" alt="Prixa Logo" />}
          </div>
          <div className="content">
            <span>{isLoading ? <Skeleton /> : prescDetail?.prescription_number}</span>
          </div>
        </div>
      </div>
      {showPharmacyFeature() && prescDetail?.is_available_for_order && (
        <div id="button-order" className="prixa-button-full sticky-bottom">
          <Link
            to={{
              pathname: '/pharmacy-delivery',
              search: `?prescriptionid=${prescId}`,
            }}
          >
            <Button className="full-button" size="full" variant="primary">
              Pesan Obat
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
