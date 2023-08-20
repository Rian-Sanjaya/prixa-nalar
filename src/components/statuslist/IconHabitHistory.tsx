import React from 'react';
import { Text } from 'prixa-design-kit/dist';
import { IconStatus } from './StatusList';

const statusDarahTinggi = `${process.env.REACT_APP_ASSET_URL}/status/Icon Darah Tinggi.png`;
const statusDiabetes = `${process.env.REACT_APP_ASSET_URL}/status/Icon Diabetes.png`;
const statusMerokok = `${process.env.REACT_APP_ASSET_URL}/status/Icon Merokok.png`;
const statusMinumAlkohol = `${process.env.REACT_APP_ASSET_URL}/status/Icon Alcohol.png`;
const yesStatusDarahTinggi = `${process.env.REACT_APP_ASSET_URL}/status/Icon Darah Tinggi white.png`;
const yesStatusDiabetes = `${process.env.REACT_APP_ASSET_URL}/status/Icon Diabetes white.png`;
const yesStatusMerokok = `${process.env.REACT_APP_ASSET_URL}/status/Icon Merokok white.png`;
const yesStatusMinumAlkohol = `${process.env.REACT_APP_ASSET_URL}/status/Icon Alcohol white.png`;

export const IconHabitHistory = (props: { statusListProps: any; disabled?: boolean }) => {
  return (
    <div className="prixa-status">
      <div className="prixa-status-wrapper">
        <div
          onClick={() => {
            if (!props.disabled) props.statusListProps.setDarahTinggi(!props.statusListProps.darahTinggi);
          }}
        >
          <IconStatus
            alt="Status Darah Tinggi"
            isActive={props.statusListProps.darahTinggi}
            src={props.statusListProps.darahTinggi ? yesStatusDarahTinggi : statusDarahTinggi}
          />
          <Text scale="content">
            <b>
              Darah
              <br />
              Tinggi
            </b>
          </Text>
        </div>
      </div>
      <div className="prixa-status-wrapper">
        <div
          onClick={() => {
            if (!props.disabled) props.statusListProps.setDiabetes(!props.statusListProps.diabetes);
          }}
        >
          <IconStatus
            alt="Status Diabetes"
            isActive={props.statusListProps.diabetes}
            src={props.statusListProps.diabetes ? yesStatusDiabetes : statusDiabetes}
          />
          <Text scale="content">
            <b>Diabetes</b>
          </Text>
        </div>
      </div>

      {!props.statusListProps.showDrinkAndSmoke || (
        <React.Fragment>
          <div className="prixa-status-wrapper">
            <div
              onClick={() => {
                if (!props.disabled) props.statusListProps.setMerokok(!props.statusListProps.merokok);
              }}
            >
              <IconStatus
                alt="Status Merokok"
                isActive={props.statusListProps.merokok}
                src={props.statusListProps.merokok ? yesStatusMerokok : statusMerokok}
                className="merokok"
              />
              <Text scale="content">
                <b>Merokok</b>
              </Text>
            </div>
          </div>
          <div className="prixa-status-wrapper">
            <div
              onClick={() => {
                if (!props.disabled) props.statusListProps.setMinumAlkohol(!props.statusListProps.minumAlkohol);
              }}
            >
              <IconStatus
                alt="Status Minum Alkohol"
                isActive={props.statusListProps.minumAlkohol}
                src={props.statusListProps.minumAlkohol ? yesStatusMinumAlkohol : statusMinumAlkohol}
                className="alkohol"
              />
              <Text scale="content">
                <b>
                  Minum
                  <br />
                  Alkohol
                </b>
              </Text>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
