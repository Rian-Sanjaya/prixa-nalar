import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Card, Accordion } from 'prixa-design-kit/dist';
import CtaFeature from '../../components/cta-feature/CtaFeature';
import { showUserManagement } from '../../utils/constant';
import { getAPI } from '../../api/api-method';
import { DIAGNOSTIC_API } from '../../api/api-url';
import { HeaderContext } from '../../components/header/HeaderContext';
import Skeleton from 'react-loading-skeleton';

export interface ArticleType {
  id: string;
  diseaseName: string;
  diseaseNameIndo: string;
  author: string;
  checkedBy: string;
  overview: string;
  advice: any;
  seeDoctor: string;
  howToPrevent: string;
  reference: string;
  relatedSymptom: Array<string>;
  nonMedicalTreatment?: string;
  medicalTreatment?: string;
  supportingLabs?: string;
  url: string;
  isValidForRDT?: boolean;
}

const ArticlePage = () => {
  const [article, setArticle] = React.useState<ArticleType | undefined>(undefined);

  const articleId: any = useParams();
  const { setHeader } = useContext(HeaderContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAPI(DIAGNOSTIC_API.DISEASE_ARTICLE(articleId.id)).then(async (res: any) => {
      const articleData = { ...res };
      setHeader(res.diseaseNameIndo);
      setArticle(articleData);
    });
  }, [articleId.id, setHeader]);

  return (
    <React.Fragment>
      <div className="prixa-container is-top">
        <Card className="text-center">
          <Text scale="caption">
            <Text fontSize="12px">
              {article?.author ? (
                <span>
                  Ditulis oleh <b>{article?.author}</b>
                </span>
              ) : (
                <Skeleton />
              )}
              <br />
              {article?.checkedBy ? (
                <span>
                  Diperiksa oleh <b>{article?.checkedBy}</b>
                </span>
              ) : (
                <Skeleton />
              )}
            </Text>
          </Text>
        </Card>

        <div className="margin-largeT">
          <Text scale="question">Apakah kondisi ini?</Text>
        </div>
        <div className="margin-baseY">
          <Text scale="content">
            {article?.overview ? (
              article?.overview.split('\n').map((item: any, key: number) => {
                return (
                  <React.Fragment key={key}>
                    {item}
                    <br />
                  </React.Fragment>
                );
              })
            ) : (
              <>
                <Skeleton count={6} />
                <Skeleton width="50%" />
              </>
            )}
          </Text>
        </div>

        <Accordion title={'Keluhan/gejala yg biasa muncul:'} className="margin-baseY">
          <ul style={{ margin: 0, paddingLeft: 'inherit' }}>
            {article?.relatedSymptom.map((symptom: string, i: number) => {
              return (
                <li key={i}>
                  <Text scale="content">{symptom}</Text>
                </li>
              );
            })}
          </ul>
        </Accordion>

        <div className="margin-largeT">
          <Text scale="question">Apa yang bisa dilakukan?</Text>
        </div>

        <div className="margin-baseY">
          <Text scale="content">
            {article?.howToPrevent ? (
              article?.howToPrevent.split('\n').map((item: any, key: number) => {
                return (
                  <React.Fragment key={key}>
                    {item}
                    <br />
                  </React.Fragment>
                );
              })
            ) : (
              <>
                <Skeleton count={6} />
                <Skeleton width="50%" />
              </>
            )}
          </Text>
        </div>

        {article?.nonMedicalTreatment && (
          <Accordion title={'Penanganan tanpa obat:'} className="margin-baseY">
            {article?.nonMedicalTreatment.split('\n').map((item: string, i: number) =>
              item.match(/^\d/) ? (
                <ul key={i} style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>
                    <Text scale="content">{item.substring(item.indexOf('.') + 1)}</Text>
                  </li>
                </ul>
              ) : item !== '' ? (
                <div key={i} className="margin-tinyY">
                  <Text scale="content">{item}</Text>
                  <br />
                </div>
              ) : null,
            )}
          </Accordion>
        )}

        {article?.medicalTreatment && (
          <Accordion title={'Penanganan menggunakan obat:'} className="margin-baseY">
            {article?.medicalTreatment.split('\n').map((item: string, i: number) =>
              item.match(/^\d/) ? (
                <ul key={i} style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>
                    <Text scale="content">{item.substring(item.indexOf('.') + 1)}</Text>
                  </li>
                </ul>
              ) : item !== '' ? (
                <div key={i} className="margin-tinyY">
                  <Text scale="content">{item}</Text>
                  <br />
                </div>
              ) : null,
            )}
          </Accordion>
        )}

        {article?.supportingLabs && (
          <Accordion title={'Pemeriksaan tambahan:'} className="margin-baseY">
            {article?.supportingLabs.split('\n').map((item: string, i: number) =>
              item.match(/^\d/) ? (
                <ul key={i} style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>
                    <Text scale="content">{item.substring(item.indexOf('.') + 1)}</Text>
                  </li>
                </ul>
              ) : item !== '' ? (
                <div key={i} className="margin-tinyY">
                  <Text scale="content">{item}</Text>
                  <br />
                </div>
              ) : null,
            )}
          </Accordion>
        )}

        <div className="margin-largeT">
          <Text scale="question">Kapan perlu ke dokter?</Text>
        </div>

        <div className="margin-baseY">
          {article?.seeDoctor ? (
            article?.seeDoctor.split('\n').map((item: any, key: number) =>
              item.match(/^\d/) ? (
                <ul key={key} style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>
                    <Text scale="content">{item.substring(item.indexOf('.') + 1)}</Text>
                  </li>
                </ul>
              ) : item !== '' ? (
                <div key={key} className="margin-tinyY">
                  <Text scale="content">{item}</Text>
                  <br />
                </div>
              ) : null,
            )
          ) : (
            <>
              <Skeleton count={3} />
              <Skeleton width="50%" />
            </>
          )}
        </div>

        <Card className="text-center margin-largeT">
          <div className="margin-tinyB">
            <Text scale="headerSubtitle" fontSize="14px">
              Referensi
            </Text>
          </div>
          <Text scale="caption">
            {article?.reference
              ? article?.reference.split('\n').map((item: any, key: number) => {
                  return (
                    <Text style={{ wordBreak: 'break-word' }} key={key} fontSize="12px">
                      {item}
                      <br />
                    </Text>
                  );
                })
              : '-'}
          </Text>
        </Card>
        {showUserManagement() ? (
          <div className="margin-largeY">
            <CtaFeature />
          </div>
        ) : (
          <span />
        )}
      </div>
    </React.Fragment>
  );
};

export default ArticlePage;
