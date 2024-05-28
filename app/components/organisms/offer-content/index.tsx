import React, {useCallback, useContext} from "react";
import { Link } from '@remix-run/react';
import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import { useShopState } from "~/contexts/ShopContext";

import { Checkbox, Collapsible, Card, BlockStack, Text, TextField } from "@shopify/polaris";
import { AutopilotCheck, UpdateCheckKeysValidityFunc } from "~/types/types";

interface IOfferContentProps {
  updateCheckKeysValidity: UpdateCheckKeysValidityFunc;
  autopilotCheck: AutopilotCheck;
}

const OfferTitleDetails = ({ updateCheckKeysValidity, autopilotCheck }: IOfferContentProps) => {
    const { offer, updateOffer } = useContext(OfferContext) as OfferContent;
    const { shopSettings } = useShopState();

    const handleTitleChange = useCallback((newValue: string) => updateOffer("title", newValue), []);
    const handleTextChange = useCallback((newValue: string) => {
        updateOffer("text_a", newValue);
        if (offer.offerable_product_details.length > 0) {
            updateCheckKeysValidity("text", newValue.replace("{{ product_title }}", offer.offerable_product_details[0].title));
        } else {
            updateCheckKeysValidity("text", newValue);
        }
    }, [offer.offerable_product_details]);

    const handleAltTextChange = useCallback((newValue: string) => updateOffer("text_b", newValue), []);
    const handleBtnChange = useCallback((newValue: string) => {
        updateOffer("cta_a", newValue);
        updateCheckKeysValidity('cta', newValue);
    }, []);
    const handleAltBtnChange = useCallback((newValue: string) => updateOffer("cta_b", newValue), []);

    const handleAbChange = useCallback((newChecked: boolean) => updateOffer("uses_ab_test", newChecked), []);

    return (
        <Card>
            <BlockStack gap={"500"}>
                <Text variant="headingMd" as="h6">Text</Text>
                {(offer.id == null || offer.id != autopilotCheck?.autopilot_offer_id) && (
                    <>
                        <TextField
                            label="Offer title"
                            placeholder='Offer #1'
                            value={offer.title}
                            onChange={handleTitleChange}
                            autoComplete="off"
                            helpText="This title will only be visible to you so you can reference it internally"
                        />
                    </>
                )}
                <TextField
                    label="Offer text"
                    placeholder='Take advantage of this limited offer'
                    autoComplete="off"
                    value={offer.text_a}
                    onChange={handleTextChange}
                />
                <TextField
                    label="Button text"
                    placeholder='Add to cart'
                    value={offer.cta_a}
                    onChange={handleBtnChange}
                    autoComplete="off"
                />
                {offer.uses_ab_test && <hr className="legacy-card-hr legacy-card-hr-t20-b15" />}
                <Checkbox id={"abTesting"}
                          label="Enable A/B testing"
                          checked={offer.uses_ab_test}
                          onChange={handleAbChange}
                />
                <Collapsible
                    open={offer.uses_ab_test ?? false}
                    id="basic-collapsible"
                    transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                >
                    {!shopSettings?.has_pro_features ? (
                        <div style={{maxWidth: '476px', marginTop: '10px'}}>
                            <Text as="p" variant="headingSm" fontWeight="regular">
                                A/B testing is available on our Paid plan. Please <Link
                                to="/app/subscription">upgrade your subscription</Link> to enable it.
                            </Text>
                        </div>
                    ) : (
                        <>
                            <TextField
                                label="Alternative offer text"
                                placeholder='Take advantage of this limited offer'
                                autoComplete="off"
                                value={offer.text_b}
                                onChange={handleAltTextChange}
                            />

                            <div className="space-4" />

                            <TextField
                                label="Alternative button text"
                                placeholder='Add to cart'
                                autoComplete="off"
                                value={offer.cta_b}
                                onChange={handleAltBtnChange}
                            />
                        </>
                    )}
                    <Collapsible
                        open = {(offer.cta_b === '' && offer.text_b != '') || (offer.cta_b != '' && offer.text_b === '')}
                        transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                        expandOnPrint
                     id="sub-collapsible">
                        <br/>
                        <Text tone="critical" as={'p'}>
                            If you are A/B testing, you must have a B version of both the Offer Text and the Button Text.
                        </Text>
                    </Collapsible>
                </Collapsible>
            </BlockStack>
        </Card>
    );
}

export default OfferTitleDetails;
