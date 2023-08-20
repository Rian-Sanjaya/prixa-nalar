import React, { useState } from 'react';
import '../textbox/textbox.scss';
import { Icon } from 'prixa-design-kit/dist';

export interface InputProps {
  type?: string;
  placeholder: string;
  transition?: any;
  onClick: any;
}

const TextBox: React.FC<InputProps> = (props: InputProps) => {
  const [{ value }, setValue] = useState({ value: '' });

  const submitData = (event: any) => {
    event.preventDefault();

    const data = {
      type: 'text',
      value: value,
      tag: value,
    };

    if (data.value) {
      props.transition(false);
      props.onClick(data).then((res: string) => {
        if (res !== 'showComplaint') {
          props.transition(true);
        }
      });
      setValue({ value: '' });
    }
  };

  const onValueChange = (event: any) => {
    setValue({ value: String(event.target.value) });
  };

  return (
    <div className="prixa-textbox">
      <form id="inputForm">
        <input
          type={props.type || 'text'}
          value={value}
          placeholder={props.placeholder}
          onChange={onValueChange}
          required
        />
        <button type="submit" onClick={submitData}>
          <span className="fa-layers fa-fw">
            <Icon color="white" type="long-arrow-alt-up" width="lg" />
            <Icon type="circle" width="2x" />
          </span>
        </button>
      </form>
    </div>
  );
};

export default TextBox;
