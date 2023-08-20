import React, { useEffect, Fragment } from 'react';
import { Paragraph, Card, Text } from 'prixa-design-kit/dist';
import { getAPI } from '../../api/api-method';
import { DIAGNOSTIC_API } from '../../api/api-url';
import Skeleton from 'react-loading-skeleton';
import { ContentCardType } from './IntroType';

const IntroAction: React.FC = () => {
  const [contentCovid, setContentCovid] = React.useState([]);
  const storageSessionId = localStorage.getItem('sesId');

  /* eslint-disable */
  useEffect(() => {
    if (!storageSessionId) {
      getAPI(DIAGNOSTIC_API.ALL_CONTENT).then((res: any) => {
        const tempCovid = res.contentCard && res.contentCard.filter((covid: ContentCardType) => covid.type === 'covid');
        tempCovid && tempCovid.sort((a: any, b: any) => (a.sort > b.sort ? 1 : -1));
        setContentCovid(tempCovid || []);
      });
    }
  }, []);
  /* eslint-enable */

  return (
    <div>
      <section id="last-section" className="margin-largeB">
        <Paragraph
          scale="heroTitle"
          className="text-center"
          fontSize="24px"
          lineHeight="28px"
          style={{ width: '275px', margin: 'auto auto 40px' }}
        >
          Ketahui Tindakan Terkait COVID-19
        </Paragraph>
        {contentCovid.length > 0 ? (
          contentCovid.map((data: ContentCardType) => (
            <Card style={{ display: 'flex', margin: '0px 24px 24px' }} key={data.id} className="padding-base">
              <div className="text-center margin-baseB" style={{ height: '100%', margin: 'auto 24px auto 0px' }}>
                <img loading="lazy" alt="Covid landing" src={data.imageURL} style={{ width: '80px', height: 'auto' }} />
              </div>
              <div style={{ width: '100%' }}>
                <Paragraph scale="headerTitle" className="text-left" margin="0px 0px 5px">
                  {data.title || '-'}
                </Paragraph>
                <Paragraph className="text-left" margin="0px 0px 12px">
                  {data.snippet || '-'}
                </Paragraph>
                <a
                  href="/notfound"
                  onClick={() => (window.location.href = data.externalLink || '')}
                  style={{ float: 'right' }}
                  target="_blank"
                >
                  <Text scale="feedbackLink2">Baca Selengkapnya</Text>
                </a>
              </div>
            </Card>
          ))
        ) : (
          <CovidSectionSkeleton />
        )}
      </section>
    </div>
  );
};

const CovidSectionSkeleton = () => {
  return (
    <Fragment>
      {(() => {
        const cards = [];
        for (let cardLoops = 1; cardLoops <= 3; cardLoops++) {
          cards.push(
            <Card style={{ display: 'flex', margin: '0px 24px 24px' }} className="padding-base" key={cardLoops}>
              <div
                style={{
                  height: '60',
                  margin: 'auto 24px auto 0px',
                  width: '60',
                  paddingBottom: '10px',
                  paddingLeft: '30px',
                }}
              >
                <Skeleton circle height={60} width={60} />
              </div>
              <div style={{ height: '125px', width: '100%', paddingLeft: '15px', marginTop: '20px' }}>
                <Skeleton width={130} />
                <br />
                <Skeleton width={150} />
                <br />
                <Skeleton width={140} />
                <br />
                <Skeleton width={150} />
                <br />
                <div style={{ marginTop: '20px', paddingLeft: '30px' }}>
                  <Skeleton width={120} />
                </div>
              </div>
            </Card>,
          );
        }
        return cards;
      })()}
    </Fragment>
  );
};

export default IntroAction;
