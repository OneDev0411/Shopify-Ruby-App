import {
  Page,
  AppProvider,
  Badge,
  Grid,
  BlockStack,
  Spinner,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useNavigate } from "@remix-run/react";
import {useState, useEffect, useContext} from "react";
import { useSelector, Provider } from "react-redux";
import { GenericFooter } from "../components";
import Summary from "../components/Summary";
import OfferDetails from "../components/OfferDetails";
import { OfferPreview } from "../components/OfferPreview";
import { useAuthenticatedFetch } from "../hooks";
import AbAnalytics from "../components/abanalytics";
import "../components/stylesheets/mainstyle.css";
import { useAppBridge } from '@shopify/app-bridge-react'
import { Toast } from '@shopify/app-bridge/actions';
import {OfferContent, OfferContext} from "../contexts/OfferContext";
import {useOffer} from "../hooks/useOffer.js";
import {
  OFFER_ACTIVATE_URL,
  OFFER_DEACTIVATE_URL,
  OFFER_DEFAULTS,
  OFFER_DRAFT,
  OFFER_PUBLISH
} from "../shared/constants/EditOfferOptions.js";
// import { onLCP, onFID, onCLS } from 'web-vitals';
// import { traceStat } from "../services/firebase/perf.js";
import ErrorPage from "../components/ErrorPage"
import UpgradeSubscriptionModal from "../components/UpgradeSubscriptionModal";
import { IRootState } from "~/store/store";
import { ProductDetails } from "~/types/types";

