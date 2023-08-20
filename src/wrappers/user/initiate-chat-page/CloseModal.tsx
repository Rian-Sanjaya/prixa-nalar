/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Paragraph, Button, Bottomsheet } from 'prixa-design-kit/dist';
import { postAPI } from '../../../api/api-method';
import { BAYMAX_API } from '../../../api/api-url';

interface CloseModalProps {
  closePopup: boolean;
  transactionId?: string;
  setPopup: (val: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const CloseModal = (props: CloseModalProps) => {
  return (
    <div>
      <Bottomsheet
        show={props.closePopup}
        setShow={props.setPopup}
        content={
          <div>
            <div style={{ padding: '0 40px' }}>
              <Paragraph scale="question" color="#fff" className="margin-baseB color-danger">
                Mengakhiri Percakapan
              </Paragraph>
              <Paragraph scale="content" style={{ fontSize: '16px' }}>
                Setelah mengakhiri percakapan, Anda tidak akan dapat melanjutkan percakapan ini. Akhiri percakapan?
              </Paragraph>
            </div>
            <div style={{ display: 'flex', marginTop: '40px' }}>
              <Button
                onClick={(): void => {
                  props.setPopup(false);
                }}
                size="full"
                variant="disabled"
                className="prixa-cancel-button"
              >
                Batal
              </Button>
              <Button
                onClick={(): void => {
                  props.setPopup(false);
                  if (window.baymaxSDK?.destroy) {
                    window.baymaxSDK.destroy();
                    setTimeout(() => {
                      window.location.href = '/';
                    }, 100);
                  } else if (props.transactionId) {
                    postAPI(BAYMAX_API.CONSUL_CANCEL, {
                      trx_id: props.transactionId,
                    })
                      .catch(() => {
                        postAPI(BAYMAX_API.CONSUL_FINISH, {
                          trx_id: props.transactionId,
                        });
                      })
                      .finally(() => {
                        window.location.href = '/';
                      });
                  } else {
                    setTimeout(() => {
                      window.location.href = '/';
                    }, 100);
                  }
                }}
                style={{
                  background: 'var(--alert)',
                }}
                size="full"
                variant="primary"
              >
                Akhiri
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};
