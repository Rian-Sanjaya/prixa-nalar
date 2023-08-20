import React, { Fragment } from 'react';
import { Paragraph } from 'prixa-design-kit/dist';
import '../statuslist/statuslist.scss';
import { IconHabitHistory } from './IconHabitHistory';
import { IconChronicDiseases } from './IconChronicDiseases';
import { IconPregnancy } from './IconPregnancy';

interface IconStatusType {
  isActive?: boolean;
  src: string;
  alt: string;
  style?: object;
  styleImg?: any;
  className?: string;
}

export const IconStatus = ({ isActive, src, alt, styleImg, style, className }: IconStatusType): JSX.Element => (
  <div className={`prixa-status-icon ${isActive ? 'active' : ''} ${className || ''}`} style={style}>
    <img
      alt={alt}
      src={src}
      height={styleImg && styleImg.height ? styleImg.height : '33px'}
      width="auto"
      style={styleImg}
    />
  </div>
);

const StatusList = (props: { statusListProps: any }): JSX.Element => {
  return (
    <Fragment>
      <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
        STATUS KESEHATAN & KEBIASAAN
      </Paragraph>

      <IconHabitHistory statusListProps={props.statusListProps} disabled={props.statusListProps.disableStatusList} />

      <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
        KONDISI KRONIS
      </Paragraph>

      <IconChronicDiseases statusListProps={props.statusListProps} disabled={props.statusListProps.disableStatusList} />

      {(props.statusListProps.showPregnancy || props.statusListProps.showMenopause) && (
        <Fragment>
          <Paragraph scale="pagesubtitle" className="prixa-status-category-title">
            KONDISI KEWANITAAN
          </Paragraph>

          <IconPregnancy statusListProps={props.statusListProps} disabled={props.statusListProps.disableStatusList} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default StatusList;
