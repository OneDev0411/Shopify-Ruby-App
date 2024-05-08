import React, {useCallback, useContext} from "react";
import { Link } from '@remix-run/react';
import { useSelector } from 'react-redux';
import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import { useShopState } from "~/contexts/ShopContext";

import { Checkbox, LegacyCard, BlockStack, TextField } from "@shopify/polaris";
import {ShopAndHost} from "~/types/global";

const DisplayOptions = () => {
    const { offer, updateOffer } = useContext(OfferContext) as OfferContent;
    const { shopSettings } = useShopState();
    const shopAndHost = useSelector<{ shopAndHost: ShopAndHost}, ShopAndHost>(state => state.shopAndHost);

    const handleImageChange = useCallback((newChecked: boolean) => updateOffer("show_product_image", !newChecked), []);
    const handlePriceChange = useCallback((newChecked: boolean) => updateOffer("show_product_price", !newChecked), []);
    const handleCompareChange = useCallback((newChecked: boolean) => updateOffer("show_compare_at_price", !newChecked), []);
    const handleProductPageChange = useCallback((newChecked: boolean) => updateOffer("link_to_product", !newChecked), []);
    const handleQtySelectorChange = useCallback((newChecked: boolean) => updateOffer("show_quantity_selector", !newChecked), []);
    const handleDiscountChange = useCallback((newChecked: boolean) => {
        if (newChecked) {
            updateOffer("discount_target_type", "code");
        } else {
            updateOffer("discount_target_type", "none");
        }
    }, []);
    const handleDiscountCodeChange = useCallback((value: string) => updateOffer("discount_code", value), []);
    const handleCustomTextChange = useCallback((newChecked: boolean) => updateOffer("show_custom_field", newChecked), []);
    const handleShowNoThanksChange = useCallback((newChecked: boolean) => updateOffer("show_nothanks", !newChecked), []);
    const handleRedirectedToProductChange = useCallback((newChecked: boolean) => updateOffer("redirect_to_product", newChecked), []);

    return (
        <LegacyCard title="Display options" sectioned>
            <BlockStack spacing="baseTight" vertical>
                <Checkbox id={"removeImg"}
                          checked={!offer.show_product_image}
                          onChange={handleImageChange}
                          label="Remove product image"
                />
                <Checkbox id={"removePrice"}
                          checked={!offer.show_product_price}
                          onChange={handlePriceChange}
                          label="Remove price"
                />
                <Checkbox id={"removeComparePrice"}
                          checked={!offer.show_compare_at_price}
                          onChange={handleCompareChange}
                          label="Remove compare at price"
                />
                <Checkbox id={"removeProductPage"}
                          checked={!offer.link_to_product}
                          onChange={handleProductPageChange}
                          label="Remove link to product page"
                />
                <Checkbox id={"autoDiscount"}
                          label="Automatically apply discount code"
                          checked={offer.discount_target_type == "code"}
                          onChange={handleDiscountChange}
                />
                {offer.discount_target_type == "code" && (
                    <div>
                        <TextField
                            label="Discount Code"
                            value={offer.discount_code}
                            onChange={handleDiscountCodeChange}
                            autoComplete="off"
                        />
                        <p>Make sure you have already set up this discount code in your <Link
                            to={`https://admin.shopify.com/store/${shopAndHost.shop.replace(/\.myshopify\.com$/, '')}/discounts`}
                            target="blank">discount code</Link> section.
                            The discount will apply automatically at checkout
                        </p>
                    </div>
                )}
                <Checkbox id={"removeQtySelector"}
                          checked={!offer.show_quantity_selector}
                          onChange={handleQtySelectorChange}
                          label="Remove quantity selector"
                />
                <Checkbox id={"addCustomtext"}
                          checked={offer.show_custom_field}
                          onChange={handleCustomTextChange}
                          label="Add custom textbox"
                />
                <Checkbox id={"showNoThanks"}
                          checked={!offer.show_nothanks}
                          onChange={handleShowNoThanksChange}
                          label="Customer can't dismiss offer"
                />
                {shopSettings.has_redirect_to_product == true && (
                    <Checkbox id={"redirectToProduct"}
                              checked={offer.redirect_to_product}
                              onChange={handleRedirectedToProductChange}
                              label="Offer button sends shopper to product page instead of adding to the cart (not recommended)"
                    />
                )}
            </BlockStack>
        </LegacyCard>
    );
}

export default DisplayOptions;
