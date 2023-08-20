import React, { Fragment, useState, useEffect, useRef } from 'react';
import { InputText, FormLabel } from 'prixa-design-kit/dist';
import Select from 'react-select';
import moment from 'moment';

export const useBirthDateInput = ({ label }: any) => {
  const [fullDate, setFullDate] = useState('');
  const [date, setDate] = useState('');
  const [errorDate, setErrorDate] = useState(false);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [errorYear, setErrorYear] = useState(false);

  const dateFormatted = ('0' + date).slice(-2);

  /* eslint-disable */
  const isFirstRunDate = useRef(true);
  useEffect(() => {
    if (isFirstRunDate.current) {
      isFirstRunDate.current = false;
      return;
    }

    let isValidDate;
    const february = ["02"];
    const date31List = ["01", "03", "05", "07", "08", "10", "12"];
    const date30List = ["04", "06", "09", "11"];
    const isDate30 = date30List.includes(month);
    const isDate31 = date31List.includes(month);
    const isFebruary = february.includes(month);
    if (isDate30) {
      isValidDate = /^(0?[1-9]|[12][0-9]|3[00])$/.test(String(date));
    }
    else if (isDate31) {
      isValidDate = /^(0?[1-9]|[12][0-9]|3[01])$/.test(String(date));
    }
    else if (isFebruary) {
      const isLeapYear = Number(year) % 100 === 0 ? Number(year) % 400 === 0 : Number(year) % 4 === 0;
      if (isLeapYear) {
        isValidDate = /^(0?[1-9]|[1][0-9]|[2][0-9])$/.test(String(date));
      }
      else {
        isValidDate = /^(0?[1-9]|[1][0-9]|[2][0-8])$/.test(String(date));
      }
    }

    isValidDate ? setErrorDate(false) : setErrorDate(true);

    const fullDateFormatted = year + '-' + month + '-' + dateFormatted;
    setFullDate(fullDateFormatted);
  }, [date, month, year]);

  const isFirstRunMonth = useRef(true);
  useEffect(() => {
    if (isFirstRunDate.current) {
      isFirstRunDate.current = false;
      return;
    }

    const fullDateFormatted = year + '-' + month + '-' + dateFormatted;
    setFullDate(fullDateFormatted);
  }, [month]);

  const isFirstRunYear = useRef(true);
  useEffect(() => {
    if (isFirstRunYear.current) {
      isFirstRunYear.current = false;
      return;
    }

    const isValidYear = year + month + dateFormatted < moment().format('YYYYMMDD') && Number(year) > 1900;
    isValidYear ? setErrorYear(false) : setErrorYear(true);

    const fullDateFormatted = year + '-' + month + '-' + dateFormatted;
    setFullDate(fullDateFormatted);
  }, [date, month, year]);
  /* eslint-enable */

  const monthList = [
    {
      value: '01',
      label: 'Januari',
    },
    {
      value: '02',
      label: 'Februari',
    },
    {
      value: '03',
      label: 'Maret',
    },
    {
      value: '04',
      label: 'April',
    },
    {
      value: '05',
      label: 'Mei',
    },
    {
      value: '06',
      label: 'Juni',
    },
    {
      value: '07',
      label: 'Juli',
    },
    {
      value: '08',
      label: 'Agustus',
    },
    {
      value: '09',
      label: 'September',
    },
    {
      value: '10',
      label: 'Oktober',
    },
    {
      value: '11',
      label: 'November',
    },
    {
      value: '12',
      label: 'Desember',
    },
  ];

  const input = (
    <Fragment>
      <FormLabel errors={false}>{label}</FormLabel>
      <div className="prixa-dropdown-input-picker" data-cy="date-input">
        <Select
          maxMenuHeight={200}
          options={monthList}
          placeholder="Bulan"
          onChange={(data: any) => setMonth(data.value)}
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'var(--primary)',
            },
          })}
          value={monthList[Number(month) - 1]}
        />
        <InputText errors={errorDate} placeholder="Tanggal" setData={setDate} small type="text" value={date || ''} />
        <InputText errors={errorYear} placeholder="Tahun" setData={setYear} small type="text" value={year || ''} />
      </div>
    </Fragment>
  );

  return { fullDate, setFullDate, setDate, errorDate, setMonth, setYear, errorYear, input };
};
