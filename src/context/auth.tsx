import { createContext, useContext } from 'react';

export const AuthContext = createContext({} as any);

export const useAuth = () => {
  return useContext(AuthContext);
};
