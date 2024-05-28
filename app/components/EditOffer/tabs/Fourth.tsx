import {
    LegacyStack,
    ButtonGroup,
    Button, BlockStack,
} from "@shopify/polaris";
import {useState, useEffect, useContext} from "react";
import {Link} from "@remix-run/react";
import {OfferContent, OfferContext} from "../../../contexts/OfferContext";
import {useShopState} from "../../../contexts/ShopContext";
import { AdvancedSettings } from "../../organisms/index";
import { BannerContainer } from "../../atoms/index";
import { useEnv } from "~/contexts/EnvContext";
import {AlertCircleIcon, CheckIcon} from "@shopify/polaris-icons";
import CustomBanner from "~/components/CustomBanner";

interface IFourthTabProps {
    saveDraft: () => void,
    publishOffer: () =>  void,
    enablePublish: boolean
}

// Advanced Tab
export function FourthTab(props: IFourthTabProps) {
    const { offer, updateNestedAttributeOfOffer } = useContext(OfferContext) as OfferContent;
    const { shopSettings, themeAppExtension } = useShopState();
    const env = useEnv();
    const isLegacy = themeAppExtension?.theme_version !== '2.0' || import.meta.env.VITE_ENABLE_THEME_APP_EXTENSION?.toLowerCase() !== 'true';

    const [themeAppUrl, setThemeAppUrl] = useState<string>('');

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
                `https://${shopSettings?.shopify_domain}/admin/themes/current/editor?template=${urlPlacement}
                &addAppBlockId=${env.SHOPIFY_ICU_EXTENSION_APP_ID}/${urlPlacement}_app_block&target=${urlSection}`
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

            <BlockStack gap={"300"}>
                <AdvancedSettings />
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
        </>
    );
}
