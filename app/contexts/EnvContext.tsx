import { createContext, useContext } from 'react';
import {IEnvContext} from "~/types/types";

const EnvContext = createContext<IEnvContext>({});

export default function ShopProvider({ env, children }) {
  return (
  <EnvContext.Provider
    value={env}>
      {children}
  </EnvContext.Provider>
)};

export const useEnv = () => useContext(EnvContext);
