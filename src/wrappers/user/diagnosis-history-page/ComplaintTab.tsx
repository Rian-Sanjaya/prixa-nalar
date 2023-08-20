import React, { useEffect, useState, useRef } from 'react';
import { Text, Toast } from 'prixa-design-kit/dist';
import { getAPI } from '../../../api/api-method';
import { HISTORY_API } from '../../../api/api-url';
import { getYear, getMonth, getDate } from '../../../utils/constant';
import { LoadPage } from '../../../wrappers/diagnostic/LoadPage';

export const ComplaintTab = () => {
  interface AssessmentHistory {
    email: string;
    datetime: string;
    chiefComplaint: string;
    name: string;
    age: number;
    gender: string;
  }

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
    getAPI(HISTORY_API.ASSESMENT_HISTORY)
      .then((res: any) => {
        setError('');
        if (Object.keys(res).length > 0)
          setData(
            res.data
              .sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
              .reverse(),
          );
      })
      .catch(err => {
        if (err.response.data.detail) {
          setEmpty(true);
        } else setError('Gangguan sistem, mohon coba kembali.');
      });
  }, []);

  if (data.length < 1 && !isEmpty) return <LoadPage />;

  return (
    <div style={{ paddingTop: '60px' }} ref={containerHeightRef} className="prixa-container is-top wrapper">
      {!isEmpty ? (
        <div className="prixa-timeline">
          {data &&
            data.length > 0 &&
            data.map((item, i) => {
              const { datetime, chiefComplaint, name, age, gender } = item;
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
                          <div className="circle prixa-icon"></div>
                        </div>
                      </div>
                      <Text className="date">{`${dateDt}/${monthDt}`}</Text>
                    </div>
                    <div className="list">
                      <div className="prixa-flex-column">
                        <Text scale="pageTitle" className="title">
                          {chiefComplaint}
                        </Text>
                        <Text className="subtitle" scale="content" style={{ wordBreak: 'break-all' }}>{`${name}, ${
                          age > 1 ? age : 0
                        }, ${gender}`}</Text>
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
            Belum ada riwayat keluhan.
          </Text>
        </div>
      ) : (
        ''
      )}
      <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
    </div>
  );
};
