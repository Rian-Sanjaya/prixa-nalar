import React from 'react';
import { Icon, Text, Button } from 'prixa-design-kit/dist';
import { resetConversation } from '../../utils/constant';
import { UseTracking } from '../../utils/useTracking';
import { sessionId, currentState } from '../../api/api-utils';

interface ErrorProps {
  text?: string;
  goTo?: string;
  goToString?: string;
}

export const ErrorPage = (props: ErrorProps): JSX.Element => {
  resetConversation();

  return (
    <div className="prixa-container is-middle is-full is-center">
      {!props.text ? (
        <Icon color="danger" type="exclamation" style={{ fontSize: '36px', margin: '35vh auto' }} />
      ) : (
        <div style={{ width: '70%', textAlign: 'center', margin: '31vh auto' }}>
          <Icon color="danger" type="exclamation" style={{ fontSize: '36px', margin: 'auto' }} />
          <br />
          <Text scale="errorMessage">{props.text}</Text>
          <br />
          {props.goTo ? (
            <Button
              href={props.goTo}
              size="large"
              variant="primary"
              className="margin-largeT"
              onClick={(): void => {
                if (props.goToString === 'Prixa Sekarang') {
                  UseTracking({ event: `Prixa Sekarang clicked`, properties: { sessionId, state: currentState } });
                  resetConversation();
                } else if (props.goToString === 'Prixa Gejala') {
                  resetConversation();
                }
              }}
            >
              {props.goToString || 'Ke Halaman Utama'}
            </Button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
};
