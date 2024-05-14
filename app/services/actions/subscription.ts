import { Subscription } from "~/types/types";
import { api } from "../api";
import { PUT_SUBSCRIPTION, CONFIRM_CHARGE, CURRENT_SUBSCRIPTION } from "../endpoints/subscription";

export function getSubscription(shopify_domain: string) {
  return api.get(CURRENT_SUBSCRIPTION, {
    params:{
      shopify_domain: shopify_domain
    }
  });
}

export function updateSubscription(plan_internal_name: string, shopify_domain: string, host: string) {
  return api.put(PUT_SUBSCRIPTION, {
    subscription: {
      plan_internal_name: plan_internal_name
    },
    shopify_domain: shopify_domain,
    host: host
  });
}

export function confirmCharge(shopify_domain: string, charge_id: string){
  return api.get(CONFIRM_CHARGE, {
    params:{
      shopify_domain: shopify_domain,
      charge_id: charge_id
    }
  });
}

export function isSubscriptionActive(subscription: Subscription | null){
  return subscription?.status === "approved"
}