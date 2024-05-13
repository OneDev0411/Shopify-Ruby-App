import { useCallback, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { Card, Box, BlockStack, AppProvider, Link, Text, Badge, InlineGrid } from '@shopify/polaris';
import { condition_options } from "../shared/constants/ConditionOptions";
import { getKeyFromValue } from "../shared/helpers/commonHelpers";
import "../components/stylesheets/editOfferStyle.css";
import { Offer, ProductDetails } from "~/types/types";
import translations from "@shopify/polaris/locales/en.json";

interface IOfferDetailsProps {
  offer: Offer;
  offerableProducts: ProductDetails[];
}

const OfferDetails = (props: IOfferDetailsProps) => {
  const navigateTo = useNavigate();
  const checkPlacement = useCallback(() => {
    if(props.offer.in_product_page && props.offer.in_cart_page) {
        return <span>Product and cart page</span>
    }
    else if (props.offer.in_ajax_cart && props.offer.in_cart_page) {
        return <span>AJAX and cart page</span>
    }
    else if (props.offer.in_cart_page) {
        return <span>Cart page</span>
    }
    else if (props.offer.in_product_page) {
        return <span>Product page</span>
    }
    else if (props.offer.in_ajax_cart) {
        return <span>AJAX cart (slider, pop up or dropdown)</span>
    }
    else {
        return <span>Cart Page</span>
    }
  }, [props.offer]);

  const handleEditOffer = (offer_id) => {
    navigateTo('/app/edit-offer', { state: { offerID: offer_id } });
  }

  return (
    <>
      <AppProvider i18n={translations}>
        <Card>
        <BlockStack gap={"600"}>
          <InlineGrid columns={2}>
            <Text variant="headingMd" as="h6">Offer Details</Text>
            <span className='justify-right'><Link onClick={() => handleEditOffer(props.offer.id)} removeUnderline>Edit</Link></span>
          </InlineGrid>
         <Box>
            <Text as="p">Placement: {checkPlacement()}</Text>
          </Box>
          <div className="hr-custom"></div>
          <Box>
            <Text as='p'>Product offered:
                {props.offerableProducts.map((offerableProduct, index)=> (
                    <p key={index}>{offerableProduct.title}</p>
                ))}
            </Text>
          </Box>
          <div className="hr-custom"></div>
          <Box>
            <Text as="p">
              Display conditions:
              {props.offer.rules_json?.length === 0 ? (
                    <p style={{color: '#6D7175'}}>None selected (show offer to all customer)</p>
                ) : (
                  <>{Array.isArray(props.offer.rules_json) && props.offer.rules_json.map((rule, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{marginRight: '10px', display: "inline-block"}}>
                              {getKeyFromValue(condition_options, rule.rule_selector)}: &nbsp;
                              <Badge>
                                  {/* @ts-ignore */}
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                      {rule.quantity && <p style={{color: 'blue', marginRight: '3px'}}>{rule.quantity} &nbsp; - &nbsp;</p> }
                                      <p style={{color: 'blue', marginRight: '3px'}}><b>{rule.item_name}</b></p>
                                  </div>
                              </Badge>
                          </div>
                      </li>
                  ))}</>
              )}
            </Text>
          </Box>
        </BlockStack>
        </Card>
      </AppProvider>
    </>
  )
}

export default OfferDetails;
