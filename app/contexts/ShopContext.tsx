import {createContext, useContext, useState} from 'react';
import { Shop, ShopSettings, ThemeAppExtension } from '~/types/global';

const ShopContext = createContext<ShopContent>({});

type ShopContent = {
    shop?: Shop
    setShop?: (shop: Shop) => void,
    planName?: string,
    setPlanName?: (planName: string) => void,
    trialDays?: number,
    setTrialDays?: (trialDays: number) => void,
    hasOffers?: boolean,
    setHasOffers?: (hasOffers: boolean) => void,
    updateShopSettingsAttributes?: (updatedValue: any, ...updatedKey: any[]) => void,
    shopSettings?: ShopSettings,
    setShopSettings?: React.Dispatch<React.SetStateAction<ShopSettings>>,
    themeAppExtension?: ThemeAppExtension,
    setThemeAppExtension?: (themeAppExtension: ThemeAppExtension) => void,
    isSubscriptionUnpaid?: boolean,
    setIsSubscriptionUnpaid?: (isSubscriptionUnpaid: boolean) => void,
}
export const SETTINGS_DEFAULTS = {
    shop_id: undefined,
    offer_css: '',
    css_options: {}
}

export default function ShopProvider({ children }) {
    const [shop, setShop] = useState<Shop>();
    const [planName, setPlanName] = useState<string>("");
    const [trialDays, setTrialDays] = useState<number>();
    const [hasOffers, setHasOffers] = useState<boolean>();
    const [shopSettings, setShopSettings] = useState<ShopSettings>({...SETTINGS_DEFAULTS});
    const [isSubscriptionUnpaid, setIsSubscriptionUnpaid] = useState<boolean>(true);
    const [themeAppExtension, setThemeAppExtension] = useState<ThemeAppExtension>();

    function updateShopSettingsAttributes(updatedValue: any, ...updatedKey: any[]) {
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
