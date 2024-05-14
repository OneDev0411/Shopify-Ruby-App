import { api } from "../../api";
import { OFFER_ACTIVATE, LOAD_OFFER_DETAILS, OFFER_SETTINGS } from "../endpoints/offer";

export function offerActivate(offer_id: number, shop_id: number) {
  return api.post(OFFER_ACTIVATE, {
    offer_id: offer_id,
    shop_id: shop_id
  });
};

export function loadOfferDetails(shopify_domain: string, offer_id: number) {
  return api.post(LOAD_OFFER_DETAILS, {
    offer: { offer_id: offer_id},
    shop: shopify_domain
  })
};

export function getOfferSettings(shopify_domain: string, include_sample_products: number) {
  return api.post(OFFER_SETTINGS, {
    offer: {include_sample_products: include_sample_products},
    shop: shopify_domain
  })
}
