import {
    LegacyStack,
    ButtonGroup,
    Button,
} from "@shopify/polaris";
import {useState, useEffect, useContext} from "react";
import {Link} from "@remix-run/react";
import {OfferContent, OfferContext} from "../../../contexts/OfferContext";
import {useShopState} from "../../../contexts/ShopContext";
import { AdvancedSettings } from "../../organisms/index";
import { BannerContainer } from "../../atoms/index";
import { useEnv } from "~/contexts/EnvContext";

interface IFourthTabProps {
    saveDraft: () => void,
    publishOffer: () =>  void,
}

// Advanced Tab
export function FourthTab({ saveDraft, publishOffer }: IFourthTabProps) {
    const { offer, updateNestedAttributeOfOffer, enablePublish } = useContext(OfferContext) as OfferContent;
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
                <BannerContainer
                    title="You are using Shopify's Theme Editor"
                    tone="warning"
                >
                    <p>Please use the theme editor to place the offers where you would like it.</p><br/>
                    <p><Link
                        to={themeAppUrl}
                        target="_blank">Click here</Link> to go to the theme editor</p>
                </BannerContainer>
              )
            }

            { !isLegacy && offer.in_ajax_cart &&
              (
                <BannerContainer
                    title="You are using Shopify's Theme Editor"
                    tone={themeAppExtension?.theme_app_embed ? 'success' : 'warning'}
                >
                    {!themeAppExtension?.theme_app_embed ?
                        <>
                            <p>In order to show the offer in the Ajax Cart, you need to enable it in the Theme Editor.</p><br/>
                            <p><Link
                            to={`https://${shopSettings?.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/ajax_cart_app_block`}
                            target="_blank">Click here</Link> to go to theme editor</p>
                        </>
                    :
                        <p>Advanced settings are no longer needed for Shopify's Theme Editor. You've already enabled the app, all you need to do is publish your offer and it will appear in your Ajax cart</p>
                    }
                </BannerContainer>
              )
            }

            <AdvancedSettings />
            <div className="space-10"></div>
            <LegacyStack distribution="center">
                <ButtonGroup>
                    <Button onClick={() => saveDraft()}>Save Draft</Button>
                    <Button primary disabled={enablePublish} onClick={() => publishOffer()}>Publish</Button>
                </ButtonGroup>
            </LegacyStack>
            <div className="space-10"></div>
        </>
    );
}
