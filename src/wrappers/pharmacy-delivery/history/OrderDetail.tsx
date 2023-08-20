/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState, useContext } from 'react';
import { Toast } from 'prixa-design-kit/dist';
import { useParams, useHistory } from 'react-router-dom';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { Text, Card, IconSolid, Link } from 'prixa-design-kit/dist';
import '../../booking/booking-page/bookingPage.scss';
import { getDate, getMonthNameShort, getHoursMinutes, formattedCurrency } from '../../../utils/constant';
import 'moment/locale/id';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@apollo/client';
import { ORDER } from '../../../graphql/query';

const drugDeliveryImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Pharmacy-Delivery.png`;

export const orderStatus: any = {
  CUSTOMER_PAYMENT_SUCCESS: {
    title: 'Pembayaran diterima',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-order-accepted.png`,
  },
  ORDER_IS_PROCESSED_BY_PHARMACY: {
    title: 'Pesanan obat diproses',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-order- processed.png`,
  },
  ORDER_IS_WAITING_FOR_PICKED_UP: {
    title: 'Menunggu kurir',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-waiting-for-the-courier.png`,
  },
  RE_ATTEMPT_PICKUP: {
    title: 'Menunggu kurir',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-waiting-for-the-courier.png`,
  },
  COURIER_ARRIVED_AT_PICKUP_LOCATION: {
    title: 'Menunggu kurir',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-waiting-for-the-courier.png`,
  },
  ORDER_IS_PICKED_BY_COURIER: {
    title: 'Pesanan diambil kurir',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-picked-up-by-courier.png`,
  },
  ITEM_ON_THE_WAY_TO_CUSTOMER: {
    title: 'Pesanan obat dikirim',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-order-sent.png`,
  },
  COURIER_ARRIVED_AT_DESTINATION: {
    title: 'Pesanan obat dikirim',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-order-sent.png`,
  },
  ITEM_DELIVERED: {
    title: 'Pesanan obat selesai',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-order-completed.png`,
  },
  ORDER_DECLINED_BY_PHARMACY: {
    title: 'Pesanan obat ditolak',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-order-rejected.png`,
  },
  CUSTOMER_REFUND_PROCESSED: {
    title: 'Pengembalian diproses',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-refunds-processed.png`,
  },
  CUSTOMER_REFUND_SUCCESS: {
    title: 'Pengembalian berhasil',
    icon: `${process.env.REACT_APP_ASSET_URL}/remedi/Icons/color-refunds-completed.png`,
  },
};

export const OrderDetail = () => {
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

  const [successMessage, setSuccessMessage] = useState('');
  const { setHeader, setShowDownload } = useContext(HeaderContext);

  useEffect(() => {
    setHeader('Pesan Antar Farmasi');
    setShowDownload(false);
    return () => setHeader('');
  }, [setHeader, setShowDownload]);

  const trxId: any = Object(useParams()).id;
  const { loading, data } = useQuery(ORDER, {
    variables: { id: trxId },
  });

  if (loading) return <DetailSkeleton />;

  const {
    prescription_number,
    patient_name,
    delivery,
    item_total,
    delivery_total,
    admin_fee,
    payment_total,
    patient_id,
    prescription,
    store,
    payments,
    updated_at,
    state,
  } = data.order;

  const viewInvoice = () => {
    history.push({
      pathname: `/pharmacy-delivery/invoice/${trxId}`,
    });
  };

  const viewPrescription = () => {
    history.push({
      pathname: `/diagnosis-history/eprescription/detail/patientid/${patient_id}/prescid/${prescription.id}`,
      state: {
        prescriptionNumber: prescription.prescription_number,
        prescriptionImgUrl: prescription.img_url,
      },
    });
  };

  const viewOrderStatus = () => {
    history.push({
      pathname: `/pharmacy-delivery/status/${trxId}`,
    });
  };

  const copyToClipboard = (text: string): void => {
    const txtArea = document.createElement('textarea');
    txtArea.innerText = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    document.execCommand('copy');
    document.body.removeChild(txtArea);
    setSuccessMessage('Nomor Resi berhasil disalin.');
  };

  const monthDt = getMonthNameShort(updated_at);
  const dateDt = getDate(updated_at);
  const hoursMinutesDt = getHoursMinutes(updated_at);

  return (
    <div className="prixa-container is-top">
      <div className="prixa-cta" style={{ backgroundColor: '#ffb229', cursor: 'default' }}>
        <div className="content">
          <span className="title">{patient_name}</span>
          <span className="subtitle">{payments[0].number.slice(4)}</span>
        </div>
        <img src={drugDeliveryImg} alt="CTA Icon" />
      </div>
      <div className="card-container">
        <Text style={{ display: 'flex', justifyContent: 'space-between' }} scale="headerTitle">
          <span>Status</span>
          <Link className="link" onClick={() => viewOrderStatus()} scale="feedbackLink2" fontSize="12px">
            Lihat Detail Status
          </Link>
        </Text>
        <Card className="margin-tinyT">
          <div className="card-status-information">
            <div className="icon">{state && <img src={orderStatus[state].icon} alt={orderStatus[state].title} />}</div>
            <div>
              <Text scale="content">{orderStatus[state].title}</Text>
              <Text scale="content">
                {dateDt} {monthDt}, {hoursMinutesDt}
              </Text>
            </div>
          </div>
        </Card>
      </div>
      <div className="card-container">
        <Text scale="headerTitle">Informasi Pengiriman</Text>
        <Card className="card-delivery-information">
          <div>
            <Text scale="content">Apotek</Text>
            <Text scale="pageTitle">{store ? store.name : '-'}</Text>
          </div>
          <div>
            <Text scale="content">Pengiriman</Text>
            <Text scale="pageTitle">Same Day Delivery</Text>
          </div>
          <div>
            <Text scale="content">Kurir</Text>
            <Text scale="pageTitle">{delivery?.driver_name ? delivery.driver_name : '-'}</Text>
          </div>
          <div>
            <Text scale="content">
              <span>Nomor Resi</span>
              {delivery && (
                <Link className="link" onClick={() => copyToClipboard(delivery.tracking)} scale="feedbackLink2">
                  Salin No. Resi
                </Link>
              )}
            </Text>
            <Text scale="pageTitle">{delivery?.tracking ? delivery.tracking : '-'}</Text>
          </div>
        </Card>
      </div>
      <div className="card-container">
        <Text scale="headerTitle">Informasi Pembayaran</Text>
        <Card className="card-payment-information">
          <div>
            <div className="row">
              <Text scale="content">Metode Pembayaran</Text>
              <Text scale="pageTitle">{payments[0].payment_method.name}</Text>
            </div>
          </div>
          <div>
            <div className="row">
              <Text scale="content">Biaya Obat</Text>
              <Text scale="pageTitle">{formattedCurrency.format(item_total)}</Text>
            </div>
            <div className="row insurance">
              <Text scale="content">Tanggungan Asuransi</Text>
              <Text scale="pageTitle">{formattedCurrency.format(item_total * -1)}</Text>
            </div>
            <div className="row">
              <Text scale="content">Biaya Kirim</Text>
              <Text scale="pageTitle">{formattedCurrency.format(delivery_total)}</Text>
            </div>
            <div className="row">
              <Text scale="content">Biaya Admin</Text>
              <Text scale="pageTitle">{formattedCurrency.format(admin_fee)}</Text>
            </div>
          </div>
          <div>
            <div className="row total">
              <Text scale="content">Total Pembayaran</Text>
              <Text scale="pageTitle">{formattedCurrency.format(payment_total)}</Text>
            </div>
          </div>
        </Card>
      </div>
      <div className="card-container">
        <Text scale="headerTitle">Bukti Pemesanan</Text>
        <Card className="margin-tinyT">
          <div className="prixa-doctor-card">
            <Text
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '24px' }}
              scale="pageTitle"
            >
              Invoice - {payments[0].number}
            </Text>
            <IconSolid
              style={{ cursor: 'pointer' }}
              onClick={() => viewInvoice()}
              backgroundColor="secondary"
              backgroundSize="24px"
              type="chevron-right"
              width="12px"
            />
          </div>
        </Card>
        <Card className="margin-tinyT">
          <div className="prixa-doctor-card">
            <Text
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '24px' }}
              scale="pageTitle"
            >
              Resep - {prescription_number}
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
        </Card>
      </div>
      <Toast timeout={3000} variant="success" show={successMessage !== ''} message={successMessage} />
    </div>
  );
};

