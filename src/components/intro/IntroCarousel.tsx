import React, { useEffect, Fragment } from 'react';
import { Paragraph, Box, Card } from 'prixa-design-kit/dist';
import { getAPI } from '../../api/api-method';
import { DIAGNOSTIC_API } from '../../api/api-url';
import Skeleton from 'react-loading-skeleton';
import { ContentCardType } from './IntroType';

const IntroCarousel: React.FC = () => {
  const [contentPrixa, setContentPrixa] = React.useState([]);
  const storageSessionId = localStorage.getItem('sesId');

  /* eslint-disable */
  useEffect(() => {
    if (!storageSessionId) {
      getAPI(DIAGNOSTIC_API.ALL_CONTENT).then((res: any) => {
        const tempPrixa = res.contentCard && res.contentCard.filter((prixa: ContentCardType) => prixa.type === 'prixa');
        tempPrixa && tempPrixa.sort((a: any, b: any) => (a.sort > b.sort ? 1 : -1));
        setContentPrixa(tempPrixa || []);
      });
    }
  }, []);
  /* eslint-enable */

  return (
    <div>
      <Box
        variant="default"
        id="second-section"
        style={{ borderRadius: '0', width: '100%', padding: '40px 0px', marginBottom: '40px' }}
      >
        <Paragraph scale="heroTitle" className="text-center" color="light" fontSize="24px" lineHeight="28px">
          Kenapa Prixa?
        </Paragraph>
        <div className="padding-tinyX flex-inline scrollbar">
          {contentPrixa.length > 0 ? (
            contentPrixa.map((data: ContentCardType) => (
              <Card style={{ width: '220px', margin: '0 4px' }} key={data.id}>
                <div className="text-center margin-baseB" style={{ width: '100%' }}>
                  <img
                    loading="lazy"
                    alt="Covid landing"
                    src={data.imageURL}
                    style={{ width: '192px', height: '160px' }}
                  />
                </div>
                <Paragraph scale="headerTitle" className="text-left" style={{ maxWidth: '140px' }}>
                  {data.title || '-'}
                </Paragraph>
              </Card>
            ))
          ) : (
            <PrixaSectionSkeleton />
          )}
        </div>
      </Box>
    </div>
  );
};

const PrixaSectionSkeleton = () => {
  return (
    <Fragment>
      {(() => {
        const cards = [];
        for (let cardLoops = 1; cardLoops <= 5; cardLoops++) {
          cards.push(
            <Card style={{ width: '220px', margin: '0 4px' }} key={cardLoops}>
              <Skeleton height={160} width={192} />
              <br />
              <br />
              <div className="margin-baseB" style={{ width: '100%' }}>
                <Skeleton width={150} />
                <br />
                <Skeleton width={130} />
                <br />
                <Skeleton width={150} />
                <br />
                <Skeleton width={140} />
              </div>
            </Card>,
          );
        }
        return cards;
      })()}
    </Fragment>
  );
};

export default IntroCarousel;
