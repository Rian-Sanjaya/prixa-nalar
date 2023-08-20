import React from 'react';
import '../passwordInput/passwordInput.scss';
import { Icon } from 'prixa-design-kit/dist';

const PasswordInput = ({ setData }: any) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="input-wrapper">
      <input
        className="input-password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Tulis Password"
        onChange={(e: any) => setData(e.target.value)}
      ></input>
      <Icon onClick={() => setShowPassword(!showPassword)} type={showPassword ? 'eye-slash' : 'eye'} />
    </div>
  );
};

export default PasswordInput;
