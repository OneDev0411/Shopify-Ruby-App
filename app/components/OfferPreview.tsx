import {useState, useEffect, useContext, SetStateAction} from "react";
import { Card, TextContainer, SkeletonBodyText } from '@shopify/polaris';
import Compact from './layouts/template_single_compact';
import Stack from './layouts/template_multi_stack';
import Carousel from './layouts/template_multi_carousel';
import Flex from './layouts/template_multi_flex';
import { useAuthenticatedFetch } from "../hooks/index.js";
import { useSelector } from "react-redux";
import ErrorPage from "./ErrorPage";
import { OfferContent, OfferContext } from "../contexts/OfferContext";
import { useShopState } from "../contexts/ShopContext";
import { IRootState } from "~/store/store";

interface IOfferPreviewProps {
	previewMode?: boolean,
	updatePreviousAppOffer?: boolean
}

export function OfferPreview({ previewMode = false, updatePreviousAppOffer }: IOfferPreviewProps) {
	const { offer, updateOffer, updateNestedAttributeOfOffer, updateCheckKeysValidity } = useContext(OfferContext) as OfferContent;
	const { shopSettings } = useShopState();
	const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
	const [error, setError] = useState<Error | null>(null);
	const [carouselLoading, setCarouselLoading] = useState<boolean>(false);

	const fetch = useAuthenticatedFetch(shopAndHost.host);

	useEffect(() => {
		setCarouselLoading(true);
		combinedCss();
		setTimeout(function(){ setCarouselLoading(false) }, 500);

		if (!previewMode) {
			fetch(`/api/v2/merchant/offer_settings`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({offer: {include_sample_products: 0}, shop: shopAndHost.shop}),
			})
				.then((response) => {
					return response.json()
				})
				.then((data) => {
					let offerSettings = {...data};

					if(Object.keys(offer.css_options).length == 0) {
						updateOffer("css_options", shopSettings?.css_options)
					}
					if(!offer.placement_setting) {
						updateNestedAttributeOfOffer(true, "placement_setting", "default_product_page");
						updateNestedAttributeOfOffer(true, "placement_setting", "default_cart_page");
						updateNestedAttributeOfOffer(true, "placement_setting", "default_ajax_cart");
					}
					if(!offer.advanced_placement_setting) {
						updateNestedAttributeOfOffer(offerSettings?.product_page_dom_selector || "[class*='description']", "advanced_placement_setting",  "custom_product_page_dom_selector")
						updateNestedAttributeOfOffer(offerSettings?.product_page_dom_action ||'after', "advanced_placement_setting",  "custom_product_page_dom_action")
						updateNestedAttributeOfOffer(offerSettings?.cart_page_dom_selector || "form[action^='/cart']", "advanced_placement_setting",  "custom_cart_page_dom_selector")
						updateNestedAttributeOfOffer(offerSettings?.cart_page_dom_action || 'prepend', "advanced_placement_setting",  "custom_cart_page_dom_action")
						updateNestedAttributeOfOffer(offerSettings?.ajax_dom_selector || ".ajaxcart__row:first", "advanced_placement_setting",  "custom_ajax_dom_selector")
						updateNestedAttributeOfOffer(offerSettings?.ajax_dom_action || 'prepend', "advanced_placement_setting",  "custom_ajax_dom_action")
					}
				})
				.catch((error) => {
					setError(error)
					console.log("Error > ", error);
				})
		}
	}, [offer, updatePreviousAppOffer]);

	// Called everytime when any attribute in shop changes.
	function combinedCss () {
		if(offer?.css_options?.main?.marginTop && parseInt(offer?.css_options?.main?.marginTop) > 0) {
			updateCheckKeysValidity("mainMarginTop", true );
		}
		else {
			updateCheckKeysValidity("mainMarginTop", false);
		}

		if(offer?.css_options?.main?.marginBottom && parseInt(offer?.css_options?.main?.marginBottom) > 0) {
			updateCheckKeysValidity("mainMarginBottom", true);
		}
		else {
			updateCheckKeysValidity("mainMarginbottom", false);
		}

		if(offer?.css_options?.main?.borderWidth && parseInt(offer?.css_options?.main?.borderWidth) > 0) {
			updateCheckKeysValidity("mainBorderWidth", true);
		}
		else {
			updateCheckKeysValidity("mainBorderWidth", false);
		}

		if(offer?.css_options?.main?.borderRadius && parseInt(offer?.css_options?.main?.borderRadius) != 4) {
			updateCheckKeysValidity("mainBorderRadius", true);
		}
		else {
			updateCheckKeysValidity("mainBorderRadius", false);
		}

		if(offer?.css_options?.button?.borderRadius && parseInt(offer?.css_options?.button?.borderRadius) != 4) {
			updateCheckKeysValidity("buttonBorderRadius", true);
		}
		else {
			updateCheckKeysValidity("buttonBorderRadius", false);
		}

		if(offer?.css_options?.button?.fontWeight && offer?.css_options?.button?.fontWeight != "bold") {
			updateCheckKeysValidity("buttonFontWeight", true);
		}
		else {
			updateCheckKeysValidity("buttonFontWeight", false);
		}

		if(offer?.css_options?.button?.fontFamily && (offer?.css_options?.button?.fontFamily != "inherit" && offer?.css_options?.button?.fontFamily != "")) {
			updateCheckKeysValidity("buttonFontFamily", true);
		}
		else {
			updateCheckKeysValidity("buttonFontFamily", false);
		}

		if(offer?.css_options?.button?.fontSize && parseInt(offer?.css_options?.button?.fontSize) > 0) {
			updateCheckKeysValidity("buttonFontSize", true);
		}
		else {
			updateCheckKeysValidity("buttonFontSize", false);
		}

		if(offer?.css_options?.button?.width && (offer?.css_options?.button?.width != "auto" && offer?.css_options?.button?.width != "")) {
			updateCheckKeysValidity("buttonWidth", true);
		}
		else {
			updateCheckKeysValidity("buttonWidth", false);
		}

		if(offer?.css_options?.button?.textTransform && offer?.css_options?.button?.textTransform != "inherit") {
			updateCheckKeysValidity("buttonTextTransform", true);
		}
		else {
			updateCheckKeysValidity("buttonTextTransform", false);
		}

		if(offer?.css_options?.button?.letterSpacing && offer?.css_options?.button?.letterSpacing != "0") {
			updateCheckKeysValidity("buttonLetterSpacing", true);
		}
		else {
			updateCheckKeysValidity("buttonLetterSpacing", false);
		}

		if(offer?.css_options?.text?.fontWeight != "bold") {
			updateCheckKeysValidity("textFontWeight", true);
		}
		else {
			updateCheckKeysValidity("textFontWeight", false);
		}

		if(offer?.css_options?.text?.fontFamily != "inherit") {
			updateCheckKeysValidity("textFontFamily", true);
		}
		else {
			updateCheckKeysValidity("textFontFamily", false);
		}

		if(offer?.css_options?.text?.fontSize != "16px") {
			updateCheckKeysValidity("textFontSize", true);
		}
		else {
			updateCheckKeysValidity("textFontSize", false);
		}

		if(offer?.css_options?.button?.marginTop != "0px" ||
			offer?.css_options?.button?.marginRight != "0px" ||
        	offer?.css_options?.button?.marginBottom != "5px" ||
        	offer?.css_options?.button?.marginLeft != "0px") {
			updateCheckKeysValidity("buttonMargin", true);
		}
		else {
			updateCheckKeysValidity("buttonMargin", false);
		}

		if(offer?.css_options?.button?.paddingTop != "6px" ||
			offer?.css_options?.button?.paddingRight != "10px" ||
        	offer?.css_options?.button?.paddingBottom != "6px" ||
        	offer?.css_options?.button?.paddingLeft != "10px") {
			updateCheckKeysValidity("buttonPadding", true);
		}
		else {
			updateCheckKeysValidity("buttonPadding", false);
		}

		if(offer?.selectedView == "mobile") {
			updateCheckKeysValidity("mobileViewWidth", true);
			updateCheckKeysValidity("mainMarginTop", false);
			updateCheckKeysValidity("mainMarginBottom", false);
		}
		else {
			updateCheckKeysValidity("mobileViewWidth", false);
		}

		if(offer?.css_options?.button?.borderWidth && parseInt(offer?.css_options?.button?.borderWidth) > 0) {
			updateCheckKeysValidity("buttonBorderWidth", true);
		}
		else {
			updateCheckKeysValidity("buttonBorderWidth", false);
		}
	}

	if (error) { return <ErrorPage />; }

	return(
		<div>
			{
				offer.multi_layout == "compact" ? (
					<Compact />
				) : offer.multi_layout == "stack" ? (
					<Stack />
				) : offer.multi_layout == "carousel" ? (
					carouselLoading ? (
						<Card>
							<TextContainer>
								<SkeletonBodyText lines={6} />
							</TextContainer>
						</Card>
					) : (
						<Carousel />
					)
				) : offer.multi_layout == "flex" ? (
					<Flex />
				) : (
					<div></div>
				)
			}
		</div>
	);
};
