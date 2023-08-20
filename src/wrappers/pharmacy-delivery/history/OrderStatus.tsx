import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderContext } from '../../../components/header/HeaderContext';
import '../../booking/booking-page/bookingPage.scss';
import { useQuery } from '@apollo/client';
import { ORDER_HISTORY } from '../../../graphql/query';
import { getDate, getMonthNameShort, getHoursMinutes } from '../../../utils/constant';
import Skeleton from 'react-loading-skeleton';

const baseUrl = `${process.env.REACT_APP_ASSET_URL}/remedi/Icons`;

const happyFlowOrderStatus = [
  {
    status: 'CUSTOMER_PAYMENT_SUCCESS',
    title: 'Pembayaran diterima',
    description: '',
    iconGray: `${baseUrl}/gray-order-accepted.png`,
    iconColor: `${baseUrl}/color-order-accepted.png`,
  },
  {
    status: 'ORDER_IS_PROCESSED_BY_PHARMACY',
    title: 'Pesanan obat diproses',
    description: '',
    iconGray: `${baseUrl}/gray-order-processed.png`,
    iconColor: `${baseUrl}/color-order- processed.png`,
  },
  {
    status: 'ORDER_IS_WAITING_FOR_PICKED_UP',
    title: 'Menunggu kurir',
    description: '',
    iconGray: `${baseUrl}/gray-waiting-for-the-courier.png`,
    iconColor: `${baseUrl}/color-waiting-for-the-courier.png`,
  },
  {
    status: 'ORDER_IS_PICKED_BY_COURIER',
    title: 'Pesanan diambil kurir',
    description: '',
    iconGray: `${baseUrl}/gray-picked-up-by-courier.png`,
    iconColor: `${baseUrl}/color-picked-up-by-courier.png`,
  },
  {
    status: 'ITEM_ON_THE_WAY_TO_CUSTOMER',
    title: 'Pesanan obat dikirim',
    description: '',
    iconGray: `${baseUrl}/gray-order-sent.png`,
    iconColor: `${baseUrl}/color-order-sent.png`,
  },
  {
    status: 'ITEM_DELIVERED',
    title: 'Pesanan obat selesai',
    description: '',
    iconGray: `${baseUrl}/gray-order-completed.png`,
    iconColor: `${baseUrl}/color-order-completed.png`,
  },
];

const negativeFlowOrderStatus = [
  {
    status: 'CUSTOMER_PAYMENT_SUCCESS',
    title: 'Pembayaran diterima',
    description: '',
    iconGray: `${baseUrl}/gray-order-accepted.png`,
    iconColor: `${baseUrl}/color-order-accepted.png`,
  },
  {
    status: 'ORDER_DECLINED_BY_PHARMACY',
    title: 'Pesanan obat ditolak',
    description: '',
    iconGray: `${baseUrl}/gray-order-rejected.png`,
    iconColor: `${baseUrl}/color-order-rejected.png`,
  },
  {
    status: 'CUSTOMER_REFUND_PROCESSED',
    title: 'Pengembalian diproses',
    description: '',
    iconGray: `${baseUrl}/gray-refunds-processed.png`,
    iconColor: `${baseUrl}/color-refunds-processed.png`,
  },
  {
    status: 'CUSTOMER_REFUND_SUCCESS',
    title: 'Pengembalian berhasil',
    description: '',
    iconGray: `${baseUrl}/gray-refunds-completed.png`,
    iconColor: `${baseUrl}/color-refunds-completed.png`,
  },
];
interface OrderStatusItemProps {
  key: number;
  statusClassName: string;
  title: string;
  time: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
}

interface History {
  state: string;
  updated_at: string;
}

const OrderStatusItem = ({
  statusClassName,
  title,
  time,
  description,
  imgSrc,
  imgAlt,
}: OrderStatusItemProps): JSX.Element => {
  return (
    <div className={`item ${statusClassName}`}>
      <div className="icon">
        <img src={imgSrc} alt={imgAlt} />
      </div>
      <div className="detail">
        <span className="title">{title}</span>
        <span className="subtitle">{time}</span>
        <span className="description">{description}</span>
      </div>
    </div>
  );
};

const ignoredState = [
  'CUSTOMER_WAITING_FOR_PAYMENT',
  'CUSTOMER_PAYMENT_FAILED',
  'CUSTOMER_PAYMENT_EXPIRED',
  'CUSTOMER_PAYMENT_REJECTED',
  'CUSTOMER_PAYMENT_CANCELLED',
  'CUSTOMER_PAYMENT_PENDING',
  'COURIER_ARRIVED_AT_PICKUP_LOCATION',
  'CUSTOMER_WAITING_FOR_REFUND',
  'CUSTOMER_REFUND_ASKED',
  'RE_ATTEMPT_PICKUP',
  'COURIER_ARRIVED_AT_DESTINATION',
  'ITEM_LOST',
];

export const OrderStatus: React.FC = () => {
  const { setHeader } = useContext(HeaderContext);

  useEffect(() => {
    setHeader('Pesan Antar Farmasi');
    return (): void => setHeader('');
  }, [setHeader]);

  const trxId: any = Object(useParams()).id;
  const { loading, data } = useQuery(ORDER_HISTORY, {
    variables: { id: trxId },
  });

  if (loading)
    return (
      <div className="prixa-container is-top">
        <Skeleton count={3} />
      </div>
    );

  const historydata = data.order.history;

  // removing duplicate state in order history
  const seen = new Set();
  const historytmp = historydata.filter((el: any) => {
    const duplicate = seen.has(el.state);
    seen.add(el.state);
    return !duplicate;
  });

  /** sort history asc by updated_at */
  const history = historytmp
    .filter(({ state }: History) => !ignoredState.includes(state))
    .sort((a: History, b: History) => (a.updated_at > b.updated_at ? 1 : -1));

  let statusList = happyFlowOrderStatus;

  if (history.length > 1 && history[1]?.state === negativeFlowOrderStatus[1].status) {
    statusList = negativeFlowOrderStatus;
    statusList[1].description = data.order.rejection_reason;
  }

  return (
    <div className="prixa-container is-top">
      <div className="order-timeline">
        {statusList.map((item, index) => {
          let statusClassName = '';

          if (index < history.length - 1) statusClassName = 'passed';
          if (index === history.length - 1) statusClassName = 'ongoing';

          const currentHistory = history.find((itemHistory: History) => itemHistory.state === item.status);
          const formattedDateTime = currentHistory
            ? `${getDate(currentHistory.updated_at)} ${getMonthNameShort(currentHistory.updated_at)}, ${getHoursMinutes(
                currentHistory.updated_at,
              )}`
            : '';
          const imgSrc = currentHistory ? item.iconColor : item.iconGray;

          return (
            <OrderStatusItem
              key={index}
              title={item.title}
              statusClassName={statusClassName}
              time={formattedDateTime}
              description={item.description}
              imgSrc={imgSrc}
              imgAlt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};
