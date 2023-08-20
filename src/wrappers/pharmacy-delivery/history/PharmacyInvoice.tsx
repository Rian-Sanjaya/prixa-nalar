/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Text } from 'prixa-design-kit/dist';
import { HeaderContext } from '../../../components/header/HeaderContext';
import Skeleton from 'react-loading-skeleton';
import { getDate, getMonthNameLong, getYear, getFullDate, formattedCurrency } from '../../../utils/constant';
import { useQuery } from '@apollo/client';
import { ORDER } from '../../../graphql/query';

const prixaLogo = `${process.env.REACT_APP_ASSET_URL}/prixa-header.png`;

export const PharmacyInvoice = () => {
  interface PharmacyInvoiceType {
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
  }

  const { setHeader, setShowDownload, setShowAvatar } = useContext(HeaderContext);

  useEffect(() => {
    setHeader('Invoice');
    setShowAvatar(false);
    setShowDownload(true);
    return () => setHeader('');
  }, [setHeader, setShowAvatar, setShowDownload]);

  const trxId: any = Object(useParams()).id;

  const { data, loading } = useQuery(ORDER, {
    notifyOnNetworkStatusChange: true,
    variables: { id: trxId },
  });

  if (loading) return <InvoiceSkeleton />;

  const {
    prescription_number,
    patient_name,
    item_total,
    delivery_total,
    admin_fee,
    payment_total,
    prescription,
    line_items,
    store,
    payments,
    created_at,
    bill_address,
    arrival_date_estimation,
  } = data.order;

  let prescriptionDetail: Array<{}> = [];
  line_items.map((item: any) => {
    prescription.medicine_prescriptions.forEach((medicine: any) => {
      if (item.variant.medicine_reference_name === medicine.medicine.brand) {
        prescriptionDetail = [...prescriptionDetail, { item, medicine }];
      }
    });
    return prescriptionDetail;
  });

  const dateDt = getDate(created_at);
  const monthDt = getMonthNameLong(created_at);
  const yearDt = getYear(created_at);

  return (
    <div className="prixa-container is-top is-full" style={{ width: 'inherit' }}>
      <div className="padding-largeX padding-largeY">
        <div className="prixa-eprescription-logo">
          <img alt="logo" height="28" src={prescription.client_supply_logo} />
          <img alt="logo" height="28" src={prescription.client_logo} />
        </div>
        <div className="prixa-eprescription-header">
          <Text scale="headerTitle" style={{ width: '50%', marginRight: '16px' }}>
            INVOICE
          </Text>
          <div className="prescription-info">
            <Text style={{ color: 'var(--dark)' }} scale="headerSubtitle">
              {payments[0].number}
            </Text>
            <Text
              fontSize="10px"
              fontWeight={400}
              style={{ color: 'var(--dark-60)' }}
              scale="headerSubtitle"
            >{`${dateDt} ${monthDt} ${yearDt}`}</Text>
          </div>
        </div>
        <div className="prixa-eprescription-information border-bottom">
          <div className="detail half">
            <div className="data">
              <Text fontSize="10px" scale="headerSubtitle">
                {patient_name}
              </Text>
              <Text
                fontSize="10px"
                style={{ color: 'var(--dark-60)', fontStyle: 'italic' }}
                fontWeight={400}
                scale="headerSubtitle"
              >
                Pembayaran:
              </Text>
              <Text fontSize="10px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                {payments[0].payment_method.name}
              </Text>
            </div>
          </div>
          <div className="detail half" style={{ textAlign: 'right' }}>
            <div className="data">
              <Text fontSize="10px" scale="headerSubtitle">
                {store ? store.name : '-'}
              </Text>
              <Text fontSize="10px" style={{ color: 'var(--dark-60)' }} fontWeight={400} scale="headerSubtitle">
                {store ? store.address : '-'}
              </Text>
            </div>
          </div>
        </div>
        <div className="prixa-eprescription-information-column">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            No. Resep
          </Text>
          <Text className="padding-microT" style={{ color: 'var(--dark)' }} scale="headerSubtitle">
            {prescription_number}
          </Text>
        </div>
        <div className="margin-baseT">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Daftar Obat
          </Text>
          <div className="pharmacy-invoice-card">
            {prescriptionDetail.map((detail: any, index: number) => {
              return (
                <div key={index} className="medicine-detail">
                  <span className="title">{detail.item.variant.name}</span>
                  <span className="subtitle">
                    {detail.medicine.medicine.brand} {detail.medicine.amount} {detail.medicine.amount_unit}
                  </span>
                  <div className="price">
                    <span>
                      {formattedCurrency.format(detail.item.price)} x {detail.item.quantity}
                    </span>
                    <span>{formattedCurrency.format(detail.item.total_price)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="margin-baseT">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Informasi Pengiriman
          </Text>
          <div className="pharmacy-invoice-card">
            <div className="address-information">
              <span className="title">{bill_address.label}</span>
              <span className="phone">{bill_address.phone}</span>
              <span className="address">{bill_address.address_location}</span>
              <span className="detail">{bill_address.address_detail}</span>
            </div>
          </div>
        </div>
        <div className="margin-baseT">
          <div className="pharmacy-invoice-card">
            <div className="delivery-detail">
              <span className="type">Same Day Delivery</span>
              <div className="detail">
                <span>Estimasi Tiba: {arrival_date_estimation ? getFullDate(arrival_date_estimation) : '-'}</span>
                <span>{formattedCurrency.format(delivery_total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-baseT" style={{ position: 'relative' }}>
          <div className={`pharmacy-invoice-stamp ${payments[0].state === 'SUCCESS' ? 'success' : ''}`} />
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Total Biaya
          </Text>
          <div className="pharmacy-invoice-card">
            <div className="total-cost">
              <div className="data separator">
                <span>Metode Pembayaran</span>
                <span>{payments[0].payment_method.name}</span>
              </div>
              <div className="data">
                <span>Biaya Obat</span>
                <span>{formattedCurrency.format(item_total)}</span>
              </div>
              <div className="data insurance separator">
                <span>Tanggungan Asuransi</span>
                <span>{formattedCurrency.format(item_total * -1)}</span>
              </div>
              <div className="data">
                <span>Total Biaya Tebus Resep</span>
                <span>Rp 0</span>
              </div>
              <div className="data">
                <span>Biaya Kirim</span>
                <span>{formattedCurrency.format(delivery_total)}</span>
              </div>
              <div className="data separator">
                <span>Biaya Admin</span>
                <span>{formattedCurrency.format(admin_fee)}</span>
              </div>
              <div className="data total">
                <span>Total Pembayaran</span>
                <span>{formattedCurrency.format(payment_total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="prixa-eprescription-footer">
          <div className="content">
            <img src={prixaLogo} height="12px" alt="Prixa Logo" />
          </div>
          <div className="content">
            <span>{payments[0].number}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceSkeleton = () => {
  return (
    <div className="prixa-container is-top is-full" style={{ width: 'inherit' }}>
      <div className="padding-largeX padding-largeY">
        <div className="prixa-eprescription-logo">
          <Skeleton />
          <Skeleton />
        </div>
        <div className="prixa-eprescription-header">
          <Text scale="headerTitle" style={{ width: '50%', marginRight: '16px' }}>
            INVOICE
          </Text>
          <div className="prescription-info">
            <Text style={{ color: 'var(--dark)' }} scale="headerSubtitle">
              <Skeleton />
            </Text>
            <Text fontSize="10px" fontWeight={400} style={{ color: 'var(--dark-60)' }} scale="headerSubtitle">
              <Skeleton />
            </Text>
          </div>
        </div>
        <div className="prixa-eprescription-information border-bottom">
          <div className="detail half">
            <Skeleton />
          </div>
          <div className="detail half" style={{ textAlign: 'right' }}>
            <Skeleton />
          </div>
        </div>
        <div className="prixa-eprescription-information-column">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            No. Resep
          </Text>
          <Text className="padding-microT" style={{ color: 'var(--dark)' }} scale="headerSubtitle">
            <Skeleton />
          </Text>
        </div>
        <div className="margin-baseT">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Daftar Obat
          </Text>
          <div className="pharmacy-invoice-card">
            <Skeleton count={3} />
          </div>
        </div>
        <div className="margin-baseT">
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Informasi Pengiriman
          </Text>
          <div className="pharmacy-invoice-card">
            <div className="address-information">
              <span className="title">
                <Skeleton />
              </span>
              <span className="phone">
                <Skeleton />
              </span>
              <span className="address">
                <Skeleton />
              </span>
              <span className="detail">
                <Skeleton />
              </span>
            </div>
          </div>
        </div>
        <div className="margin-baseT">
          <div className="pharmacy-invoice-card">
            <div className="delivery-detail">
              <span className="type">
                <Skeleton />
              </span>
              <div className="detail">
                <span>
                  Estimasi Tiba: <Skeleton />
                </span>
                <span>
                  <Skeleton />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-baseT" style={{ position: 'relative' }}>
          <Text style={{ color: 'var(--dark)' }} scale="headerTitle">
            Total Biaya
          </Text>
          <div className="pharmacy-invoice-card">
            <div className="total-cost">
              <div className="data separator">
                <span>Metode Pembayaran</span>
                <span>
                  <Skeleton />
                </span>
              </div>
              <div className="data">
                <span>Biaya Obat</span>
                <span>
                  <Skeleton />
                </span>
              </div>
              <div className="data insurance separator">
                <span>Tanggungan Asuransi</span>
                <span>
                  <Skeleton />
                </span>
              </div>
              <div className="data">
                <span>Total Biaya Tebus Resep</span>
                <span>
                  <Skeleton />
                </span>
              </div>
              <div className="data">
                <span>Biaya Kirim</span>
                <span>
                  <Skeleton />
                </span>
              </div>
              <div className="data separator">
                <span>Biaya Admin</span>
                <span>
                  <Skeleton />
                </span>
              </div>
              <div className="data total">
                <span>Total Pembayaran</span>
                <span>
                  <Skeleton />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="prixa-eprescription-footer">
          <div className="content">
            <Skeleton />
          </div>
          <div className="content">
            <span>
              <Skeleton />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
