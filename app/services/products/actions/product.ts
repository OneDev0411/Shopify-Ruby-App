import { api } from "../../api";
import { PRODUCT_SHOPIFY, ELEMENT_SEARCH, PRODUCT_MULTI } from "../endpoints/product";

export function productShopify(shopify_id: string, shop_id: string) {
  let url = `${PRODUCT_SHOPIFY}/${shopify_id}?shop_id=${shop_id}`
  return api.get(url, {
  });
};

export function elementSearch(shopify_domain: string, query: string) {
  return api.post(ELEMENT_SEARCH, {
    product: { query: query, type: 'product' },
    shop: shopify_domain
  });
};

export function productsMulti(selectedProduct: string, shop_id: string) {
  let url = `${PRODUCT_MULTI}/${selectedProduct}?shop_id=${shop_id}`
  return api.get(url, {
  })
}
