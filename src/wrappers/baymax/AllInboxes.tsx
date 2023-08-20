import React, { useEffect, useContext, useState } from 'react';
import { Image, Button } from 'prixa-design-kit/dist';
import { getAPI } from '../../api/api-method';
import { BAYMAX_API } from '../../api/api-url';
import { LoadPage } from '../diagnostic/LoadPage';
import { ErrorPage } from '../../wrappers/diagnostic/ErrorPage';
import { HeaderContext } from '../../components/header/HeaderContext';
import { InboxType } from './InboxPicker';
import { useHistory } from 'react-router-dom';

const baseIconURL = `${process.env.REACT_APP_ASSET_URL}/Appointment Booking/`;

export const AllSpecialitySideSheet = (): JSX.Element => {
  const [error, setError] = useState('');
  const { setHeader, setMenu } = useContext(HeaderContext);
  const [specialityId, setSpecialityId] = useState('');
  // eslint-disable-next-line
  const [specialityName, setSpecialityName] = useState('');
  const [websiteTokenValue, setWebsiteTokenValue] = React.useState<string | undefined>('');
  const [allInbox, setAllInbox] = useState<Array<InboxType> | undefined>(undefined);
  const history = useHistory();

  useEffect(() => {
    setHeader('Spesialisasi');
    setMenu(false);

    if (!allInbox)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise.all([getAPI(BAYMAX_API.INBOXES)]).then((allResp: any) => {
        if (allResp && allResp.length > 0 && allResp[0].data) {
          const merge = allResp[0].data;
          setAllInbox(merge);
        } else {
          setError('Maaf, ada kesalahan dari kami');
        }
      });
  }, [allInbox, setAllInbox, setHeader, setMenu]);

  const clickedSpecialities = (id: string, name: string, websiteToken: string): void => {
    setSpecialityId(id);
    setSpecialityName(name);
    setWebsiteTokenValue(websiteToken);
  };

  const startConversation = (): void => {
    localStorage.setItem(
      'surveyData',
      JSON.stringify({
        speciality: specialityName,
      }),
    );
    const link = `/initiate/inboxId/${specialityId}/websiteToken/${websiteTokenValue}`;
    history.push(link);
  };

  if (error) return <ErrorPage text={error} goTo="/" />;

  if (!allInbox) return <LoadPage />;

  return (
    <div className="prixa-container is-top is-full" style={{ verticalAlign: 'baseline' }}>
      <div className="margin-largeX margin-baseT margin-xLargeB padding-baseB">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {allInbox.map(({ id, name, website_token }: InboxType) => { //eslint-disable-line
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <div
                  className={`margin-smallB padding-microX`}
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  onClick={(): void => clickedSpecialities(id, name, website_token)}
                >
                  <Image
                    avatar
                    size="tiny"
                    className="margin-tinyR"
                    style={{
                      height: '32px',
                      width: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      boxShadow: id === specialityId ? '0 1px 1px 0 var(--primary), 0 0 0 2px var(--primary)' : 'none',
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `${baseIconURL}Rumah Sakit.png`;
                    }}
                    src={`${baseIconURL}Icon ${name}-min.png`}
                  />
                  <span className={id === specialityId ? 'color-primary text-bold' : 'color-default'}>{name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="prixa-fixed-footer">
        <div className="padding-small bg-white" style={{ boxShadow: '0 -4px 8px 0 rgba(76, 79, 84, 0.16)' }}>
          <Button
            disabled={specialityId === ''}
            style={{ borderRadius: '4px', height: '40px' }}
            size="full"
            variant="primary"
            onClick={startConversation}
          >
            Pilih
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllSpecialitySideSheet;
