import React from 'react';
import { Button } from 'prixa-design-kit/dist';
import { UseTracking } from '../../../utils/useTracking';
import { currentState } from '../../../api/api-utils';
import { showTelemedFeature } from '../../../utils/constant';

const TelemedicineButton = ({ sessionId, boxColor }: any): JSX.Element => {
  return (
    <>
      {showTelemedFeature() && (
        <div className="margin-smallT">
          <a
            target={'_self'}
            rel="noopener noreferrer"
            href={
              localStorage.getItem('telemedicineSDKURL') === ''
                ? '/tnc'
                : `${localStorage.getItem('telemedicineSDKURL')}?sessionID=${sessionId}`
            }
            onClick={(): void => {
              UseTracking({
                event: `Konsultasi via Chat triage clicked`,
                properties: { sessionId, state: currentState },
              });
            }}
          >
            <Button
              color={boxColor === 'danger' ? 'var(--alert)' : 'var(--secondary)'}
              size="large"
              variant="outline"
              className="dav-special"
            >
              Konsultasi via Chat
            </Button>
          </a>
        </div>
      )}
    </>
  );
};

export default TelemedicineButton;
