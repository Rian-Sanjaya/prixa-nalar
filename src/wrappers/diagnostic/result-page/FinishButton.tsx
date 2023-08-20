import React from 'react';
import { Button } from 'prixa-design-kit/dist';
import { UseTracking } from '../../../utils/useTracking';
import { currentState } from '../../../api/api-utils';
import { resetConversation } from '../../../utils/constant';

const Finish = ({ sessionId }: any): JSX.Element => {
  return (
    <span
      onClick={() => {
        UseTracking({ event: `Finish clicked`, properties: { sessionId, state: currentState } });
        resetConversation();
        window.location.replace('/');
      }}
    >
      <Button size="full" variant="primary" data-cy="result-finish-button">
        Selesai
      </Button>
    </span>
  );
};

export default Finish;
