import React from 'react';
import { Text } from 'prixa-design-kit/dist';
import { IconStatus } from './StatusList';

const statusKanker = `${process.env.REACT_APP_ASSET_URL}/status/Icon Kanker.png`;
const statusSakitJantung = `${process.env.REACT_APP_ASSET_URL}/status/Icon Gangguan Jantung.png`;
const statusGagalGinjal = `${process.env.REACT_APP_ASSET_URL}/status/Icon Gangguan Ginjal.png`;
const yesStatusKanker = `${process.env.REACT_APP_ASSET_URL}/status/Icon Kanker white.png`;
const yesStatusSakitJantung = `${process.env.REACT_APP_ASSET_URL}/status/Icon Gangguan Jantung white.png`;
const yesStatusGagalGinjal = `${process.env.REACT_APP_ASSET_URL}/status/Icon Gagal Ginjal white.png`;

export const IconChronicDiseases = (props: { statusListProps: any; disabled?: boolean }) => {
  return (
    <div className="prixa-status">
      <div className="prixa-status-wrapper">
        <div
          onClick={() => {
            if (!props.disabled) props.statusListProps.setKanker(!props.statusListProps.kanker);
          }}
        >
          <IconStatus
            alt="Status Kanker"
            isActive={props.statusListProps.kanker}
            src={props.statusListProps.kanker ? yesStatusKanker : statusKanker}
          />
          <Text scale="content">
            <b>Kanker</b>
          </Text>
        </div>
      </div>
      <div className="prixa-status-wrapper">
        <div
          onClick={() => {
            if (!props.disabled) props.statusListProps.setSakitJantung(!props.statusListProps.sakitJantung);
          }}
        >
          <IconStatus
            alt="Status Gangguan Jantung"
            isActive={props.statusListProps.sakitJantung}
            src={props.statusListProps.sakitJantung ? yesStatusSakitJantung : statusSakitJantung}
          />
          <Text scale="content">
            <b>
              Gangguan
              <br />
              Jantung
            </b>
          </Text>
        </div>
      </div>
      <div className="prixa-status-wrapper">
        <div
          onClick={() => {
            if (!props.disabled) props.statusListProps.setGagalGinjal(!props.statusListProps.gagalGinjal);
          }}
        >
          <IconStatus
            alt="Status Gagal Ginjal"
            isActive={props.statusListProps.gagalGinjal}
            src={props.statusListProps.gagalGinjal ? yesStatusGagalGinjal : statusGagalGinjal}
          />
          <Text scale="content">
            <b>
              Gagal
              <br />
              Ginjal
            </b>
          </Text>
        </div>
      </div>
    </div>
  );
};
