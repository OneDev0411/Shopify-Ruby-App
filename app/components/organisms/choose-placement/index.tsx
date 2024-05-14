import {
    Button,
    Checkbox,
    Grid,
    Card,
    BlockStack,
    Modal,
    Select,
} from "@shopify/polaris";
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from "~/hooks";
import SelectProductsModal from "../../SelectProductsModal";
import { SelectCollectionsModal } from "../../SelectCollectionsModal";
import {Link} from "@remix-run/react";
import { OfferThemeOptions, OfferNewThemeOptions } from "~/shared/constants/EditOfferOptions";
import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import {useShopState} from "../../../contexts/ShopContext";
import { OfferPlacement } from "../../molecules/index.js";
import { BannerContainer } from "../../atoms/index.js";
import { AutopilotCheck, Product, Rule, ShopAndHost, ThemeSetting } from "~/types/types";
import {useEnv} from "../../../contexts/EnvContext";
interface IChoosePlacementProps {
    enableOrDisablePublish: (enable: boolean) => void,
    autopilotCheck: AutopilotCheck,
}

const ChoosePlacement = ({ enableOrDisablePublish, autopilotCheck}: IChoosePlacementProps) => {
    const { offer, updateOffer, updateNestedAttributeOfOffer } = useContext(OfferContext) as OfferContent;
    const { shopSettings, themeAppExtension } = useShopState();
    // TODO: swap into context
    const shopAndHost = useSelector<{ shopAndHost: ShopAndHost}, ShopAndHost>(state => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);

    const [selected, setSelected] = useState('cartpage');
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [defaultSetting, setDefaultSetting] = useState<boolean>(false);
    const [useTemplate, setUseTemplate] = useState<boolean>(false);
    const [multipleDefaultSettings, setMultipleDefaultSettings] = useState<boolean>(false);

    const [insertedImage1, setInsertedImage1] = useState<string>("");
    const [insertedImage2, setInsertedImage2] = useState<string>("");
    const [insertedImage3, setInsertedImage3] = useState<string>("");

    const [openBanner, setOpenBanner] = useState<boolean>(false);

    const [shopifyThemeName, setShopifyThemeName] = useState<string>("");
    const [themeTemplateData, setThemeTemplateData] = useState<ThemeSetting[]>([]);
    // TODO: double check
    const [templateImagesURL, setTemplateImagesURL] = useState<any>({});
    const [storedThemeNames, setStoredThemeName] = useState<string[]>([]);
    const env = useEnv();
    const isLegacy = themeAppExtension?.theme_version !== '2.0' || env?.ENABLE_THEME_APP_EXTENSION?.toLowerCase() !== 'true';

    useEffect(() => {
        fetch(`/api/v2/merchant/active_theme_for_dafault_template?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then( (response) => { return response.json() })
            .then( (data) => {
                setStoredThemeName(data.theme_names_having_data);
                if(data.themeExist) {
                    setShopifyThemeName(data.shopify_theme_name);
                    setThemeTemplateData(data.templatesOfCurrentTheme);
                    data.templatesOfCurrentTheme.forEach(function(value, index) {
                        if(value.page_type == "cart") {
                            setTemplateImagesURL(previousState => {
                                return { ...previousState, ["cart_page_image_".concat(value.position)]: value.image_url};
                            });
                        }
                        else if(value.page_type == "product") {
                            setTemplateImagesURL(previousState => {
                                return { ...previousState, ["product_page_image_".concat(value.position)]: value.image_url};
                            });
                        }
                        else if(value.page_type == "ajax") {
                            setTemplateImagesURL(previousState => {
                                return { ...previousState, ["ajax_cart_image_".concat(value.position)]: value.image_url};      
                            });
                        }
                    });
                }
                else {
                    setShopifyThemeName("");
                }
            })
            .catch((error) => {
                console.log("# Error updateProducts > ", JSON.stringify(error));
            })


        if(offer.in_product_page && offer.in_cart_page) {
            setSelected("cartpageproductpage");
        }
        else if (offer.in_ajax_cart && offer.in_cart_page) {
            if (isLegacy) setSelected("ajaxcartpage");
            else setSelected("cartpage");
        }
        else if (offer.in_cart_page) {
            setSelected("cartpage");
        }
        else if (offer.in_product_page) {
            setSelected("productpage");
        }
        else if (offer.in_ajax_cart) {
            setSelected("ajax");
        }
        else {
            setSelected("cartpage");
        }
    }, []);


    //Checked to see if offer is displayed in multiple pages of the app.
    useEffect(() => {
        setDefaultSetting(false);
        setUseTemplate(false);
        if(offer.in_product_page && offer.in_cart_page) {
            setMultipleDefaultSettings(true);
        }
        else if(offer.in_ajax_cart && offer.in_cart_page) {
            setMultipleDefaultSettings(true);
        }
        else if (offer.in_cart_page) {
            setMultipleDefaultSettings(false);
            if(offer.placement_setting && offer.placement_setting?.default_cart_page) {
                setDefaultSetting(true);
            }
            else if(offer.placement_setting && !offer.placement_setting?.default_cart_page) {
                setUseTemplate(true);
                setInsertedImage1(templateImagesURL.cart_page_image_1);
                setInsertedImage2(templateImagesURL.cart_page_image_2);
                setInsertedImage3(templateImagesURL.cart_page_image_3);
            }
        }
        else if (offer.in_product_page) {
            setMultipleDefaultSettings(false);
            if(offer.placement_setting && offer.placement_setting?.default_product_page) {
                setDefaultSetting(true);
            }
            else if(offer.placement_setting && !offer.placement_setting?.default_product_page) {
                setUseTemplate(true);
                setInsertedImage1(templateImagesURL.product_page_image_1);
                setInsertedImage2(templateImagesURL.product_page_image_2);
                setInsertedImage3(templateImagesURL.product_page_image_3);
            }
        }
        else if (offer.in_ajax_cart) {
            setMultipleDefaultSettings(false);
            if(offer.placement_setting && offer.placement_setting?.default_ajax_cart) {
                setDefaultSetting(true);
            }
            else if(offer.placement_setting && !offer.placement_setting?.default_ajax_cart) {
                setUseTemplate(true);
                setInsertedImage1(templateImagesURL.ajax_cart_image_1);
                setInsertedImage2(templateImagesURL.ajax_cart_image_2);
                setInsertedImage3(templateImagesURL.ajax_cart_image_3);
            }
        }
    }, [offer.in_cart_page, offer.in_ajax_cart, offer.in_product_page]);

    useEffect(() => {
        if(storedThemeNames?.length != 0 && shopifyThemeName != null)
        {
            setOpenBanner(!storedThemeNames?.includes(shopifyThemeName));
        }
    }, [storedThemeNames, shopifyThemeName])


    useEffect(() => {
        if(storedThemeNames?.length != 0 && shopifyThemeName != null && !storedThemeNames?.includes(shopifyThemeName)) {
            if (isLegacy) {
                updateNestedAttributeOfOffer(true, "advanced_placement_setting", "advanced_placement_setting_enabled");
            }
            else {
                updateNestedAttributeOfOffer(false, "advanced_placement_setting", "advanced_placement_setting_enabled");
            }
        }
    }, [storedThemeNames, shopifyThemeName])


    const handleSelectChange = useCallback((value: string) => {
        if (value === "cartpage") {
            updateOffer("in_cart_page", true);
            updateOffer("in_product_page", false);
            updateOffer("in_ajax_cart", false);
        }
        else if (value === "productpage") {
            updateOffer("in_cart_page", false);
            updateOffer("in_product_page", true);
            updateOffer("in_ajax_cart", false);
        }
        else if (value === "cartpageproductpage") {
            updateOffer("in_cart_page", true);
            updateOffer("in_product_page", true);
            updateOffer("in_ajax_cart", false);
        }
        else if (value === "ajax") {
            updateOffer("in_cart_page", false);
            updateOffer("in_product_page", false);
            updateOffer("in_ajax_cart", true);
        }
        else if (value === "ajaxcartpage") {
            updateOffer("in_cart_page", true);
            updateOffer("in_product_page", false);
            updateOffer("in_ajax_cart", true);
        }
        setSelected(value);
    }, []);

    const handleDefaultSettingChange = useCallback((value: boolean, selectedPage: string) => {
        if(value) {
            enableOrDisablePublish(!value);
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page",);
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(offer.in_cart_page) {
                updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
            else if(offer.in_product_page) {
                updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
            else if(offer.in_ajax_cart) {
                updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                setDefaultSetting(value);
                setUseTemplate(!value);
            }
        }
        else {
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(offer.in_cart_page) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                setDefaultSetting(value);
            }
            else if(offer.in_product_page) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                setDefaultSetting(value);
            }
            else if(offer.in_ajax_cart) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                setDefaultSetting(value);
            }
        }
    }, []);


    const handleUseTemplateChange = useCallback((value: boolean, selectedPage: string) => {
        if(value) {
            enableOrDisablePublish(value);
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_product_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(offer.in_cart_page) {
                updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(templateImagesURL.cart_page_image_1);
                setInsertedImage2(templateImagesURL.cart_page_image_2);
                setInsertedImage3(templateImagesURL.cart_page_image_3);
            }
            else if(offer.in_product_page) {
                updateNestedAttributeOfOffer(!value, "placement_setting", "default_product_page");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(templateImagesURL.product_page_image_1);
                setInsertedImage2(templateImagesURL.product_page_image_2);
                setInsertedImage3(templateImagesURL.product_page_image_3);
            }
            else if(offer.in_ajax_cart) {
                updateNestedAttributeOfOffer(!value, "placement_setting", "default_ajax_cart");
                setDefaultSetting(!value);
                setUseTemplate(value);
                setInsertedImage1(templateImagesURL.ajax_cart_image_1);
                setInsertedImage2(templateImagesURL.ajax_cart_image_2);
                setInsertedImage3(templateImagesURL.ajax_cart_image_3);

            }
        }
        else {
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(offer.in_cart_page) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                setUseTemplate(value);
            }
            else if(offer.in_product_page) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                setUseTemplate(value);
            }
            else if(offer.in_ajax_cart) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                setUseTemplate(value);
            }
        }
    }, []);

    const handleDefaultSettingSecondChange = useCallback((value: boolean, selectedPage: string) => {
        if(value) {
            enableOrDisablePublish(!value);
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(offer.in_cart_page) {
                updateNestedAttributeOfOffer(null, "placement_setting", "template_cart_id");
                updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
            }
            else if(offer.in_product_page) {
                updateNestedAttributeOfOffer(null, "placement_setting", "template_product_id");
                updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
            }
            else if(offer.in_ajax_cart) {
                updateNestedAttributeOfOffer(null, "placement_setting", "template_ajax_id");
                updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
            }
        }
        else {
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "product") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
                }
                else if(selectedPage == "ajax") {
                    updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
                }
            }
            else if(offer.in_cart_page) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_cart_page");
            }
            else if(offer.in_product_page) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_product_page");
            }
            else if(offer.in_ajax_cart) {
                updateNestedAttributeOfOffer(value, "placement_setting", "default_ajax_cart");
            }
        }
    }, []);

    const handleUseTemplateSecondChange = useCallback((value: boolean, selectedPage: string) => {
        if(value) {
            enableOrDisablePublish(value);
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
        }
        else {
            if(offer.in_product_page && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
            else if(offer.in_ajax_cart && offer.in_cart_page) {
                if(selectedPage == "cart") {
                    updateNestedAttributeOfOffer(!value, "placement_setting", "default_cart_page");
                }
            }
        }
    }, []);


    // Called on clickedImages that opened after checking Use Template checkbox
    const handleImageClick = useCallback((pageName: string, clickedImageNum: number) => {
        enableOrDisablePublish(false);
        if(pageName === 'product_page') {
            themeTemplateData.forEach(function(record){
                if(record.page_type == 'product' && record.position == clickedImageNum) {
                    updateNestedAttributeOfOffer(record.id, "placement_setting", "template_product_id");
                }
            });
        }
        else if(pageName === 'cart_page') {
            themeTemplateData.forEach(function(record){
                if(record.page_type == 'cart' && record.position == clickedImageNum) {
                    updateNestedAttributeOfOffer(record.id, "placement_setting", "template_cart_id");
                }
            });
        }
        else if(pageName === 'ajax_cart') {
            themeTemplateData.forEach(function(record){
                if(record.page_type == 'ajax' && record.position == clickedImageNum) {
                    updateNestedAttributeOfOffer(record.id, "placement_setting", "template_ajax_id");
                }
            });
        }
        else if(offer.in_product_page) {
            themeTemplateData.forEach(function(record){
                if(record.page_type == 'product' && record.position == clickedImageNum) {
                    updateNestedAttributeOfOffer(record.id, "placement_setting", "template_product_id");
                }
            });
        }
        else if(offer.in_cart_page) {
            themeTemplateData.forEach(function(record){
                if(record.page_type == 'cart' && record.position == clickedImageNum) {
                    updateNestedAttributeOfOffer(record.id, "placement_setting", "template_cart_id");
                }
            });
        }
        else if(offer.in_ajax_cart) {
            themeTemplateData.forEach(function(record){
                if(record.page_type == 'ajax' && record.position == clickedImageNum) {
                    updateNestedAttributeOfOffer(record.id, "placement_setting", "template_ajax_id");
                }
            });
        }
    }, []);

    //Modal controllers
    const [productModal, setProductModal] = useState<boolean>(false);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const handleProductsModal = () => {
        setProductModal(prev => !prev);
    };

    async function handleSelectProductsModal() {
        if(offer.id!=null){
            await getSelectedItems('product');
        }
        handleProductsModal();
    }

    const [collectionModal, setCollectionModal] = useState<boolean>(false);
    // TODO: Cross check product and collection
    const [selectedCollections, setSelectedCollections] = useState<Product[]>([]);

    const handleCollectionsModal = useCallback(() => {
        setCollectionModal(!collectionModal);
    }, [collectionModal]);

    const handleEnableAdvancedSetting = useCallback((newChecked: boolean) => {
        if(storedThemeNames?.includes(shopifyThemeName)) {
            updateNestedAttributeOfOffer(newChecked, "advanced_placement_setting", "advanced_placement_setting_enabled");
        }
        else {
            updateNestedAttributeOfOffer(true, "advanced_placement_setting", "advanced_placement_setting_enabled");
        }
    }, [storedThemeNames, shopifyThemeName]);

    async function handleSelectCollectionsModal() {
        if(offer.id!=null){
            await getSelectedItems('collection');
        }
        handleCollectionsModal();
    }
    const modalColl = useRef(null);

    useEffect(() => {
        if (offer.in_product_page && offer.in_cart_page) {
            setSelected("cartpageproductpage");
        }
        else if (offer.in_ajax_cart && offer.in_cart_page) {
            setSelected("ajaxcartpage");
        }
        else if (offer.in_cart_page) {
            setSelected("cartpage");
        }
        else if (offer.in_product_page) {
            setSelected("productpage");
        }
        else if (offer.in_ajax_cart) {
            setSelected("ajax");
        }
        else {
            setSelected("cartpage");
        }
    }, []);

    function getSelectedItems(item_type: string) {
        return fetch(`/api/v2/merchant/offer/shopify_ids_from_rule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ offer: { offer_id: offer.id }, shop: shopAndHost.shop, rule_selector: 'on_product_this_product_or_in_collection', item_type: item_type }),
        })
            .then((response) => { return response.json() })
            .then(data => {
                const offerRulesIds: string[] = [];
                const offerRules: Rule[] = offer.rules_json as Rule[];
                offerRules.forEach ((value: Rule) => {
                    offerRulesIds.push(String(value.item_shopify_id));
                });
                setSelectedItems(offerRulesIds);
                return data
            })
    }

    function addProductsRule() {
        if (Array.isArray(selectedProducts) && offer.rules_json) {
            var offerRules = [...offer.rules_json];
            for (var i = 0; i < selectedProducts.length; i++) {
                if(selectedProducts[i].id && !offerRules.some(hash => hash?.item_shopify_id == selectedProducts[i].id)){
                    const offer_rule = { quantity: null, rule_selector: "on_product_this_product_or_in_collection", item_type: "product", item_shopify_id: selectedProducts[i].id, item_name: selectedProducts[i].title }
                    offer_rule && offerRules.push(offer_rule);
                }
            }
            if(selectedProducts.length == 0) {
                var tempOfferRules = offerRules;
                tempOfferRules.forEach ((value) => {
                    if(!selectedItems.includes(String(value.item_shopify_id))) {
                        offerRules = offerRules.filter(item => item.item_shopify_id !== value.item_shopify_id);
                    }
                });
            }
            updateOffer('rules_json', offerRules);
            updateOffer('ruleset_type', "or");
        }
        setSelectedProducts([]);
        handleProductsModal();
    }

    function addCollectionsRule() {
        const offerRules = offer.rules_json ? [...offer.rules_json] : [];
        if (Array.isArray(selectedCollections)) {
            for (let i = 0; i < selectedCollections.length; i++) {
                const offer_rule = { quantity: null, rule_selector: "on_product_this_product_or_in_collection", item_type: "collection", item_shopify_id: selectedCollections[i].id, item_name: selectedCollections[i].title }
                offerRules?.push(offer_rule);
            }
            updateOffer('rules_json', offerRules);
            updateOffer('ruleset_type', "or");
        }
        setSelectedCollections([]);
        handleCollectionsModal();
    }

    return (
        <>
            {(!storedThemeNames?.includes(shopifyThemeName) && openBanner && isLegacy) && (
                <BannerContainer
                    title="Unsupported Theme Detected"
                    onDismiss={() => {
                        setOpenBanner(!openBanner);
                    }}
                    tone="warning"
                >
                    <p>Templates and default settings are unavailable for your theme.</p><br/>
                    <p>Please follow <Link
                        to="https://help.incartupsell.com/en/articles/8558593-how-to-manually-setup-an-offer-new-ui"
                        target="_blank">this guide</Link> to add your selectors and actions in the Advanced Tab or
                        contact support for assistance. We will be adding support for more themes regularly!</p>
                </BannerContainer>
            )}

            {(selected === "ajax" && !themeAppExtension?.theme_app_embed && !isLegacy) && (
                <BannerContainer
                    title="You are using Shopify's Theme Editor"
                    tone="warning">
                    <p>In order to show the offer in the Ajax Cart, you need to enable it in the Theme Editor.</p><br/>
                    <p><Link
                        to={`https://${shopSettings?.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${import.meta.env.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/ajax_cart_app_block`}
                        target="_blank">Click here</Link> to go to the theme editor</p>
                </BannerContainer>
            )}

            <Card title="Choose placement" sectioned>
                <p style={{color: '#6D7175', marginTop: '-20px', marginBottom: '23px'}}>Where would you like your offer
                    to appear?</p>

                <BlockStack spacing="loose" vertical>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            {/*Select requires a styled dropdown*/}
                            {!isLegacy ?
                                <Select
                                    options={OfferNewThemeOptions}
                                    onChange={handleSelectChange}
                                    value={selected}
                                    label={"OfferNewThemeOptions"}
                                    labelHidden
                                />
                                :
                                <Select
                                    options={OfferThemeOptions}
                                    onChange={handleSelectChange}
                                    value={selected}
                                    label={"OfferThemeOptions"}
                                    labelHidden
                                />
                            }
                        </Grid.Cell>
                        {/*To be removed */}
                        {isLegacy && <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                            <Checkbox
                                label="Enable Advanced Setting"
                                checked={offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                onChange={handleEnableAdvancedSetting}
                            />
                        </Grid.Cell>}
                    </Grid>
                    {((offer.id == null || offer.id != autopilotCheck?.autopilot_offer_id) && isLegacy) && (
                        <>
                            <div style={{marginBottom: '20px', marginTop: '16px'}}>
                                <Button onClick={handleSelectProductsModal}>Select Product</Button>
                            </div>

                            <Button onClick={handleSelectCollectionsModal} >Select Collection</Button>
                        </>
                    )}
                    <Modal
                        open={productModal}
                        onClose={handleProductsModal}
                        title="Select products from your store"
                        primaryAction={{
                            content: 'Save',
                            onAction: () => {
                                addProductsRule();
                            },
                        }}>
                        <Modal.Section>
                            <SelectProductsModal selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                                                 offer={offer} shopSettings={shopSettings}
                                                 selectedProducts={selectedProducts}
                                                 setSelectedProducts={setSelectedProducts}/>
                        </Modal.Section>
                    </Modal>
                    <Modal
                        open={collectionModal}
                        onClose={handleCollectionsModal}
                        title="Select collections from your store"
                        primaryAction={{
                            content: 'Save',
                            onAction: () => {
                                addCollectionsRule();
                            },
                        }}>
                        <Modal.Section>
                            <SelectCollectionsModal selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                                                    offer={offer} shopSettings={shopSettings}
                                                    selectedCollections={selectedCollections}
                                                    setSelectedCollections={setSelectedCollections}/>
                        </Modal.Section>
                    </Modal>
                </BlockStack>
                { isLegacy &&
                    (multipleDefaultSettings ? (
                        <>
                            {offer.in_product_page && offer.in_cart_page ? (
                                <OfferPlacement
                                    defalutLabel="Use default settings for Product Page"
                                    templateLabel="Use Template for Product Page"
                                    isDefault={offer.placement_setting?.default_product_page}
                                    radioName="prod-settings"
                                    onChangeDefault={(event) => handleDefaultSettingChange(event, "product")}
                                    onChangeTemplate={(event) => handleUseTemplateChange(event, "product")}
                                    disabled={offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                    images={[
                                        templateImagesURL.product_page_image_1,
                                        templateImagesURL.product_page_image_2,
                                        templateImagesURL.product_page_image_3,
                                    ]}
                                    onClickImage={(position) => handleImageClick("product_page", position)}
                                    placementPosition={themeTemplateData?.find((item) => item["id"] === offer.placement_setting?.template_product_id)?.position}
                                    isTemplate
                                    showImages/>
                            ) : (
                                <OfferPlacement
                                    defalutLabel="Use default settings for Ajax Cart"
                                    templateLabel="Use Template for Ajax Cart"
                                    isDefault={offer.placement_setting?.default_ajax_cart}
                                    radioName="ajax-cart-settings"
                                    onChangeDefault={(event) => handleDefaultSettingChange(event, "ajax")}
                                    onChangeTemplate={(event) => handleUseTemplateChange(event, "ajax")}
                                    disabled={offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                    images={[
                                        templateImagesURL.ajax_cart_image_1,
                                        templateImagesURL.ajax_cart_image_2,
                                        templateImagesURL.ajax_cart_image_3,
                                    ]}
                                    showImages={shopSettings?.default_template_settings?.templateForAjaxCart}
                                    onClickImage={(position) => handleImageClick("ajax_cart", position)}
                                    placementPosition={themeTemplateData?.find((item) => item["id"] === offer.placement_setting?.template_ajax_id)?.position}
                                    isTemplate
                                />
                            )}
                            <OfferPlacement
                                defalutLabel="Use default settings for Cart Page"
                                templateLabel="Use Template for Cart Page"
                                isDefault={offer.placement_setting?.default_cart_page}
                                radioName="cart-settings"
                                onChangeDefault={(event) => handleDefaultSettingSecondChange(event, "cart")}
                                onChangeTemplate={(event) => handleUseTemplateSecondChange(event, "cart")}
                                disabled={offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                                images={[
                                    templateImagesURL.cart_page_image_1,
                                    templateImagesURL.cart_page_image_2,
                                    templateImagesURL.cart_page_image_3,
                                ]}
                                onClickImage={(position) => handleImageClick("cart_page", position)}
                                placementPosition={themeTemplateData?.find((item) => item["id"] === offer.placement_setting?.template_cart_id)?.position}
                                isTemplate
                                showImages/>
                        </>
                    ) : (
                        <OfferPlacement
                            defalutLabel="Use default settings"
                            templateLabel="Use Template"
                            isDefault={defaultSetting}
                            isTemplate={useTemplate}
                            radioName="product-settings"
                            onChangeDefault={(event: boolean) =>handleDefaultSettingChange(event, "")}
                            onChangeTemplate={(event: boolean) => handleUseTemplateChange(event, "")}
                            disabled={offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                            images={[insertedImage1, insertedImage2, insertedImage3]}
                            showImages={useTemplate}
                            onClickImage={(position: number) => handleImageClick("", position)}
                            placementPosition={offer.in_cart_page ? themeTemplateData?.find((item) => item["id"] === offer.placement_setting?.template_cart_id)?.position : offer.in_product_page ? themeTemplateData?.find((item) => item["id"] === offer.placement_setting?.template_product_id)?.position : offer.in_ajax_cart ? themeTemplateData?.find((item) => item["id"] === offer.placement_setting?.template_ajax_id)?.position : 0}
                        />
                    ))
                }

            </Card>
        </>
    );
}

export default ChoosePlacement;
