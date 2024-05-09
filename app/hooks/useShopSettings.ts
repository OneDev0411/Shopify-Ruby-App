import { IRootState } from "~/store/store";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useSelector } from "react-redux";
import { ShopSettings } from "~/types/types";

export const useShopSettings = () => {
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const authFetch = useAuthenticatedFetch(shopAndHost.host);

  const fetchShopSettings = async (shopAttr: {admin: null}) => {
    const response = await authFetch(`/api/v2/merchant/shop_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({shopAttr, shop: shopAndHost.shop})
    })
    return response;
  };

   const updateShopSettings = async (shopAttr: ShopSettings) => {
    const response = await authFetch('/api/v2/merchant/update_shop_settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop_attr: shopAttr, shop: shopAndHost.shop, admin: shopAttr.admin, json: true }),
    })
    return response;
  };

  return { fetchShopSettings, updateShopSettings }
}