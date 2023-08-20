import React from 'react';
import { Paragraph } from 'prixa-design-kit/dist';

const TnCSideSheet = (props: any) => {
  return (
    <div className="prixa-container is-top is-half padding-largeX">
      <Paragraph scale="content">{props.content}</Paragraph>
    </div>
  );
};

export default TnCSideSheet;
