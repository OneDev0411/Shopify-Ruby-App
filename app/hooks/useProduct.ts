import { useSelector } from "react-redux";
import { IRootState } from "~/store/store";
import { ShopSettings } from "~/types/types";
import { useApiRequest } from "./useApiRequest";
import { ApiBaseUrl } from "~/shared/constants/Others";

export const useProduct = () => {
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const { processApiCall } = useApiRequest();

  const elementSearch = async (queryData: string, item_type: string) => {
    const url = `${ApiBaseUrl}/element_search`;
    const body = { product: { query: queryData, type: item_type }, shop: shopAndHost.shop };
    return await processApiCall(url, 'POST', body);
  };

  const fetchShopifyDetails = async (shopifyId: string, shopId?: number) => {
    const queryParams = shopId ? `shop_id=${shopId}&` : '';
    const url = `${ApiBaseUrl}/products/shopify/${shopifyId}?${queryParams}shop=${shopAndHost.shop}`;
    return await processApiCall(url, 'GET');
  };

  const syncProductDetails = async (productId: number, shopSettings?: ShopSettings | undefined) => {
    const url = `${ApiBaseUrl}/products/multi/${productId}?shop_id=${shopSettings?.shop_id}&shop=${shopAndHost.shop}`;
    return await processApiCall(url, 'GET');
  };

  return { elementSearch, fetchShopifyDetails, syncProductDetails };
}

