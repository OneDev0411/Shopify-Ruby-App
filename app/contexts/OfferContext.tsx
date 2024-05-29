import { createContext, useState } from 'react';
import { OFFER_DEFAULTS } from "~/shared/constants/EditOfferOptions";
import { Offer, ProductDetails, UpdateCheckKeysValidityFunc, AutopilotCheck, ProductVariants } from "~/types/types";

export type OfferContent = {
    offer: Offer,
    setOffer: (offer: Offer | ((prevOffer: Offer) => Offer)) => void,
    updateOffer: (key: string, value: any) => void,
    updateProductsOfOffer: (productDetails: ProductDetails) => void,
    updateIncludedVariants: (selectedItem: string | string[], selectedVariants: number[]) => void,
    updateNestedAttributeOfOffer: (updatedValue: any, ...updatedKey: any[]) => void,
    checkKeysValidity: Record<string, string | boolean>,
    updateCheckKeysValidity: UpdateCheckKeysValidityFunc,
    autopilotCheck: AutopilotCheck,
    setAutopilotCheck: (autopilotCheck: AutopilotCheck) => void,
    initialVariants: ProductVariants,
    setInitialVariants: React.Dispatch<React.SetStateAction<ProductVariants>>,
    updateInitialVariants: (selectedItem: string | string[] | Offer['included_variants'], selectedVariants?: number[]) => void;
    initialOfferableProductDetails: ProductDetails[];
    setInitialOfferableProductDetails: React.Dispatch<React.SetStateAction<ProductDetails[]>>,
    enablePublish: boolean,
    setEnablePublish: (enablePublish: boolean) => void,
}

export default function OfferProvider({ children }) {
    const [offer, setOffer] = useState<Offer>({...OFFER_DEFAULTS});
    const [checkKeysValidity, setCheckKeysValidity] = useState<Record<string, string | boolean>>({});
    const [autopilotCheck, setAutopilotCheck] = useState<AutopilotCheck>({
        isPending: "Launch Autopilot",
    });
    const [initialVariants, setInitialVariants] = useState<Record<string, (string | number)[]>>({});
    const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState<ProductDetails[]>([]);
    const [enablePublish, setEnablePublish] = useState<boolean>(false)

    //Called to update the initial variants of the offer
    function updateInitialVariants(value) {
        setInitialVariants({...value});
    }

    //Called whenever the offer changes in any child component
    function updateOffer(updatedKey: string, updatedValue: any) {
        setOffer(previousState => {
            return {...previousState, [updatedKey]: updatedValue};
        });
    }

    // Called to update offerable_product_details and offerable_product_shopify_ids of offer
    function updateProductsOfOffer(data: ProductDetails) {
        setOffer(previousState => {
            return {...previousState, offerable_product_details: [...previousState.offerable_product_details, data],};
        });
        setOffer(previousState => {
            return {
                ...previousState,
                offerable_product_shopify_ids: [...previousState.offerable_product_shopify_ids, data.id],
            };
        });
    }

    //Called whenever the shop changes in any child component
    // TODO: Refactor
    function updateNestedAttributeOfOffer(updatedValue: any, ...updatedKey: any[]) {
        if(updatedKey.length == 1) {
            setOffer(previousState => {
                return { ...previousState, [updatedKey[0]]: updatedValue };
            });
        }
        else if(updatedKey.length == 2) {
            setOffer(previousState => ({
                ...previousState,
                [updatedKey[0]]: {
                    ...previousState[updatedKey[0]],
                    [updatedKey[1]]: updatedValue
                }
            }));
        }
        else if(updatedKey.length == 3) {
            setOffer(previousState => ({
                ...previousState,
                [updatedKey[0]]: {
                    ...previousState[updatedKey[0]],
                    [updatedKey[1]]: {
                        ...previousState[updatedKey[0]][updatedKey[1]],
                        [updatedKey[2]]: updatedValue
                    }
                }
            }));
        }
    }

    // Called to update the included variants in offer
    function updateIncludedVariants(selectedItem: string | string[], selectedVariants: number[]) {
        const updatedOffer = {...offer};

        console.log("updatedOffer from variants", updatedOffer)
        if (Array.isArray(selectedItem)) {
            for (let key in selectedVariants) {
                // @ts-ignore
                updatedOffer.included_variants[key] = selectedVariants[key];
            }
        } else {
            updatedOffer.included_variants[selectedItem] = selectedVariants;
        }
        setOffer({...updatedOffer});
    }

    //Called whenever the checkKeysValidity changes in any child component
    function updateCheckKeysValidity(updatedKey: string, updatedValue: string | number | boolean) {
        setCheckKeysValidity(previousState => {
            return {...previousState, [updatedKey]: updatedValue};
        });
    }

    return (
        <OfferContext.Provider
            value={{ offer, setOffer, updateOffer, updateProductsOfOffer, updateIncludedVariants, updateNestedAttributeOfOffer,
                            autopilotCheck, setAutopilotCheck, checkKeysValidity, updateCheckKeysValidity, initialVariants, setInitialVariants,
                                updateInitialVariants, initialOfferableProductDetails, setInitialOfferableProductDetails, enablePublish, setEnablePublish }}
        >
            {children}
        </OfferContext.Provider>
    );
}

export const OfferContext = createContext<OfferContent | undefined>(undefined);
