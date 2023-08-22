import { createContext, useContext } from 'react';

const MyGlobalContext = createContext({});

export const useGlobalData = () => {
  return useContext(MyGlobalContext);
};

export default MyGlobalContext;
