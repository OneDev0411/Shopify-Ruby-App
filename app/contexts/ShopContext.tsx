import {createContext, useContext, useState} from 'react';
import {Shop, ShopSettings, ThemeAppExtension} from '~/types/types';

export const SETTINGS_DEFAULTS = {
  shop_id: undefined,
  offer_css: '',
  css_options: {},
  has_recharge: false,
}

const ShopContext = createContext<ShopContent>({
  shopSettings: SETTINGS_DEFAULTS,
  isSubscriptionUnpaid: true,
  shop: null
});

type ShopContent = {
    shop: Shop | null,
    setShop?: (shop: Shop) => void,
    planName?: string,
    setPlanName?: React.Dispatch<React.SetStateAction<string>>,
    trialDays?: number,
    setTrialDays?: React.Dispatch<React.SetStateAction<number | undefined>>,
    hasOffers?: boolean,
    setHasOffers?: (hasOffers: boolean) => void,
    updateShopSettingsAttributes?: (updatedValue: any, ...updatedKey: string[]) => void,
    shopSettings: ShopSettings,
    setShopSettings?: React.Dispatch<React.SetStateAction<ShopSettings>>,
    themeAppExtension?: ThemeAppExtension,
    setThemeAppExtension?: React.Dispatch<React.SetStateAction<ThemeAppExtension | undefined>>,
    isSubscriptionUnpaid: boolean,
    setIsSubscriptionUnpaid?: (isSubscriptionUnpaid: boolean) => void,
}

export default function ShopProvider({ children }) {
    const [shop, setShop] = useState<Shop | null>(null);
    const [planName, setPlanName] = useState<string>("");
    const [trialDays, setTrialDays] = useState<number>();
    const [hasOffers, setHasOffers] = useState<boolean>();
    const [shopSettings, setShopSettings] = useState<ShopSettings>({...SETTINGS_DEFAULTS});
    const [isSubscriptionUnpaid, setIsSubscriptionUnpaid] = useState<boolean>(true);
    const [themeAppExtension, setThemeAppExtension] = useState<ThemeAppExtension>();
      
  function updateShopSettingsAttributes(updatedValue: any, ...updatedKey: string[]) {
    if (updatedKey.length == 1) {
      setShopSettings(previousState => {
        return {...previousState, [updatedKey[0]]: updatedValue};
      });
    } else if (updatedKey.length == 2) {
      setShopSettings(previousState => ({
        ...previousState,
        [updatedKey[0]]: {
          ...previousState[updatedKey[0]],
          [updatedKey[1]]: updatedValue
        }
      }));
    } else if (updatedKey.length == 3) {
      setShopSettings(previousState => ({
        ...previousState,
        [updatedKey[0]]: {
          ...previousState[updatedKey[0]],
          [updatedKey[1]]: {
            ...previousState[updatedKey[0]][updatedKey[1]],
            [updatedKey[2]]: updatedValue
          }
        }
      }));
    }
  }

  return (
    <ShopContext.Provider
      value={{
        shop,
        setShop,
        planName,
        setPlanName,
        trialDays,
        setTrialDays,
        hasOffers,
        setHasOffers,
        updateShopSettingsAttributes,
        shopSettings,
        setShopSettings,
        themeAppExtension,
        setThemeAppExtension,
        isSubscriptionUnpaid,
        setIsSubscriptionUnpaid
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

// custom hook
export const useShopState = () => {
  const ctx: ShopContent = useContext(ShopContext);

  if (!ctx) {
    throw new Error("useShop must be used within the ShopProvider");
  }

  return ctx;
};
