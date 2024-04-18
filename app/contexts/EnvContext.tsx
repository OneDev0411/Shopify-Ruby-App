import { createContext, useContext } from 'react';

interface IEnvContext {
  ENABLE_THEME_APP_EXTENSION?: string
  INTERCOM_APP_ID?: string
}

const EnvContext = createContext<IEnvContext>({});

export default function ShopProvider({ env, children }) {  
  return (
  <EnvContext.Provider 
    value={env}>
      {children}
  </EnvContext.Provider>
)};

export const useEnv = () => useContext(EnvContext);
