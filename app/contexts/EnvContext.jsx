import { createContext, useContext } from 'react';

const EnvContext = createContext({});

export default function ShopProvider({ env, children }) {  
  return (
  <EnvContext.Provider 
    value={env}>
      {children}
  </EnvContext.Provider>
)};

export const useEnv = () => useContext(EnvContext);
