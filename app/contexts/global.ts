import { NavigateFunction } from '@remix-run/react';
import { createContext, useContext } from 'react';

interface IGlobalContext {
  navigate?: NavigateFunction
}

const MyGlobalContext = createContext<IGlobalContext>({});

export const useGlobalData = () => {
  return useContext(MyGlobalContext);
};

export default MyGlobalContext;
