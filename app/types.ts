interface autopilotSettingsProps {
  autopilotCheck: any;
  setAutopilotCheck: any;
}

type Product = {
  id: any,
  title: string,
  variants: any,
}

type Rule = { quantity: number, rule_selector: string, item_type: string, item_shopify_id: number, item_name: string }

type ThemeSetting = { id: number, theme_name: string, page_type: string, position: number, action: string, selector: string, image_url: string }

type Offer = any

type ShopAndHost = { shop: {}, host: string };
