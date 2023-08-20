import React from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Button, IconSolid, Card } from 'prixa-design-kit/dist';
import { classifyIconColor, classifyTextColor } from './constant';
import { UseTracking } from '../../../utils/useTracking';
import { sessionId, currentState } from '../../../api/api-utils';

const ResultList = ({ convertedDisease }: any) => {
  const history = useHistory();

  const viewArticle = (id: string, name: string, url: string) => {
    history.push({
      pathname: `/article/${id}`,
    });
  };

  const diseaseDescription = (description: string) => {
    return (
      description && (
        <div className="prixa-list-subtitle prixa-disease-short-description">
          <Text scale="content">{description}</Text>
        </div>
      )
    );
  };

  const diseaseArticleSection = (disease: any) => {
    return (
      disease.article !== '#' && (
        <span className="prixa-list-button">
          <Button
            onClick={() => {
              const diseaseTrack = {
                diseaseId: disease.id,
                diseaseName: disease.name,
                diseaseScore: String(disease.score),
                diseaseTriage: String(disease.triage),
              };
              UseTracking({
                event: `Article ${disease.name} clicked`,
                properties: { sessionId, state: currentState, ...diseaseTrack },
              });
              viewArticle(disease.id, disease.name, disease.article);
            }}
            size="small"
            className="dav-special"
            variant="outline"
          >
            Lebih Lanjut
          </Button>
        </span>
      )
    );
  };

  const resultListSection = convertedDisease.map((disease: any, i: number) => {
    return (
      <Card key={i} style={{ padding: '16px', margin: '20px 40px' }}>
        <div className="prixa-list-title">
          <Text scale="question">{disease.name}</Text>
        </div>
        {diseaseDescription(disease.description)}
        <div>
          <div className="prixa-disease-advance-info margin-smallT">
            <IconSolid
              backgroundColor={classifyIconColor[disease.classify]}
              backgroundSize="18px"
              color="white"
              margin="0px"
              type="percentage"
              width="8px"
              style={{ alignItems: 'center' }}
            >
              <Text
                className="margin-microL"
                style={{ lineHeight: '17px' }}
                scale={classifyTextColor[disease.classify]}
              >
                {disease.evidenceLevel}
              </Text>
            </IconSolid>
          </div>

          <div className="prixa-disease-advance-info">
            <IconSolid
              backgroundColor={'danger'}
              backgroundSize="18px"
              color="white"
              margin="0px"
              type="exclamation"
              width="4px"
              style={{ alignItems: 'center' }}
            >
              <Text className="margin-microL" style={{ lineHeight: '17px', flex: 1 }} scale={'headerSubtitle'}>
                {disease.prognosis || '-'}
              </Text>
            </IconSolid>
          </div>
        </div>
        {diseaseArticleSection(disease)}
      </Card>
    );
  });

  return <div className="prixa-list-container">{resultListSection}</div>;
};

export default ResultList;
