import React from 'react';
import { FormLabel, InputText, Text } from 'prixa-design-kit/dist';
import TextArea from '../../../components/textarea/TextArea';

const useInput = ({ label, type = 'text', err, placeholder, isValidate = false, errMessage }: any) => {
  const [value, setValue] = React.useState();
  const input = (
    <React.Fragment>
      <FormLabel errors={false}>{label}</FormLabel>
      {type === 'textarea' ? (
        <TextArea setData={setValue} placeholder={placeholder} />
      ) : (
        <InputText
          errors={err}
          placeholder={placeholder}
          setData={setValue}
          small={false}
          type={type}
          validate={isValidate}
          value={value || ''}
        />
      )}
      {errMessage && err ? (
        <div className="margin-microT">
          <Text scale="errorMessage">{errMessage}</Text>
        </div>
      ) : (
        ''
      )}
    </React.Fragment>
  );
  return [value, setValue, input];
};

export { useInput };
