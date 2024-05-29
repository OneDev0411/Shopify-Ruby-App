import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Image,
  MediaCard,
  Modal,
  Text,
  BlockStack,
  VideoThumbnail, Tabs, LegacyCard, Layout, Banner,
} from "@shopify/polaris";
import {homeImage} from "../assets/index";
import {useLocation, useNavigate} from "@remix-run/react";
import {useSelector} from "react-redux";
import {fetchShopData} from "../services/actions/shop";
import {useEnv} from "../contexts/EnvContext";
import {IRootState} from "~/store/store";
import {IVideoModalProps, Shop, ThemeAppExtension} from "~/types/types";
import { AlertCircleIcon }  from '@shopify/polaris-icons';
import CustomBanner from "./CustomBanner.js";
const ShopContext = createContext<ShopContext>({});

type ShopData = {
  currentShop: Shop | null;
  planName: string;
  trialDays: number;
}

type ShopContext = {
  shopData?: ShopData;
  setShopData?: React.Dispatch<React.SetStateAction<ShopData>>;
}

export function CreateOfferCard({hasOffers = false}) {
  const env = useEnv();
  const navigateTo = useNavigate();
  const location = useLocation();
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const [shopData, setShopData] = useState<ShopData>({
    currentShop: null,
    planName: "",
    trialDays: 0,
  });
  const [active, setActive] = useState<boolean>(false);

  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => setActive(false), []);
  const handleCreateOffer = useCallback(() => {
    navigateTo("/app/edit-offer", {state: {offerID: null}});
  }, [navigateTo]);
  const isOffers = location?.pathname.includes('offer');

  useEffect(() => {
    const fetchCurrentShop = async () => {
      try {
        const {shop, plan, days_remaining_in_trial} = await fetchShopData(shopAndHost.shop);
        setShopData({currentShop: shop, planName: plan, trialDays: days_remaining_in_trial});
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchCurrentShop();
  }, [shopAndHost]);

  const moreHelpInfo = <div>
    <div style={{marginBottom: '20px'}}>
      <Text variant="headingMd" as="span" fontWeight="medium">
        Need help creating an offer?&nbsp;
      </Text>
      <Text variant="headingMd" as="span" fontWeight="regular">
        Our support team can help walk you through it.
      </Text>
    </div>
    <div>
      <Text variant="headingSm" as="p" fontWeight="regular">
        Chat support is open 5am to 10pm EST.
      </Text>
      <Text variant="headingSm" as="p" fontWeight="regular">
        Or you can send us an email any time and we’ll get back to you within 48 hours.
      </Text>
    </div>
  </div>;

  // Though not necessary, this should serve as an example of how to use the Context API
  return (
    <ShopContext.Provider value={{shopData, setShopData}}>
      {!hasOffers &&
        <>
          <div style={{marginBottom: '47px'}}>
            <OfferCard handleCreateOffer={handleCreateOffer} isOffers={isOffers}/>
          </div>

          {!isOffers && (
            <>
              <HelpSection info={moreHelpInfo} handleOpen={handleOpen} shopData={shopData}/>
              <VideoModal active={active} handleClose={handleClose}/>
            </>
          )}
        </>
      }
    </ShopContext.Provider>
  );
}

interface IOfferCardProps {
  handleCreateOffer: () => void,
  isOffers: boolean
}

// Splitting into smaller components
function OfferCard({handleCreateOffer, isOffers}: IOfferCardProps) {
  return (
    <Card>
      <BlockStack inlineAlign="center">
        <div className="center-content">
          <Image
            source={homeImage}
            alt="Create your first offer"
            width={219}
            style={{marginBottom: '11px'}}
          />
          <div style={{marginBottom: '11px'}}>
            <Text variant="headingLg" as="h2" fontWeight="regular">
              {isOffers ? "This is where you’ll manage your offers" : "Here is where you'll view your offers"}
            </Text>
          </div>
          <div style={{marginBottom: '35px'}}>
            <Text variant="headingSm" as="p" fontWeight="regular" tone="subdued">
              {isOffers ?
                "Create a new offer to get started."
                :
                "Start by creating your first offer and publishing it to your store"
              }
            </Text>
          </div>
          <div className="center-btn" style={{marginBottom: '42px'}}>
            <ButtonGroup>
              <Button variant="primary" onClick={handleCreateOffer}>
                Create offer
              </Button>
              <Button
                url="https://help.incartupsell.com/en/collections/6780837-help-articles-for-new-ui"
                target="_blank"
              >
                View Help Docs
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </BlockStack>
    </Card>
  );
}

interface IHelpSectionProps {
  handleOpen: () => void,
  info: React.ReactNode,
  shopData: ShopData,
  disablePrimary?: boolean
}

function HelpSection({handleOpen, info, disablePrimary, shopData}: IHelpSectionProps) {
  const env = useEnv();

  const showIntercomWidget = () => {
    // Intercom needs to be initialized/booted before it can be used.
    window.Intercom('boot', {
      app_id: env?.CHAT_APP_ID,
      id: shopData.currentShop?.id,
      email: shopData?.currentShop?.email,
      phone: shopData?.currentShop?.phone_number,
      installed_at: shopData?.currentShop?.created_at,
      active: shopData?.currentShop?.is_shop_active,
      shopify_plan: shopData?.currentShop?.shopify_plan_name,
      trailing_30_day_roi: shopData?.currentShop?.days_remaining_in_trial,
      shop_url: `https://${shopData?.currentShop?.shopify_domain}`
      // No context as to why the attributes below are here
      // plan: '#{@currentShop.try(:plan).try(:name)}',
      // dashboard: "https://incartupsell.herokuapp.com/?shop_id=#{@currentShop.id}"
    });
    window.Intercom('show');
  };

  let VideoComp = <VideoThumbnail
    onClick={handleOpen}
    videoLength={80}
    thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg"
  />

  return (
    disablePrimary ? <MediaCard
        title={info}
        description={""}
      >
        {VideoComp}
      </MediaCard> :
      <MediaCard
        title={info}
        primaryAction={{
          content: "Learn more",
          // onAction: showIntercomWidget,
        }}
        description={""}
        popoverActions={[{
          content: "Dismiss", onAction: () => {
          }
        }]}
      >
        {VideoComp}
      </MediaCard>
  );
}

function VideoModal({active, handleClose}: IVideoModalProps) {
  return (
    <Modal onClose={handleClose} open={active} title="Getting Started">
      <Modal.Section>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/ANEPQkYLjbA"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Modal.Section>
    </Modal>
  );
}

interface IThemeAppCard {
  themeAppExtension: ThemeAppExtension | undefined,
  shopData?: Shop | null
}

export function ThemeAppCard({shopData, themeAppExtension}: IThemeAppCard) {
  const [open, setOpen] = useState<boolean>(true);
  const env = useEnv();

  const handleButtonChange = () => {
    fetch(`/api/v2/merchant/theme_app_check?shop=${shopData?.shopify_domain}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }})
      .then( (resp) => resp.json())
      .then( () => {
        return true
      })
  }


  useEffect(() => {
    let isBannerDismissed = localStorage.getItem('theme_banner');

    if (isBannerDismissed) {
      setOpen(false);
    }
  }, [])

  const contentInfo = (tab) => {
    return <BlockStack inlineAlign="center">
      <div className="leadin-card">
        <div style={{marginBottom: '11px'}} className="center-content">
          <Text variant="headingLg" as="h2" fontWeight="bold">
            Start here: Enable In Cart Upsell & Cross-Sell in your theme editor
          </Text>
        </div>
        <div style={{marginBottom: '35px'}} className="center-content">
          <Text variant="headingSm" as="p" fontWeight="regular" tone="subdued">
            App Blocks show your store's theme exactly where to display your upsell offer
          </Text>
        </div>
        <div style={{marginBottom: '35px'}} className={"video-intro-section"}>
          {/*<HelpSection info={ () => {return homepageInfo}} handleOpen={handleOpen} shopData={shopData} disablePrimary />*/}
          <div style={{marginBottom: '20px'}} className={"homepage-info"}>
            <Text variant="headingSm" as="p" fontWeight="regular">
              <ol>
                <li>Click on the <b>{tab.buttonName}</b> button below, and the app block will be automatically added for you.</li>
                <li>Click <b>save</b> in the top right of the page, close that tab, and you're done!</li>
              </ol>
            </Text>
          </div>
        </div>
        <div className="center-btn" style={{marginBottom: '42px'}}>
          { !tab.title.includes('Embedded') ?
            <Button variant="primary"
                    target="_blank"
                    url={`https://${shopData?.shopify_domain}/admin/themes/current/editor?template=${tab.handle}&addAppBlockId=${env?.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/${tab.panelID}&target=mainSection`}
                    onClick={handleButtonChange}
            >
              {tab.buttonName}
            </Button>
            :
            <Button variant="primary"
                    target="_blank"
                    url={`https://${shopData?.shopify_domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=${env?.VITE_SHOPIFY_ICU_EXTENSION_APP_ID}/${tab.panelID}`}
                    onClick={handleButtonChange}
            >
              {tab?.buttonName}
            </Button>
          }
        </div>
        <div className="center-btn">
          <Text variant="headingSm" as="p" fontWeight="regular" tone="subdued">
              Tip: You can reposition the placement of your offer by dragging and dropping the app block!
          </Text>
        </div>
      </div>
    </BlockStack>
  }

  const [selected, setSelected] = useState<number>(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'product-page-embed',
      content: 'Enable product page upsell',
      title: 'Product Page',
      showTab: !themeAppExtension?.product_block_added,
      panelID: 'product_app_block',
      handle: 'product',
      buttonName: 'Enable product page upsell'
    },
    {
      id: 'cart-page-embed',
      content: 'Enable cart page upsell',
      title: 'Cart Page',
      showTab: !themeAppExtension?.cart_block_added,
      panelID: 'cart_app_block',
      handle: 'cart',
      buttonName: 'Enable cart page upsell'
    },
    {
      id: 'ajax-cart-embed',
      content: 'Enable ajax cart upsell',
      title: 'Embedded Apps settings',
      showTab: !themeAppExtension?.theme_app_embed,
      panelID: 'ajax_cart_app_block',
      buttonName: 'Enable ajax cart upsell'
    },
  ];
  const availableTabs = tabs.filter(tab => tab.showTab);

  return (
    (availableTabs.length > 0) &&
    <Layout.Section>
      <div style={{marginBottom: '47px'}}>
        { open && (
            <div style={{marginBottom: '10px'}}>
              <CustomBanner
                icon={AlertCircleIcon}
                icon_color={"rgb(183,125,11)"}
                content="In Cart Upsell is moving to Theme App Extension blocks. Please see below to enable the blocks in your theme."
                background_color="rgb(249,242,210)"
                border_color="rgb(244,197,84)"
                name="dismiss_banner"
              />
          </div>
        )}
        <Card>
          <div className="offer-tabs-no-padding">
            <Tabs tabs={availableTabs} selected={selected} onSelect={handleTabChange} fitted>
              <div style={{marginTop: "40px"}}>
                {contentInfo(availableTabs[selected])}
              </div>
            </Tabs>
          </div>
        </Card>
      </div>
    </Layout.Section>
  )
}
