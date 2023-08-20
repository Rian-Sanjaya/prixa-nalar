import React from 'react';
import { Text } from 'prixa-design-kit/dist';
import { IconStatus } from './StatusList';

const statusHamil = `${process.env.REACT_APP_ASSET_URL}/status/Icon Hamil.png`;
const yesStatusHamil = `${process.env.REACT_APP_ASSET_URL}/status/Icon Hamil white.png`;
const statusMenopause = `${process.env.REACT_APP_ASSET_URL}/status/Icon Menopause.png`;
const yesStatusMenopause = `${process.env.REACT_APP_ASSET_URL}/status/Icon Menopause white.png`;

export const IconPregnancy = (props: { statusListProps: any; disabled?: boolean }) => {
  return (
    <div className="prixa-status">
      {!props.statusListProps.showPregnancy || (
        <div className="prixa-status-wrapper">
          <div
            onClick={() => {
              if (!props.disabled) props.statusListProps.setHamil(!props.statusListProps.hamil);
            }}
          >
            <IconStatus
              alt="Status Hamil"
              isActive={props.statusListProps.hamil}
              src={props.statusListProps.hamil ? yesStatusHamil : statusHamil}
            />
            <Text scale="content">
              <b>Hamil</b>
            </Text>
          </div>
        </div>
      )}

      {!props.statusListProps.showMenopause || (
        <div className="prixa-status-wrapper">
          <div
            onClick={() => {
              if (!props.disabled) props.statusListProps.setMenopause(!props.statusListProps.menopause);
            }}
          >
            <IconStatus
              alt="Status Menopause"
              isActive={props.statusListProps.menopause}
              src={props.statusListProps.menopause ? yesStatusMenopause : statusMenopause}
            />
            <Text scale="content">
              <b>Menopause</b>
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};
