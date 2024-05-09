import { useState } from "react";
import {
  OFFER_CREATE_URL,
  OFFER_DETAILS_URL
} from "../shared/constants/EditOfferOptions";
import { Location } from "@remix-run/router";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/store";
import { Offer, PlacementSetting, ShopSettings } from "~/types/types";

export const useOffer = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const authFetch = useAuthenticatedFetch(shopAndHost.host);

  const fetchOffer = async (offerID: string, shop: string) => {
    setIsPending(true)
    const response = await authFetch(OFFER_DETAILS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({offer: {offer_id: offerID}, shop}),
    });
    setIsPending(false)
    return response;
  };

  const saveOffer = async (offer: Offer, location: Location, shop: ShopSettings | undefined, status: boolean) => {

    let ots = populateOTS(offer, shop?.has_recharge, status)
    let responseData

    try {
      const response = await authFetch(`/api/v2/offers/${offer.id}/update/${shop?.shop_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({offer: ots, shop: shopAndHost.shop, host: shopAndHost.host})
      });
      const responseData = await response.json();
      for(let i=0; i<responseData.offer.offerable_product_details.length; i++) {
        responseData.offer.offerable_product_details[i].preview_mode = true;
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return responseData;
  };

  const populateOTS = (offer: Offer, hasRecharge: boolean | undefined, status: boolean) => {

    let placement_setting;
    let save_as_default_setting;

    if(offer.in_product_page && offer.in_cart_page) {
      placement_setting = {
        default_product_page: offer.placement_setting?.default_product_page,
        default_cart_page: offer.placement_setting?.default_cart_page,
        default_ajax_cart: true,
        template_product_id: offer.placement_setting?.template_product_id,
        template_cart_id: offer.placement_setting?.template_cart_id,
        template_ajax_id: null,
      }
    }
    else if (offer.in_ajax_cart && offer.in_cart_page) {
      placement_setting = {
        default_product_page: true,
        default_cart_page: offer.placement_setting?.default_cart_page,
        default_ajax_cart: offer.placement_setting?.default_ajax_cart,
        template_product_id: null,
        template_cart_id: offer.placement_setting?.template_cart_id,
        template_ajax_id: offer.placement_setting?.template_ajax_id,
      }
    }
    else if (offer.in_cart_page) {
      placement_setting = {
        default_product_page: true,
        default_cart_page: offer.placement_setting?.default_cart_page,
        default_ajax_cart: true,
        template_product_id: null,
        template_cart_id: offer.placement_setting?.template_cart_id,
        template_ajax_id: null,
      }
    }
    else if (offer.in_product_page) {
      placement_setting = {
        default_product_page: offer.placement_setting?.default_product_page,
        default_cart_page: true,
        default_ajax_cart: true,
        template_product_id: offer.placement_setting?.default_product_page,
        template_cart_id: null,
        template_ajax_id: null,
      }
    }
    else if (offer.in_ajax_cart) {
      placement_setting = {
        default_product_page: true,
        default_cart_page: true,
        default_ajax_cart: offer.placement_setting?.default_ajax_cart,
        template_product_id: null,
        template_cart_id: null,
        template_ajax_id: offer.placement_setting?.template_ajax_id,
      }
    }
    if(offer.advanced_placement_setting?.advanced_placement_setting_enabled) {
      save_as_default_setting = offer.save_as_default_setting;
    }
    else {
      save_as_default_setting = false;
    }

    let {css, cta_a, text_a, uses_ab_test, cta_b, text_b, advanced_placement_setting, ...ots} = offer
    let new_ots = {
      ...ots,
      active: status,
      publish_status: status ? "published" : "draft", // Modify 'publish_status' based on 'status'
      placement_setting_attributes: placement_setting,
      save_as_default_setting: save_as_default_setting,
      advanced_placement_setting_attributes: advanced_placement_setting,
      offer_css: css,
      offer_cta: cta_a,
      offer_cta_alt: uses_ab_test ? cta_b : '',
      offer_text: text_a,
      offer_text_alt: uses_ab_test ? text_b : '',
    };

    if (hasRecharge && offer.recharge_subscription_id) {
      new_ots.recharge_subscription_id = offer.recharge_subscription_id;
      new_ots.interval_unit = offer.interval_unit;
      new_ots.interval_frequency = offer.interval_frequency;
    }

    return new_ots
  }
  const createOffer = async (offer: Offer, shop: ShopSettings | undefined, status: boolean) => {
    let ots = populateOTS(offer, shop?.has_recharge, status)

    try {
      const response = await authFetch(`${OFFER_CREATE_URL}${shop?.shop_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({offer: ots})
      });
      let responseData = await response.json();
      return responseData
    } catch (error) {
      console.log('Error:', error);
    }
  }

  return { fetchOffer, saveOffer, createOffer, isPending }
};