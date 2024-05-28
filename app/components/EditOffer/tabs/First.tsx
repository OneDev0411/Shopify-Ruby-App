import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "@remix-run/react";
import {useSelector} from 'react-redux';

import {LoadingSpinner} from "../../atoms/index";
import {DisplayOptions, OfferProduct, OfferTitleDetails} from "../../organisms/index";
import {IAutopilotSettingsProps, Offer, ProductDetails, UpdateCheckKeysValidityFunc} from "~/types/types";

import {OfferContent, OfferContext} from "../../../contexts/OfferContext";
import {useShopState} from "../../../contexts/ShopContext";

import {useAuthenticatedFetch} from "../../../hooks";

import {BlockStack, Button} from "@shopify/polaris";

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
                    <BlockStack gap={"500"}>
                        <BlockStack gap={"500"}>
                            <OfferProduct
                                setIsLoading={setIsLoading}
                                autopilotCheck={props.autopilotCheck}
                                setAutopilotCheck={props.setAutopilotCheck}
                                initialVariants={props.initialVariants}
                                updateInitialVariants={props.updateInitialVariants}
                                updateCheckKeysValidity={props.updateCheckKeysValidity}
                                initialOfferableProductDetails={props.initialOfferableProductDetails}
                            />

                            <OfferTitleDetails
                                autopilotCheck={props.autopilotCheck}
                                updateCheckKeysValidity={props.updateCheckKeysValidity}
                            />

                            <DisplayOptions />
                        </BlockStack>
                        <BlockStack>
                            <div className="align-center">
                                <span className="padding-fit"><Button onClick={props.handleTabChange}>Continue To Placement</Button></span>
                            </div>
                        </BlockStack>
                    </BlockStack>

                </>
            )}
        </div>
    );
}
