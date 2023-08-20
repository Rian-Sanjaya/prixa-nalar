import React, { createContext, useReducer } from 'react';
import Reducer from './BookingReducer';

const initialState: any = {
  doctorData: {},
  date: null,
};

const Store = ({ children }: any) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

export const Context = createContext(initialState);
export default Store;
