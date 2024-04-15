export interface IAutopilotSettingsProps {
  autopilotCheck: AutopilotCheck;
  setAutopilotCheck: (autopilotCheck: AutopilotCheck) => void;
}

export type ShopAndHost = {
  shop: string,
  host: string,
}

type AutopilotCheck = {
  shop_autopilot: boolean,
  isPending: boolean,
  autopilot_offer_id: number
}

// TODO: Shift to global
export type Product = {
  id: any,
  title: string,
  variants: any,
}

export type ProductDetails = {
  id: number,
  offer_id: number,
  title: string,
  price: string,
  url: string,
  compare_at_price: null,
  available_json_variants: JsonVariants[],
  show_single_variant_wrapper: boolean,
  hide_variants_wrapper: boolean,
  medium_image_url: string | URL
}

// TODO: Shift to global
export type Rule = { quantity: number, rule_selector: string, item_type: string, item_shopify_id: number, item_name: string }

type ThemeSetting = { id: number, theme_name: string, page_type: string, position: number, action: string, selector: string, image_url: string }

type Offer = any

export type ProductVariants = {
  [key:string]: number[]
}
