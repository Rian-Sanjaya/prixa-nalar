import React from 'react';
import { Paragraph } from 'prixa-design-kit/dist';

interface StatusSideSheetProps {
  isCanPregnant?: boolean;
  isCanMenopause?: boolean;
  isCanDrinkAndSmoke: boolean;
  isFemale: {};
  data: Array<Record<string, any>>;
  showMenopause?: boolean | '' | undefined;
  showPregnancy?: boolean | '' | undefined;
}

interface StatusExplanationProps {
  preconditionsDescription: string;
  preconditionsDescriptionCopy: string;
}

const StatusSideSheet = ({
  isFemale,
  isCanPregnant,
  isCanMenopause,
  isCanDrinkAndSmoke,
  data,
  showMenopause,
  showPregnancy,
}: StatusSideSheetProps): JSX.Element => {
  return (
    <div className="prixa-container is-top padding-largeX">
      {data.map((item: any) => {
        const isSmokerOrDrinker = item.name === 'Smoker' || item.name === 'Alcohol drinker';
        if (isSmokerOrDrinker) {
          if (isCanDrinkAndSmoke) {
            return (
              <StatusExplanation
                key={item.id}
                preconditionsDescription={item.preconditionsDescription}
                preconditionsDescriptionCopy={item.preconditionsDescriptionCopy}
              />
            );
          } else return null;
        } else {
          if (item.name === 'Menopause' || item.name === 'Pregnant') {
            if (isFemale) {
              if (item.name === 'Pregnant' && (isCanPregnant || showPregnancy)) {
                return (
                  <StatusExplanation
                    key={item.id}
                    preconditionsDescription={item.preconditionsDescription}
                    preconditionsDescriptionCopy={item.preconditionsDescriptionCopy}
                  />
                );
              } else if (item.name === 'Menopause' && (isCanMenopause || showMenopause)) {
                return (
                  <StatusExplanation
                    key={item.id}
                    preconditionsDescription={item.preconditionsDescription}
                    preconditionsDescriptionCopy={item.preconditionsDescriptionCopy}
                  />
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          } else {
            return (
              <StatusExplanation
                key={item.id}
                preconditionsDescription={item.preconditionsDescription}
                preconditionsDescriptionCopy={item.preconditionsDescriptionCopy}
              />
            );
          }
        }
      })}
    </div>
  );
};

const StatusExplanation = ({
  preconditionsDescription,
  preconditionsDescriptionCopy,
}: StatusExplanationProps): JSX.Element => {
  return (
    <div className="margin-baseB">
      <Paragraph scale="pageTitle">{preconditionsDescription}</Paragraph>
      <Paragraph scale="content">{preconditionsDescriptionCopy}</Paragraph>
    </div>
  );
};

export default StatusSideSheet;