const EditOfferView = () => {
  const { offer, setOffer, updateOffer } = useContext(OfferContext) as OfferContent;
  const app = useAppBridge();
  const { fetchOffer } = useOffer();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch(shopAndHost.host)
  const [initialOfferableProductDetails, setInitialOfferableProductDetails] = useState<ProductDetails[]>([]);
  const [checkKeysValidity, setCheckKeysValidity] = useState<Record<string, string | boolean>>({});
  const navigateTo = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);

  // useEffect(()=> {
  //   onLCP(traceStat, {reportSoftNavs: true});
  //   onFID(traceStat, {reportSoftNavs: true});
  //   onCLS(traceStat, {reportSoftNavs: true});
  // }, []);

  const handleEditOffer = (offer_id) => {
    navigateTo('/app/edit-offer', { state: { offerID: offer_id } });
  }
  const [error, setError] = useState(null);


  const toggleOfferActivation = async (activate) => {
    if (activate && offer.offers_limit_reached) {
      setOpenModal(true)
    } else {
      await fetch(activate ? OFFER_ACTIVATE_URL : OFFER_DEACTIVATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer: { offer_id: "offerID" }, shop: shopAndHost.shop })
      }).then((response) => {
        if ([200,204].includes(response.status)) {
          updateOffer("publish_status", activate ? OFFER_PUBLISH : OFFER_DRAFT)
          updateOffer("active", activate)
        } else {
          // TODO: send out an error message here
          console.log("there was an issue deactivating the offer")
        }
      }).catch((error) => {
        const toastOptions = {
          message: 'An error occurred. Please try again later.',
          duration: 3000,
          isError: true,
        };
        const toastError = Toast.create(app, toastOptions);
        toastError.dispatch(Toast.Action.SHOW);
        console.log("Error:", error);
      })
    }
  }

  const handleDuplicateOffer = () => {
    const offerID = localStorage.getItem('Offer-ID');
    fetch(`/api/v2/merchant/offers/${offerID}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer_id: offerID, shop: shopAndHost.shop })
    })
      .then((response) => {
        if ([200,204].includes(response.status)) {
          navigateTo('/app/offer');
        }
      })
      .catch((error) => {
        const toastOptions = {
          message: 'An error occurred. Please try again later.',
          duration: 3000,
          isError: true,
        };
        const toastError = Toast.create(app, toastOptions);
        toastError.dispatch(Toast.Action.SHOW);
        console.log('An error occurred while making the API call:', error);
      })
  }

  const handleDeleteOffer = () => {
    const offerID = localStorage.getItem('Offer-ID');
    fetch(`/api/v2/merchant/offers/${offerID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offer_id: offerID, shop: shopAndHost.shop })
    })
      .then((response) => {
        if ([200,204].includes(response.status)) {
          navigateTo('/app/offer');
        }
      })
      .catch((error) => {
        const toastOptions = {
          message: 'An error occurred. Please try again later.',
          duration: 3000,
          isError: true,
        };
        const toastError = Toast.create(app, toastOptions);
        toastError.dispatch(Toast.Action.SHOW);
        console.log('An error occurred while making the API call:', error);
      })
  }

  useEffect(() => {
    const offerID = localStorage.getItem('Offer-ID');
    if ( offerID != null) {
      setIsLoading(true);
      fetchOffer(offerID, shopAndHost.shop).then((response) => {
        if (response.status === 200) {
          return response.json()
        }
        navigateTo('/app/offer');
      }).then((data) => {
          setOffer({...data});
          setInitialOfferableProductDetails(data.offerable_product_details);
          if (data.offerable_product_details.length > 0) {
            updateCheckKeysValidity('text', data.text_a.replace("{{ product_title }}", data.offerable_product_details[0]?.title));
          }
          updateCheckKeysValidity('cta', data.cta_a);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
          console.log("Error > ", error);
        });
    }

    return function cleanup() {
      setOffer(OFFER_DEFAULTS);
    };
  },[]);

  function updateCheckKeysValidity(updatedKey: string, updatedValue: string | boolean) {
    setCheckKeysValidity(previousState => {
        return {...previousState, [updatedKey]: updatedValue};
    });
  }
  if (error) { return < ErrorPage showBranding={false}/>; }

  return (
      <AppProvider i18n={[]}>
        <div className="page-space">
          {isLoading ? (
            <div style={{
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
              <Spinner size="large"/>
            </div>
          ) : (
            <>
              <Page
                backAction={{onAction: () => {
                  navigateTo('/app')
                }}}
                title={offer.title}
                titleMetadata={
                  offer.publish_status === "published" ? (
                    <Badge tone="success">Published</Badge>
                  ) : (
                    <Badge>Unpublished</Badge>
                  )
                }
                secondaryActions={[
                  {
                    content: (offer.publish_status === 'draft') ? 'Publish' : 'Unpublish',
                    onAction: () => offer.publish_status === 'draft' ? toggleOfferActivation(true) : toggleOfferActivation(false),
                  },
                  {
                    content: 'Edit', 
                    onAction: () => handleEditOffer(offer.id),
                  },
                ]}
                actionGroups={[
                  {
                    title: 'More Actions',
                    actions: [
                      {
                        content: 'Duplicate',
                        accessibilityLabel: 'Individual action label',
                        onAction: () => handleDuplicateOffer(),
                      },
                      {
                        content: 'Delete',
                        accessibilityLabel: 'Individual action label',
                        onAction: () => handleDeleteOffer(),
                      },
                    ],
                  },
                ]}
              >
                <div className="grid-space">
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 8, xl: 8}}>
                      <div className="widget-visibility">
                        <OfferPreview checkKeysValidity={checkKeysValidity} updateCheckKeysValidity={updateCheckKeysValidity} previewMode/>
                      </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
                      <BlockStack gap="500">
                        <OfferDetails offer={offer} offerableProducts={initialOfferableProductDetails}/>
                        <Summary offerID={offer.id}/>
                        <AbAnalytics offerId={offer.id ?? 0}/>
                      </BlockStack>
                    </Grid.Cell>
                  </Grid>
                </div>
                <GenericFooter text='Learn more about ' linkUrl='#' linkText='offers'></GenericFooter>
              </Page>
            </>
          )}
        </div>
        <UpgradeSubscriptionModal openModal={openModal} setOpenModal={setOpenModal} />
      </AppProvider>
    );
  }

export default EditOfferView