import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Toast, Link } from 'prixa-design-kit/dist';
import { getAPI } from '../../../api/api-method';
import { HISTORY_API } from '../../../api/api-url';
import moment from 'moment';
import { getYear, getMonth, getDate, showPrescriptionClaimFeature, showPharmacyFeature } from '../../../utils/constant';
import { LoadPage } from '../../../wrappers/diagnostic/LoadPage';
import { consultationStatusColor, consultationStatusText } from './utils';
import { orderStatus } from '../../pharmacy-delivery/history/OrderDetail';

export const ActivityTab = () => {
  interface AssessmentHistory {
    id: string;
    email: string;
    datetime: string;
    chiefComplaint: string;
    isPrescriptionExist: boolean;
    name: string;
    age: number;
    gender: string;
    state: string;
    tag: string;
  }

  const history = useHistory();

  const containerHeightRef = useRef<HTMLDivElement>(null);

  const [isErrorMsg, setError] = useState('');
  const [isEmpty, setEmpty] = useState(false);
  const [data, setData] = useState<AssessmentHistory[]>([]);

  if (data && (data.length === 0 || Object.keys(data).length === 0)) {
    if (containerHeightRef && containerHeightRef.current)
      containerHeightRef.current.style.setProperty('--containerHeight--', '0');
  } else if (containerHeightRef && containerHeightRef.current)
    containerHeightRef.current.style.setProperty('--containerHeight--', '48px');

  useEffect(() => {
    getAPI(HISTORY_API.ACTIVITY_HISTORY)
      .then((res: any) => {
        setError('');
        if (Object.keys(res).length > 0) {
          const filteredData = res.data.map((data: any) => {
            const formattedDate = {
              ...data,
              datetime:
                data.tag === 'baymax'
                  ? moment(new Date(data.datetime)).format()
                  : moment(new Date(data.datetime))
                      .add(7, 'hours')
                      .format(),
            };
            return formattedDate;
          });
          setData(
            filteredData
              .sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
              .reverse(),
          );
        }
      })
      .catch(err => {
        if (err.response.data.detail) {
          setEmpty(true);
        } else setError('Gangguan sistem, mohon coba kembali.');
      });
  }, []);

  const viewEPrescription = (id: string) => {
    history.push(`/diagnosis-history/eprescription/${id}`);
  };
  const viewPharmacyDeliveryOrderDetail = (id: string) => {
    history.push(`/pharmacy-delivery/detail/${id}`);
  };

  if (data.length < 1 && !isEmpty) return <LoadPage />;

  return (
    <div style={{ paddingTop: '60px' }} ref={containerHeightRef} className="prixa-container is-top wrapper">
      {!isEmpty ? (
        <div className="prixa-timeline">
          {data &&
            data.length > 0 &&
            data.map((item, i) => {
              const { id, datetime, name, isPrescriptionExist, state, tag } = item;
              const yearDt = getYear(datetime);
              const monthDt = getMonth(datetime);
              const dateDt = getDate(datetime);

              return (
                <div key={i}>
                  {(i === 0 || yearDt !== getYear(data[i - 1].datetime)) && (
                    <div className="year-box">
                      <div className="year-line"></div>
                      <Text className="year-text">{yearDt}</Text>
                      <span className="year-line"></span>
                    </div>
                  )}
                  <div className="list-container">
                    <div className="list-icon">
                      <div className="circle-box">
                        <div
                          className="upper"
                          style={{
                            position: i === 0 || yearDt !== getYear(data[i - 1].datetime) ? 'relative' : 'unset',
                          }}
                        ></div>
                        <div className="inner-box">
                          <div className={`circle ${tag === 'dexter' ? 'order' : 'chat'}`}></div>
                        </div>
                      </div>
                      <Text className="date">{`${dateDt}/${monthDt}`}</Text>
                    </div>
                    <div className="list">
                      <div className="prixa-flex-column">
                        <Text scale="pageTitle" className="title">
                          {tag === 'baymax' ? 'Konsultasi via Chat' : tag === 'dexter' ? 'Pesan Antar Farmasi' : ''}
                        </Text>
                        <Text className="subtitle" scale="content" style={{ wordBreak: 'break-all' }}>
                          {name || '-'}
                        </Text>
                        <span className="divider" />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          {tag === 'baymax' && (
                            <Text className={`color-${consultationStatusColor(state)} status`}>
                              {consultationStatusText(state)}
                            </Text>
                          )}
                          {isPrescriptionExist && showPrescriptionClaimFeature() && (
                            <Link onClick={() => viewEPrescription(id)} className="color-secondary status">
                              Lihat Resep
                            </Link>
                          )}
                          {tag === 'dexter' && (
                            <>
                              <Text
                                className={`${
                                  state === 'ORDER_DECLINED_BY_PHARMACY' ? 'color-danger' : 'color-success'
                                } status`}
                              >
                                {orderStatus[state]?.title}
                              </Text>
                              {showPharmacyFeature() && (
                                <Link
                                  onClick={() => viewPharmacyDeliveryOrderDetail(id)}
                                  className="color-secondary status"
                                >
                                  Lihat Status
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {isErrorMsg === '' && data && (data.length === 0 || Object.keys(data).length === 0) && (
            <div className="year-box">
              <div className="year-line"></div>
              <Text className="year-text">{new Date().getFullYear().toString()}</Text>
              <span className="year-line"></span>
            </div>
          )}
        </div>
      ) : (
        ''
      )}
      {isEmpty ? (
        <div className="text-center margin-largeB">
          <Text scale="content" className="text-center">
            Belum ada riwayat aktivitas.
          </Text>
        </div>
      ) : (
        ''
      )}
      <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
    </div>
  );
};
