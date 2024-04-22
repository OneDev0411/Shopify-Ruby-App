import {createContext, useState} from 'react';
import {OFFER_DEFAULTS} from "~/shared/constants/EditOfferOptions";
import {Offer, ProductDetails} from "~/types/types";

export type OfferContent = {
    offer: Offer,
    setOffer: (offer: Offer | ((prevOffer: Offer) => Offer)) => void,
    updateOffer: (key: string, value: any) => void,
    updateProductsOfOffer: (productDetails: ProductDetails) => void,
    updateIncludedVariants: (selectedItem: string | string[], selectedVariants: number[]) => void,
    updateNestedAttributeOfOffer: (updatedValue: any, ...updatedKey: any[]) => void
}

export default function OfferProvider({ children }) {
    const [offer, setOffer] = useState<Offer>({...OFFER_DEFAULTS});

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



    return (
        <OfferContext.Provider
            value={{offer, setOffer, updateOffer, updateProductsOfOffer, updateIncludedVariants, updateNestedAttributeOfOffer}}
        >
            {children}
        </OfferContext.Provider>
    );
}

export const OfferContext = createContext<OfferContent | undefined>(undefined);
