import React, {useCallback, useEffect, useState, useContext} from "react";
import { OfferContent, OfferContext } from "../../../contexts/OfferContext";

import { Button, LegacyStack, Spinner } from "@shopify/polaris";

import { OfferTitleDetails, DisplayOptions, OfferProduct } from "../../organisms/index";
import { LoadingSpinner } from "../../atoms/index";
import { IAutopilotSettingsProps, Offer, ProductDetails, UpdateCheckKeysValidityFunc } from "~/types/types";

interface IFirstTabProps extends IAutopilotSettingsProps{
    updateCheckKeysValidity: UpdateCheckKeysValidityFunc,
    handleTabChange: () => void,
    initialVariants: Record<string, (string | number)[]>,
    updateInitialVariants: (value: string | string[] | Offer['included_variants'], selectedVariants?: number[]) => void,
    initialOfferableProductDetails: ProductDetails[]
    enableOrDisablePublish: (enable: boolean) => void
}

export function FirstTab(props: IFirstTabProps) {
    const { offer } = useContext(OfferContext) as OfferContent;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const publishButtonFuntional =
        props.enableOrDisablePublish &&
        useCallback((newValue) => props.enableOrDisablePublish(newValue), []);

    useEffect(() => {
        if (publishButtonFuntional) {
            publishButtonFuntional(!(offer.offerable_product_details.length > 0 && offer.title !== '' && (offer.uses_ab_test ? (offer.text_b && offer.text_b.length > 0 && offer.cta_b.length > 0) : true)))
        }
    }, [offer.offerable_product_details.length, offer.title, offer.uses_ab_test, offer.text_b, offer.cta_b]);

    return (
        <div id="first-tab-offer">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <OfferProduct
                        setIsLoading={setIsLoading}
                        autopilotCheck={props.autopilotCheck}
                        setAutopilotCheck={props.setAutopilotCheck}
                        initialVariants={props.initialVariants}
                        updateInitialVariants={props.updateInitialVariants}
                        updateCheckKeysValidity={props.updateCheckKeysValidity}
                        initialOfferableProductDetails={props.initialOfferableProductDetails}
                    />
                    <div className="space-10" />

                    <OfferTitleDetails
                        autopilotCheck={props.autopilotCheck}
                        updateCheckKeysValidity={props.updateCheckKeysValidity}
                    />
                    <div className="space-10"/>

                    <DisplayOptions />
                    <div className="space-10"/>

                    <div className="space-4"/>
                    <LegacyStack distribution="center">
                        <Button onClick={props.handleTabChange}>Continue To Placement</Button>
                    </LegacyStack>

                    <div className="space-10"></div>
                </>
            )}
        </div>
    );
}