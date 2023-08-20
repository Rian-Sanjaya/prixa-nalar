import React from 'react';
import { Spinner, Text } from 'prixa-design-kit/dist';

interface LoadProps {
  text?: string;
}

export const LoadPage = (props: LoadProps) => {
  return (
    <div className="prixa-container is-middle is-full is-center">
      {!props.text ? (
        <Spinner className="margin-smallB" />
      ) : (
        <div>
          <Spinner className="margin-smallB" />
          <br />
          <Text scale="caption">{props.text}</Text>
        </div>
      )}
    </div>
  );
};
