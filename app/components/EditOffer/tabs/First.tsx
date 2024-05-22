import { useEffect, useState, useContext} from "react";
import { OfferContent, OfferContext } from "../../../contexts/OfferContext";

import { Button, LegacyStack } from "@shopify/polaris";

import { OfferTitleDetails, DisplayOptions, OfferProduct } from "../../organisms/index";
import { LoadingSpinner } from "../../atoms/index";

interface IFirstTabProps {
    handleTabChange: () => void,
}

export function FirstTab({ handleTabChange }: IFirstTabProps) {
    const { offer, setEnablePublish } = useContext(OfferContext) as OfferContent;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const isPublishEnabled = !(offer.offerable_product_details.length > 0 && offer.title !== ''
                                        && (offer.uses_ab_test ? (offer.text_b && offer.text_b.length > 0 && offer.cta_b.length > 0) : true))
        setEnablePublish(isPublishEnabled)
    }, [offer.offerable_product_details.length, offer.title, offer.uses_ab_test, offer.text_b, offer.cta_b]);

    return (
        <div id="first-tab-offer">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <OfferProduct
                        setIsLoading={setIsLoading}
                    />
                    <div className="space-10" />

                    <OfferTitleDetails />
                    <div className="space-10"/>

                    <DisplayOptions />
                    <div className="space-10"/>

                    <div className="space-4"/>
                    <LegacyStack distribution="center">
                        <Button onClick={handleTabChange}>Continue To Placement</Button>
                    </LegacyStack>

                    <div className="space-10"></div>
                </>
            )}
        </div>
    );
}
