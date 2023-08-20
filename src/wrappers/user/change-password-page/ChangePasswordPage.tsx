import React from 'react';
import { Toast } from 'prixa-design-kit/dist';
import { ChangePasswordForm } from './ChangePasswordForm';
import { ChangePasswordContext } from './ChangePasswordContext';

export const ChangePasswordPage = () => {
  const [isErrorMsg, setError] = React.useState('');

  return (
    <div className="prixa-container is-top">
      <ChangePasswordContext.Provider value={{ setError }}>
        <ChangePasswordForm />
      </ChangePasswordContext.Provider>
      <Toast timeout={3000} message={isErrorMsg} variant="danger" show={isErrorMsg !== ''}></Toast>
    </div>
  );
};

export default ChangePasswordPage;
