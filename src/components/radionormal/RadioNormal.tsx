import React from 'react';
import './radioNormal.scss';

interface RadioNormalType {
  text: string;
  value: any;
  name: string;
  onChange: (value: any) => void;
  selected?: boolean;
}

export const RadioNormal = ({ name, text, value, onChange, selected }: RadioNormalType) => {
  return (
    <div className={`prixa-radio-normal ${selected ? 'checked' : ''}`} onClick={onChange}>
      <input
        type="radio"
        className="prixa-radio-normal-input"
        name={name}
        checked={selected}
        value={value}
        onChange={onChange}
      />
      <label className="prixa-radio-normal-label" key={value}>
        {text}
      </label>
    </div>
  );
};
