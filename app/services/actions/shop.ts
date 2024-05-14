import { AxiosResponse } from "axios";
import { api } from "../api";
import { CURRENT_SHOP, UPDATE_ACTIVATION, UPDATE_SHOP_SETTINGS, SHOP_OFFERS_STATS } from "../endpoints/shop";
import { Shop, ThemeAppExtension } from "~/types/types";

export function getShop(shopify_domain: string) {
  return api.get(CURRENT_SHOP, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export function setShopSettings(shop_params: string, shop_id: number) {
  return api.patch(UPDATE_SHOP_SETTINGS, {
    shop: shop_params,
    shop_id: shop_id
  });
}

export function toggleShopActivation(shopify_domain: string) {
  return api.get(UPDATE_ACTIVATION, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export const getShopOffersStats = async (shopify_domain: string, period: string) => {
  try {
    const response = await api.post(SHOP_OFFERS_STATS, {
      shop: shopify_domain,
      period: period,
    });
    return response;
    } catch (error) {
      console.log('An error occurred while making the API call:', error);
      return null; 
    }
}

interface IShopData {
	offers_limit_reached: boolean;
	has_offers: boolean;
  subscription_not_paid: boolean;
  redirect_to?: string;
  theme_app_extension: ThemeAppExtension;
  shop: Shop;
  plan: string;
  days_remaining_in_trial: number;
}

export async function fetchShopData(shop: string): Promise<IShopData> {
  try {
    // @ts-ignore
    const response = await api.get(`${window.ENV.SERVER_BASE_URL}/api/v2/merchant/current_shop?shop=${shop}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: 'cors'
      },
    }) as Promise<IShopData>;
    return response;
  } 
  catch (error) {
    console.error("Failed to fetch shop data:", error);
    throw error;
  }
}