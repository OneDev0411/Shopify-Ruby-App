// @ts-nocheck
import { api } from "../api";
import { CURRENT_SHOP, UPDATE_ACTIVATION, UPDATE_SHOP_SETTINGS, SHOP_OFFERS_STATS } from "../endpoints/shop";

export function getShop(shopify_domain) {
  return api.get(CURRENT_SHOP, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export function setShopSettings(shop_params, shop_id) {
  return api.patch(UPDATE_SHOP_SETTINGS, {
    shop: shop_params,
    shop_id: shop_id
  });
}

export function toggleShopActivation(shopify_domain) {
  return api.get(UPDATE_ACTIVATION, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export const getShopOffersStats = async (shopify_domain, period) => {
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

export async function fetchShopData(shop) {
  try {
    const response = await api.get(`${window.ENV.API_HOST}/api/v2/merchant/current_shop?shop=${shop}`, {
      method: "GET",
      // uncomment this line if you are using ngrok, otherwise server would not process the request.
      //  "ngrok-skip-browser-warning": "69420"
      headers: {
        "Content-Type": "application/json",
        mode: 'cors'
      },
    });
    return response;
  } 
  catch (error) {
    console.error("Failed to fetch shop data:", error);
    throw error;
  }
}