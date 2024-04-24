type JsonVariants = {
    "id": number,
    "image_url": string | URL,
    "title": string,
    "price": string,
    "currencies": [
        {
            "label": string,
            "price": string,
            "compare_at_price": string
        },
        {
            "label": string,
            "price": string,
            "compare_at_price": string
        }
    ],
    "unparenthesized_price": string,
    "compare_at_price": string,
    "price_is_minor_than_compare_at_price": boolean
}

type ProductDetails = {
  variants: any[],
  id: number,
  offer_id: number,
  title: string,
  price: string,
  url: string,
  compare_at_price: null,
  available_json_variants: JsonVariants[],
  show_single_variant_wrapper: boolean,
  hide_variants_wrapper: boolean,
  medium_image_url: string | URL,
  image: string,
}

type Product = {
    id: number,
    title: string,
    variants: Variant[],
    image: string,
}

type Variant = {
    id: number,
    title: string
}

type PlacementSetting = {
    id?: number,
    default_ajax_cart: boolean,
    default_product_page: boolean,
    default_cart_page: boolean,
    template_ajax_id?: number,
    template_product_id?: number,
    template_cart_id?: number,
    offer_id?: number,
    created_at?: string,
    updated_at?: string
}

type AdvancedPlacementSetting = {
    id?: number,
    advanced_placement_setting_enabled?: null,
    custom_product_page_dom_selector: string,
    custom_product_page_dom_action: string,
    custom_cart_page_dom_selector: string,
    custom_cart_page_dom_action: string,
    custom_ajax_dom_selector: string,
    custom_ajax_dom_action: string,
    offer_id?: number,
    created_at?: string,
    updated_at?: string
}

type CssOptions = {
    main?: {
        color: string,
        backgroundColor: string,
        [key: string]: string
    },
    text?: {
        [key: string]: string
    },
    button?: {
        color: string,
        backgroundColor: string,
        [key: string]: string
    }
}

// TODO: More changes to be made
type Shop = {
    id: number,
    shop_id: number,
    name: string,
    myshopify_domain: string,
    shopify_id: number,
    email: string,
    timezone: string,
    iana_timezone: string,
    api_token: string,
    installed_at: string,
    activated_at: string,
    frozen_at: string,
    uninstalled_at?: null,
    created_at: string,
    updated_at: string,
    finder_token: string,
    stats_synced_at: string,
    last_synced_at?: string,
    money_format: string,
    last_customer_sync_at?: null,
    last_sync_error_code?: null,
    last_sync_error_at?: null,
    uses_ajax_cart: boolean,
    custom_cart_page_dom_selector: string,
    admin: boolean,
    notification_email?: null,
    send_status_emails: boolean,
    currency_units: string,
    custom_ajax_dom_selector: string,
    custom_ajax_dom_action: string,
    opened_at: string,
    shopify_plan_name: string,
    custom_domain: string,
    syncing: boolean,
    custom_cart_page_dom_action: string,
    shopify_theme_name: string,
    shopify_mobile_theme_name?: null,
    fetched_shopify_orders_at?: null,
    use_pure_js: boolean,
    tax_percentage?: null,
    offer_css?: null,
    can_run_on_checkout_page: boolean,
    native_stats: boolean,
    variant_price_format: string,
    started_wizard_at?: null,
    wizard_token?: null,
    extra_css_classes?: null,
    cart_type?: null,
    wizard_completed_at?: null,
    custom_bg_color: string,
    custom_text_color: string,
    custom_button_bg_color: string,
    custom_button_text_color: string,
    css_fields?: null,
    platform: string,
    uses_ajax_refresh: boolean,
    ajax_refresh_code?: null,
    custom_cart_url?: null,
    has_recharge: boolean,
    currency_decimal_separator?: null,
    currency_thousands_separator?: null,
    currency_decimal_places?: null,
    currency_symbol_location?: null,
    cdn?: null,
    has_remove_offer: boolean,
    republish_status?: null,
    has_geo_offers: boolean,
    has_autopilot?: null,
    soft_purge_only?: null,
    review?: null,
    review_added_at?: null,
    debug_mode: boolean,
    has_custom_priorities?: null,
    sync_state?: null,
    hidden_products_json?: null,
    skip_inventory?: null,
    defaults_set_at?: null,
    defaults_set_for?: null,
    defaults_set_result?: null,
    script_tag_location: string,
    shopify_subsription_status?: null,
    shopify_subscription_history?: null,
    shopify_subscription_status_updated_at?: null,
    top_sellers?: null,
    top_sellers_updated_at?: null,
    skip_resize_cart?: null,
    js_version?: null,
    custom_checkout_dom_selector?: null,
    custom_checkout_dom_action?: null,
    has_granular_placement?: null,
    old_offers?: null,
    feature_flags?: null,
    stat_provider?: null,
    has_multi?: null,
    companions_status?: null,
    companions_status_updated_at?: null,
    app: string,
    needs_checkout_adjustment: boolean,
    script_tag_verified_at?: null,
    custom_theme_template?: null,
    script_tag_id: number,
    last_refresh_result: string,
    last_refreshed_at: string,
    shopify_asset_url?: null,
    css_options: CssOptions,
    adjust_dropdown_width: boolean,
    shopify_plan_internal_name: string,
    has_reviewed?: null,
    show_spinner: boolean,
    builder_version?: null,
    has_custom_rules?: null,
    last_published_at: string,
    publish_job: string,
    uses_gtm?: null,
    has_custom_checkout_destination?: null,
    enabled_presentment_currencies: string[],
    default_presentment_currency: string,
    has_redirect_to_product?: null,
    has_weighted_autopilot?: null,
    currency: string,
    custom_product_page_dom_selector: string,
    custom_product_page_dom_action: string,
    shopify_token: string,
    shopify_domain: string,
    access_scopes: string,
    shopify_token_updated_at?: null,
    stats_from: string,
    shop_domain: string,
    phone_number?: null,
    unpublished_offer_ids?: null,
    activated: boolean,
    orders_through_offers: number,
    default_template_settings: {},
    is_shop_active: boolean,
    plan: Plan
    subscription: Subscription,
    days_remaining_in_trial: number,
    has_offers: boolean,
    theme_app_extension: ThemeAppExtension,
    active_offers_count: number,
}

