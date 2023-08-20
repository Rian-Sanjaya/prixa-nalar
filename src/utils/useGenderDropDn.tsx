import React, { useState } from 'react';
import Select from 'react-select';
import { Text } from 'prixa-design-kit/dist';

export const useGenderDropDn = ({ label }: any) => {
  const [value, setValue] = useState('');

  const jKel = [
    {
      value: 'Laki-laki',
      label: 'Laki-laki',
    },
    {
      value: 'Perempuan',
      label: 'Perempuan',
    },
  ];

  const colourStyles = {
    control: (styles: any, state: any) => {
      return {
        ...styles,
        marginTop: '10px',
        '&:hover': { border: '2px solid var(--primary)', marginTop: '8px' },
      };
    },
  };

  const dropDn = (
    <>
      <div>
        <Text scale="pageTitle">{label}</Text>
      </div>
      <div className="prixa-gender-dropdn">
        <Select
          options={jKel}
          placeholder="Jenis Kelamin"
          onChange={(data: any) => setValue(data.value)}
          value={jKel.filter(kel => kel.value === value)}
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'var(--primary)',
            },
          })}
          styles={colourStyles}
        />
      </div>
    </>
  );

  return { dropDn, value, setValue };
};
