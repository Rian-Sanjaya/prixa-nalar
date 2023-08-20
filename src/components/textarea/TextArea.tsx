import React from 'react';
import '../textarea/textarea.scss';

const TextArea = (props: any) => {
  return (
    <textarea
      className="prixa-textarea"
      rows={5}
      placeholder={props.placeholder || ''}
      onChange={e => props.setData(e.target.value)}
    ></textarea>
  );
};

export default TextArea;