type Plan = {
    "id": number,
    "name": string,
    "price_in_cents": number,
    "offers_limit": number,
    "views_limit": number,
    "advanced_stats": boolean,
    "active": boolean,
    "created_at": string,
    "updated_at": string,
    "has_ajax_cart"?: boolean,
    "has_customer_tags": boolean,
    "has_ab_testing": boolean,
    "has_branding": boolean,
    "has_offers_in_checkout": boolean,
    "has_geo_offers": boolean,
    "has_remove_offers": boolean,
    "has_autopilot": boolean,
    "stripe_id"?: null,
    "internal_name": string
}

type Subscription = {
    id: number,
    plan_id: number,
    shop_id: number,
    price_in_cents: number,
    offers_limit: number,
    views_limit: number,
    advanced_stats: boolean,
    status: string,
    shopify_charge_id: number,
    created_at: string,
    updated_at: string,
    has_ajax_cart: boolean,
    has_customer_tags: boolean,
    has_ab_testing: boolean,
    has_branding: boolean,
    extra_trial_days: number,
    trial_ends_at: string,
    has_match_options?: boolean,
    has_discounts: boolean,
    stripe_email?: string,
    stripe_customer_token?: string,
    platform?: string,
    stripe_token?: string,
    discount_percent?: number,
    bill_on: string,
    free_plan_after_trial: boolean,
    shopify_charge_status?: any
}

type ThemeAppExtension = {
    "id": number,
    "shop_id": number,
    "product_block_added": boolean,
    "cart_block_added": boolean,
    "collection_block_added": boolean,
    "theme_app_embed": boolean,
    "theme_app_complete": boolean,
    "created_at": string,
    "updated_at": string,
    "theme_version": string
}

