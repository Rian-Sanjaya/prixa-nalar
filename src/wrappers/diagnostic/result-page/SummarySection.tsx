import React from 'react';
import { Box } from 'prixa-design-kit/dist';

const SummarySection = ({ summaryMessage }: any): JSX.Element => {
  return (
    <Box
      bordered
      variant={summaryMessage.boxColor}
      className="margin-largeX margin-baseT margin-largeB"
      style={{ padding: '24px' }}
    >
      <div className={`text-center color-${summaryMessage.boxColor}`}>
        <span className="prixa-summary-message-title">{summaryMessage.titleSummary}</span>
        <p className="prixa-summary-message-detail">{summaryMessage.detailSummary}</p>
      </div>
    </Box>
  );
};

export default SummarySection;
