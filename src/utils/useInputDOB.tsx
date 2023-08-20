import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import { Text, Dropdown, DropdownItem, InputText } from 'prixa-design-kit/dist';
import './useInputDOB.scss';

const monthOptions = [
  { value: 1, text: 'Januari' },
  { value: 2, text: 'Februari' },
  { value: 3, text: 'Maret' },
  { value: 4, text: 'April' },
  { value: 5, text: 'Mei' },
  { value: 6, text: 'Juni' },
  { value: 7, text: 'Juli' },
  { value: 8, text: 'Agustus' },
  { value: 9, text: 'September' },
  { value: 10, text: 'Oktober' },
  { value: 11, text: 'November' },
  { value: 12, text: 'Desember' },
];

export const useInputDOB = ({
  label,
}: {
  label: string;
}): {
  fullDate: string;
  input: JSX.Element;
  isValid: boolean;
  setDOfBirth: React.Dispatch<React.SetStateAction<string>>;
  setMOfBirth: React.Dispatch<React.SetStateAction<string>>;
  setYOfBirth: React.Dispatch<React.SetStateAction<string>>;
  setNameMOfBirth: React.Dispatch<React.SetStateAction<string | undefined>>;
  monthOptions: {
    value: number;
    text: string;
  }[];
} => {
  const [fullDate, setFullDate] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [dOfBirth, setDOfBirth] = useState<string>('');
  const [mOfBirth, setMOfBirth] = useState<string>('');
  const [yOfBirth, setYOfBirth] = useState<string>('');
  const [nameMOfBirth, setNameMOfBirth] = useState<string | undefined>('');

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (!dOfBirth || !mOfBirth || !yOfBirth) setIsValid(false);
    else if (parseInt(dOfBirth) < 1 || parseInt(dOfBirth) > 31) setIsValid(false);
    else if (yOfBirth.length < 4) setIsValid(false);
    else if (`${yOfBirth}${('0' + mOfBirth).slice(-2)}${('0' + dOfBirth).slice(-2)}` > moment().format('YYYYMMDD'))
      setIsValid(false);
    else if (mOfBirth) {
      let isValidDate;
      const february = ['02'];
      const date31List = ['01', '03', '05', '07', '08', '10', '12'];
      const date30List = ['04', '06', '09', '11'];
      const isDate30 = date30List.includes(String(mOfBirth));
      const isDate31 = date31List.includes(String(mOfBirth));
      const isFebruary = february.includes(String(mOfBirth));
      if (isDate30) {
        isValidDate = /^(0?[1-9]|[12][0-9]|3[00])$/.test(String(dOfBirth));
        isValidDate ? setIsValid(true) : setIsValid(false);
      } else if (isDate31) {
        isValidDate = /^(0?[1-9]|[12][0-9]|3[01])$/.test(String(dOfBirth));
        isValidDate ? setIsValid(true) : setIsValid(false);
      } else if (isFebruary) {
        const isLeapYear = Number(yOfBirth) % 100 === 0 ? Number(yOfBirth) % 400 === 0 : Number(yOfBirth) % 4 === 0;
        if (isLeapYear) {
          isValidDate = /^(0?[1-9]|[1][0-9]|[2][0-9])$/.test(String(dOfBirth));
          isValidDate ? setIsValid(true) : setIsValid(false);
        } else {
          isValidDate = /^(0?[1-9]|[1][0-9]|[2][0-8])$/.test(String(dOfBirth));
          isValidDate ? setIsValid(true) : setIsValid(false);
        }
      }
    }

    const day = ('0' + dOfBirth).slice(-2);
    const month = ('0' + mOfBirth).slice(-2);
    const year = yOfBirth;
    const fullDateFormatted = year + '-' + month + '-' + day;
    setFullDate(fullDateFormatted);
  }, [dOfBirth, mOfBirth, yOfBirth]);

  const handleDayChange = (value: string): void => {
    const regexp = /^[0-9\b]+$/;
    if (value === '' || regexp.test(value)) {
      setDOfBirth(value);
    }
  };

  const handleYearChange = (value: string): void => {
    const regexp = /^[0-9\b]+$/;
    if (value === '' || regexp.test(value)) {
      setYOfBirth(value);
    }
  };

  const handleMonthSelect = useCallback((month: DropdownItem) => {
    setMOfBirth(('0' + month.value).slice(-2));
    setNameMOfBirth(month.text);
  }, []);

  const input = (
    <>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ marginBottom: 10 }}>
            <Text scale="pageTitle">{label}</Text>
          </div>
          {!isValid && (
            <div>
              <Text scale="errorMessage">Data tidak valid</Text>
            </div>
          )}
        </div>
      )}
      <div className="useInputDOB-box" style={{ display: 'flex', marginBottom: 24 }}>
        <InputText
          data-cy="date"
          setData={(value: string): void => handleDayChange(value)}
          value={dOfBirth}
          maxLength={2}
          type="text"
          placeholder="Tanggal"
          style={{ flex: 1, flexBasis: '27.5%', width: 81, fontSize: '14px' }}
        />
        <Dropdown
          data-cy="month"
          options={monthOptions}
          placeholder="Bulan"
          onSelect={handleMonthSelect}
          value={nameMOfBirth}
          styleContainer={{ width: 117, margin: '0 8px 0' }}
          styleInput={{ fontSize: 14, height: 6 }}
          styleItems={{ fontSize: 13, maxHeight: 135, top: 36 }}
          styleIcon={{ top: 10, width: '0.7em' }}
        />
        <InputText
          data-cy="year"
          setData={(value: string): void => handleYearChange(value)}
          value={yOfBirth}
          maxLength={4}
          type="text"
          placeholder="Tahun"
          style={{ flex: 1, flexBasis: '27.5%', width: 81, fontSize: '14px' }}
        />
      </div>
    </>
  );

  return { fullDate, input, isValid, setDOfBirth, setMOfBirth, setYOfBirth, setNameMOfBirth, monthOptions };
};
