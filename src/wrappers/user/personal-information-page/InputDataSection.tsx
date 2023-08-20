import React from 'react';
import { Dropdown } from 'prixa-design-kit/dist';

const jKel = [
  {
    text: 'Laki-laki',
    value: 'Laki-laki',
  },
  {
    text: 'Perempuan',
    value: 'Perempuan',
  },
];

const InputDataSection = ({
  name,
  editMode,
  errJenisKelamin,
  firstEditJKel,
  handleJKelSelect,
  kelText,
  validatJKel,
  address,
  phoneNumber,
}: any): JSX.Element => {
  return (
    <>
      <div className="margin-baseB" data-cy="data-diri-input-name">
        {name.input}
      </div>
      <div className="margin-baseB" data-cy="data-diri-input-jenis-kelamin">
        <div style={{ display: 'flex', marginBottom: 10 }}>
          <label
            style={{
              flex: 1,
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '24px',
              color: 'var(--dark)',
            }}
          >
            Jenis Kelamin
          </label>
          {editMode === true && errJenisKelamin && !firstEditJKel && (
            <label style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--alert-50)', paddingTop: 4 }}>
              Data tidak valid
            </label>
          )}
        </div>
        <Dropdown
          options={jKel}
          placeholder="Jenis Kelamin"
          onSelect={handleJKelSelect}
          value={kelText}
          disabled={editMode === false}
          error={editMode && errJenisKelamin && !firstEditJKel}
          validate={editMode && validatJKel && !firstEditJKel}
          styleInput={{ height: 6, fontSize: 16 }}
          styleIcon={{ top: 10, width: '0.7em' }}
          styleItems={{ fontSize: 15, top: 36 }}
          data-cy="data-diri-dropdown-jenis-kelamin"
        />
      </div>
      <div className="margin-baseB" data-cy="data-diri-input-alamat">
        {address.input}
      </div>
      <div className="margin-baseB" data-cy="data-diri-input-nomor-telepon">
        {phoneNumber.input}
      </div>
    </>
  );
};

export default InputDataSection;