type ShopSettings = {
    custom_ajax_dom_selector?: string,
    custom_ajax_dom_action?: string,
    custom_cart_page_dom_selector?: string,
    custom_cart_page_dom_action?: string,
    custom_product_page_dom_selector?: string,
    custom_product_page_dom_action?: string,
    ajax_refresh_code?: string,
    activated?: boolean,
    canonical_domain?: string,
    can_run_on_checkout_page?: boolean,
    custom_theme_css?: string,
    shopify_domain?: string,
    currency_units?: string,
    offer_css?: string,
    path_to_cart?: string,
    show_spinner?: boolean,
    uses_ajax_refresh?: boolean,
    uses_ajax_cart?: boolean,
    wizard_token?: string,
    finder_token?: string,
    has_branding?: boolean,
    has_pro_features?: boolean,
    css_options: CssOptions,
    custom_bg_color?: string,
    custom_text_color?: string,
    custom_button_bg_color?: string,
    custom_button_text_color?: string,
    tax_percentage?: number,
    money_format?: string,
    stats_from?: string,
    shop_id?: number,
    default_template_settings?: any,
    has_redirect_to_product?: boolean,
    theme_version?: string,
    offers_limit_reached?: boolean
}

type Offer = {
    id?: number,
    rules_json?: Rule[],
    text_a: string,
    text_b?: string,
    cta_a: string,
    cta_b: string,
    offerable?: {
        title: string,
        price: string,
        compare_at_price: number
    },
    css: string,
    show_product_image: boolean,
    product_image_size: string,
    link_to_product: boolean,
    theme: string,
    shop?: {
        path_to_cart: string,
        extra_css_classes: null,
        css_options: CssOptions,
        offer_css: null
    },
    show_nothanks: boolean,
    calculated_image_url: string | URL | null,
    hide_variants_wrapper: boolean,
    show_variant_price: boolean,
    uses_ab_test?: boolean,
    ruleset_type: string,
    offerable_type: string,
    offerable_product_shopify_ids: number[],
    offerable_product_details: ProductDetails[],
    checkout_after_accepted: boolean,
    discount_code: string,
    discount_target_type: string,
    stop_showing_after_accepted: boolean,
    publish_status: string | "draft" | "published",
    products_to_remove?: string[],
    show_powered_by: boolean,
    show_spinner?: boolean,
    must_accept: boolean,
    show_quantity_selector: boolean,
    powered_by_text_color?: string,
    powered_by_link_color?: string,
    multi_layout: string,
    show_custom_field: boolean,
    custom_field_name: string,
    custom_field_placeholder: string,
    custom_field_required: boolean,
    custom_field_2_name?: string,
    custom_field_2_placeholder?: string,
    custom_field_2_required?: boolean,
    custom_field_3_name?: string,
    custom_field_3_placeholder?: string,
    custom_field_3_required?: boolean,
    title?: string,
    included_variants: {
        [key:string]: (string | number)[]
    },
    show_compare_at_price: boolean,
    redirect_to_product?: boolean,
    show_product_price: boolean,
    show_product_title: boolean,
    in_cart_page: boolean,
    in_ajax_cart: boolean,
    in_product_page: boolean,
    css_options: CssOptions,
    placement_setting: PlacementSetting,
    save_as_default_setting?: boolean,
    advanced_placement_setting: AdvancedPlacementSetting,
    custom_css: string,
    offers_limit_reached?: boolean,
    remove_if_no_longer_valid: boolean
    autopilot_quantity?: number,
    excluded_tags?: string,
    selectedView?: string
}

type ThemeSetting = {
  id: number,
  theme_name: string,
  page_type: string,
  position: number,
  action: string,
  selector: string,
  image_url: string
}

interface IAutopilotSettingsProps {
  autopilotCheck: AutopilotCheck;
  setAutopilotCheck: (autopilotCheck: AutopilotCheck) => void;
}

type ShopAndHost = {
  shop: string,
  host: string,
}

type AutopilotCheck = {
  shop_autopilot: boolean,
  isPending: string,
  autopilot_offer_id: number
}

type Rule = {
    quantity: number,
    rule_selector: string,
    item_type: string,
    item_shopify_id: number,
    item_name: string
}

type ProductVariants = {
    [key:string]: (string|number)[],
}

export type { JsonVariants, ProductDetails, PlacementSetting, AdvancedPlacementSetting, CssOptions, Plan, Offer,
    Shop, ShopSettings, Subscription, ThemeAppExtension, ProductVariants, Product, Variant, Rule, IAutopilotSettingsProps, AutopilotCheck, ShopAndHost, ThemeSetting}

declare global {
    interface Window {
        ENV: any;
    }
}
