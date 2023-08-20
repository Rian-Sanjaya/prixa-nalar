import React from 'react';
import '../listview/listview.scss';
import { Button, Text, InputText } from 'prixa-design-kit/dist';

export interface Option {
  text: string;
  link: string;
  type: string;
  reply?: {
    value?: any;
    tag?: string;
  };
  description?: string;
  variant: 'default' | 'outline' | 'primary' | 'disabled' | 'secondary' | 'success' | undefined;
}

export interface ConversationProps {
  title: Array<string>;
  value?: string;
  loading?: boolean;
  options: Option[];
  callFunction?: (reply?: object) => void;
}

const ListView = (props: ConversationProps) => {
  return (
    <div className="prixa-list-container">
      <div style={{ margin: '16px' }}>
        <InputText icon type="text" disabledButton disabled value={props.value} />
      </div>
      {props.options.map((item, i) => {
        const reply: object = {
          type: 'button',
          value: 'false',
          tag: 'ComplaintNotInOptions',
        };
        if (item.type === 'text') {
          if (props.callFunction) {
            props.callFunction(reply);
            return '';
          } else {
            return '';
          }
        } else {
          const isComplaintNotinOptions = item.reply && item.reply.tag === 'ComplaintNotInOptions';
          return (
            <div className="prixa-list" key={i}>
              <div className="prixa-list-title">
                {(() => {
                  if (isComplaintNotinOptions) {
                    return (
                      <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: '28px', color: 'var(--alert)' }}>
                        Tidak Ada
                      </div>
                    );
                  } else {
                    return <Text scale="question">{item.text}</Text>;
                  }
                })()}
              </div>
              <div className="prixa-list-subtitle">
                <Text scale="content">{isComplaintNotinOptions ? item.text : item.description}</Text>
              </div>
              <div
                className="prixa-list-button"
                onClick={() => {
                  if (props.callFunction) {
                    props.callFunction(item.reply);
                  } else {
                    return '';
                  }
                }}
              >
                <Button size="small" variant="outline" className="dav-special">
                  Pilih
                </Button>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ListView;
