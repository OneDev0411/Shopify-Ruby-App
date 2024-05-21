import {
    Card,
    BlockStack,
    ButtonGroup,
    Button,
    TextField,
    Checkbox,
    Select, Text, Banner
} from "@shopify/polaris";
import {useState, useCallback, useEffect, useContext} from "react";
import {Link} from "@remix-run/react";
import { DOMActionOptions } from "../../../shared/constants/DOMActionOptions";
import {OfferContext} from "../../../contexts/OfferContext";
import {useShopState} from "../../../contexts/ShopContext";
import {useEnv} from "../../../contexts/EnvContext";
import CustomBanner  from "~/components/CustomBanner";
import {
    AlertCircleIcon, CheckIcon
  }  from '@shopify/polaris-icons';
interface IFourthTabProps {
    saveDraft: () => void,
    publishOffer: () =>  void,
    enablePublish: boolean
}
// Advanced Tab
export function FourthTab(props) {
    const env = useEnv();
    const { offer, updateOffer, updateNestedAttributeOfOffer } = useContext(OfferContext);
    const { shopSettings, themeAppExtension } = useShopState();
    const handleChange = useCallback((newChecked) => updateOffer("save_as_default_setting", newChecked), []);
    const handleProductDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting",  "custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_action"), []);
    const handleOfferCss = useCallback((newValue) => updateNestedAttributeOfOffer(newValue, "custom_css"), []);

    const isLegacy = themeAppExtension.theme_version !== '2.0' || env?.ENABLE_THEME_APP_EXTENSION?.toLowerCase() !== 'true';

    const [themeAppUrl, setThemeAppUrl] = useState('');

    useEffect(() => {
        if (!isLegacy) {
            updateNestedAttributeOfOffer(false, "advanced_placement_setting", "advanced_placement_setting_enabled");

            let urlPlacement = '';
            let urlSection = ''
            if (offer.in_product_page) {
                urlPlacement = 'product'
                urlSection = 'mainSection';
            } else if (offer.in_cart_page){
                urlPlacement = 'cart'
                urlSection = 'newAppsSection';
            }
            setThemeAppUrl(
              `https://${shopSettings.shopify_domain}/admin/themes/current/editor?template=${urlPlacement}
              &addAppBlockId=${env?.SHOPIFY_ICU_EXTENSION_APP_ID}/${urlPlacement}_app_block&target=${urlSection}`
            )
        }
    }, [])

    return (
        <>
            { !isLegacy && !offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    <CustomBanner title="You are using Shopify's Theme Editor."
                        icon={AlertCircleIcon}
                        icon_color={"rgb(97,106,117)"}
                        content="Please use the theme editor to place the offers where you would like it." 
                        link_keyword="Click here"
                        after_link_content="to go to the theme editor."
                        background_color="rgb(249,242,210)"
                        border_color="rgb(210,210,198)"
                        link_to={themeAppUrl} name="theme_app_banner"/>
                </div>
              )
            }

            { !isLegacy && offer.in_ajax_cart &&
              (
                <div style={{marginBottom: "10px"}} className="polaris-banner-container">
                    {!themeAppExtension?.theme_app_embed ?
                        <CustomBanner title="You are using Shopify's Theme Editor."
                            icon={AlertCircleIcon}
                            icon_color={"rgb(183,125,11)"}
                            content="In order to show the offer in the Ajax Cart, you need to enable it in the Theme Editor." 
                            link_keyword="Click here"
                            after_link_content="to go to the theme editor."
                            background_color="rgb(252,239,212)"
                            border_color="rgb(244,197,86)"
                            link_to={`https://${shopSettings.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${env?.SHOPIFY_ICU_EXTENSION_APP_ID}/ajax_cart_app_block`}
                            name="theme_app_banner"/>
                    :
                        <CustomBanner title="You are using Shopify's Theme Editor."
                            icon={CheckIcon}
                            icon_color={"rgb(20,166,121)"}
                            content="Advanced settings are no longer needed for Shopify's Theme Editor. You've already enabled the app, all you need to do is publish your offer and it will appear in your Ajax cart." 
                            background_color="rgb(224,247,237)"
                            border_color="rgb(161,235,206)"
                            name="theme_app_banner_success"/>
                    }
                </div>
              )
            }

            {/* <Card sectioned title="Offer placement - advanced settings" actions={[{ content: 'View help doc' }]}> */}

            <BlockStack gap={"300"}>
                <Card>
                    <BlockStack gap={"300"}>
                        <BlockStack gap={"300"}>
                            <Text variant="headingMd" as="h6">Offer placement - advanced settings</Text>
                            {(!offer?.advanced_placement_setting?.advanced_placement_setting_enabled) && (
                                <>
                                    <b>To edit Advanced settings, enable "Advanced Placement Settings" option on the Placement tab.</b>
                                </>
                            )}
                        </BlockStack>
                        <div>
                            <BlockStack gap={"300"}>
                                <Text variant="headingSm" as="h2">Product page</Text>
                                    <TextField
                                        label="DOM Selector" 
                                        value={offer?.advanced_placement_setting?.custom_product_page_dom_selector}
                                        onChange={handleProductDomSelector} type="text" 
                                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                    />
                                    <Select
                                        label="DOM action"
                                        id="productDomAction"
                                        options={DOMActionOptions}
                                        onChange={handleProductDomAction}
                                        value={offer?.advanced_placement_setting?.custom_product_page_dom_action}
                                        disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                    />
                            </BlockStack>
                        </div>
                    </BlockStack>

                    <div>
                        <BlockStack gap={"300"}>
                            <hr className="legacy-card-hr placement-hr" />
                            <Text variant="headingSm" as="h2">Cart page</Text>
                            <TextField
                                label="DOM Selector" 
                                value={offer?.advanced_placement_setting?.custom_cart_page_dom_selector}
                                onChange={handleCartDomSelector} 
                                disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                            />
                            <Select
                                label="DOM action"
                                id="productDomAction"
                                options={DOMActionOptions}
                                onChange={handleCartDomAction}
                                value={offer?.advanced_placement_setting?.custom_cart_page_dom_action}
                                disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                            />
                        </BlockStack>
                    </div>
                    <div>
                        <BlockStack gap={"300"}>
                            <hr className="legacy-card-hr placement-hr" />
                            <Text variant="headingSm" as="h2">AJAX/Slider cart</Text>
                                <TextField
                                    label="DOM Selector" 
                                    value={offer?.advanced_placement_setting?.custom_ajax_dom_selector}
                                    onChange={handleAjaxDomSelector} 
                                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                />
                                <Select
                                    label="DOM action"
                                    id="productDomAction"
                                    options={DOMActionOptions}
                                    onChange={handleAjaxDomAction}
                                    value={offer?.advanced_placement_setting?.custom_ajax_dom_action}
                                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                />

                        </BlockStack>
                    </div>
                    <div>
                        <BlockStack gap={"300"}>
                            <hr className="legacy-card-hr placement-hr" />
                            <Text variant="headingSm" as="h2">Custom CSS</Text>
                                <TextField
                                    value={offer?.custom_css}
                                    onChange={handleOfferCss}
                                    multiline={6}
                                />
                        </BlockStack>
                    </div>
                        <br/>
                        <Checkbox
                            label="Save as default settings"
                            helpText="This placement will apply to all offers created in the future.
                            They can be edited in the Settings section."
                            checked={offer?.save_as_default_setting}
                            onChange={handleChange}
                            disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                        />
                </Card>
                <BlockStack>
                    <div className="align-center">
                        <span className="padding-fit">
                            <ButtonGroup>
                                <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                                <Button variant="primary" disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
                            </ButtonGroup>
                        </span>
                    </div>
                </BlockStack>
            </BlockStack>
            <div className="space-10"></div>
        </>
    );
}
