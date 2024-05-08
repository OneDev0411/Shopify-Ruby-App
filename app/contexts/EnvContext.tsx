import { createContext, useContext } from 'react';

interface IEnvContext {
  ENABLE_THEME_APP_EXTENSION?: string;
  INTERCOM_APP_ID?: string;
  CHOOSE_PLAN_MODAL_CONTENT?: string;
  ERROR_IMG_URL?: string;
  ERROR_TITLE?: string;
  ERROR_CONTENT?: string;
  SERVER_BASE_URL?: string;
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
