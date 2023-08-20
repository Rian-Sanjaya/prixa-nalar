import React from 'react';
import { Button } from 'prixa-design-kit/dist';
import { useInput } from '../../../utils/useInput';
import { INSURANCE_API } from '../../../api/api-url';
import { postAPI } from '../../../api/api-method';
import { isCovid } from '../../../utils/constant';

interface DaftarInsuranceFormProps {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const DaftarInssuranceForm = ({
  setLoad,
  setEmailRegistered,
  setErrMessage,
}: DaftarInsuranceFormProps): JSX.Element => {
  const email = useInput({
    type: 'email-inssurance-regis',
    placeholder: 'nama@email.com',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoad(true);

    const data = {
      email: email.value,
      source: isCovid ? 'covid' : 'nalar',
    };
    const header = {
      'X-Prixa-API-Key':
        String(process.env.REACT_APP_API_URL).includes('dev') ||
        String(process.env.REACT_APP_API_URL).includes('localhost')
          ? 'PrixaInsuranceDevelopment'
          : `${process.env.REACT_APP_API_KEY}`,
      'Content-Type': 'application/json',
    };

    postAPI(INSURANCE_API.SUBSCRIBE, data, header)
      .then(res => {
        setLoad(false);
        setEmailRegistered(true);
        setTimeout(() => setEmailRegistered(false), 3000);
      })
      .catch(err => {
        setLoad(false);
        setErrMessage(`${err.message}. Daftar email insurance belum berhasil.`);
        setTimeout(() => {
          setErrMessage('');
        }, 3000);
      });
  };

  return (
    <>
      <form className="margin-smallT">
        <div style={{ position: 'relative' }}>
          {email.input}
          {email.error ? (
            <span style={{ fontFamily: 'Roboto', fontSize: '12px', fontStyle: 'italic', color: 'var(--alert)' }}>
              Data tidak valid
            </span>
          ) : (
            ''
          )}
          <Button
            className="insurrance-form-button"
            type="submit"
            variant="primary"
            onClick={
              !email.value || email.error
                ? (e: React.FormEvent<HTMLFormElement>): void => e.preventDefault()
                : (e: React.FormEvent<HTMLFormElement>): void => handleSubmit(e)
            }
          >
            Daftar
          </Button>
        </div>
      </form>
    </>
  );
};