const DetailSkeleton = () => {
  return (
    <div className="prixa-container is-top">
      <div className="prixa-cta" style={{ backgroundColor: '#ffb229', cursor: 'default' }}>
        <div className="content">
          <Skeleton />
          <Skeleton />
        </div>
        <img src={drugDeliveryImg} alt="CTA Icon" />
      </div>
      <div className="card-container">
        <Text style={{ display: 'flex', justifyContent: 'space-between' }} scale="headerTitle">
          <span>Status</span>
          <Link className="link" scale="feedbackLink2" fontSize="12px">
            Lihat Detail Status
          </Link>
        </Text>
        <Card className="margin-tinyT">
          <Skeleton />
        </Card>
      </div>
      <div className="card-container">
        <Text scale="headerTitle">Informasi Pengiriman</Text>
        <Card className="card-delivery-information">
          <div>
            <Text scale="content">Apotek</Text>
            <Skeleton />
          </div>
          <div>
            <Text scale="content">Pengiriman</Text>
            <Skeleton />
          </div>
          <div>
            <Text scale="content">Kurir</Text>
            <Skeleton />
          </div>
          <div>
            <Text scale="content">
              <span>Nomor Resi</span>
              <Skeleton />
            </Text>
            <Skeleton />
          </div>
        </Card>
      </div>
      <div className="card-container">
        <Text scale="headerTitle">Informasi Pembayaran</Text>
        <Card className="card-payment-information">
          <div>
            <div className="row">
              <Text scale="content">Metode Pembayaran</Text>
              <Skeleton />
            </div>
          </div>
          <div>
            <div className="row">
              <Text scale="content">Biaya Obat</Text>
              <Skeleton />
            </div>
            <div className="row insurance">
              <Text scale="content">Tanggungan Asuransi</Text>
              <Skeleton />
            </div>
            <div className="row">
              <Text scale="content">Biaya Kirim</Text>
              <Skeleton />
            </div>
            <div className="row">
              <Text scale="content">Biaya Admin</Text>
              <Skeleton />
            </div>
          </div>
          <div>
            <div className="row total">
              <Text scale="content">Total Pembayaran</Text>
              <Skeleton />
            </div>
          </div>
        </Card>
      </div>
      <div className="card-container">
        <Text scale="headerTitle">Bukti Pemesanan</Text>
        <Card className="margin-tinyT">
          <Skeleton />
        </Card>
        <Card className="margin-tinyT">
          <Skeleton />
        </Card>
      </div>
    </div>
  );
};
