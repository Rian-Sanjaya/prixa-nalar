import React from 'react';
import { Paragraph } from 'prixa-design-kit/dist';

const QuestionSideSheet = (props: any) => {
  return (
    <div className="prixa-container is-top is-half">
      <Paragraph scale="content">{props.content}</Paragraph>
    </div>
  );
};

export default QuestionSideSheet;
