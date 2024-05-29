import { useEffect, useState } from "react";
import {useSelector} from 'react-redux';
import {useNavigate} from "@remix-run/react";

import { Banner, Grid, Layout, Page } from "@shopify/polaris";

import { isSubscriptionActive } from "../services/actions/subscription";
import { fetchShopData } from "../services/actions/shop";

import { OrderOverTimeData, TotalSalesData, TotalUpSellsData } from "../components/analyticsGraphdata";
import { OffersList } from "../components";
import { CustomTitleBar } from '../components/customtitlebar' 

import "../components/stylesheets/mainstyle.css";
import {ThemeAppCard} from "../components/CreateOfferCard.jsx";
import {Redirect} from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";
import {useEnv} from "../contexts/EnvContext";
import ErrorPage from "../components/ErrorPage.jsx";

import ModalChoosePlan from "../components/modal_ChoosePlan.jsx";
import {useShopState} from "../contexts/ShopContext";
import ABTestBanner from "../components/ABTestBanner.jsx";
// import { onLCP, onFID, onCLS } from 'web-vitals';
// import { traceStat } from "../services/firebase/perf.js";
import { LoadingSpinner } from "../components/atoms/index.js";
import { IRootState } from "~/store/store";
import {
  InfoIcon
} from '@shopify/polaris-icons';
import CustomBanner from "~/components/CustomBanner";

export default function HomePage() {
  const env = useEnv();
  const app = useAppBridge();
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const UTM = useSelector((state: IRootState) => state.UTM);


  const {
    shop,
    setShop,
    planName,
    setPlanName,
    trialDays,
    setTrialDays,
    hasOffers,
    setHasOffers,
    shopSettings,
    updateShopSettingsAttributes,
    themeAppExtension,
    setThemeAppExtension,
    setIsSubscriptionUnpaid} = useShopState()

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateTo = useNavigate();
  const [isLegacy, setIsLegacy] = useState(
    themeAppExtension?.theme_version !== "2.0" || env?.ENABLE_THEME_APP_EXTENSION?.toLowerCase() !== 'true'
  );

  // useEffect(()=> {
  //   onLCP(traceStat, {reportSoftNavs: true});
  //   onFID(traceStat, {reportSoftNavs: true});
  //   onCLS(traceStat, {reportSoftNavs: true});
  // }, []);

  const handleError = () => {
    setError('Some of your analytics data failed to load, so your stats may not be complete.');
  };

  const handleOpenOfferPage = () => {
    navigateTo('/app/edit-offer', { state: { offerID: null } });
  }

  const notifyIntercom = (icu_shop) => {
    window.Intercom('boot', {
      app_id: env?.INTERCOM_APP_ID,
      id: icu_shop.id,
      email: icu_shop.email,
      phone: icu_shop.phone_number,
      installed_at: icu_shop.installed_at || icu_shop.created_at,
      signed_up: icu_shop.created_at,
      active: icu_shop.active,
      shopify_plan: icu_shop.shopify_plan_name,
      shop_url: `https://${icu_shop.shopify_domain}`,
      theme: icu_shop.shopify_theme_name,
      currency: icu_shop.currency
    });
    window.Intercom('show');
  }

  useEffect(() => {
    let redirect = Redirect.create(app);

    if (shop?.id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true);
    fetchShopData(shopAndHost.shop)
      .then((data) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setHasOffers && setHasOffers(data.has_offers);
          setThemeAppExtension && setThemeAppExtension(data.theme_app_extension);
          setShop && setShop(data.shop);
          setPlanName && setPlanName(data.plan);
          setTrialDays && setTrialDays(data.days_remaining_in_trial);
          setIsSubscriptionUnpaid && setIsSubscriptionUnpaid(data.subscription_not_paid)
          updateShopSettingsAttributes && updateShopSettingsAttributes(data.offers_limit_reached, "offers_limit_reached");

          if (data.theme_app_extension) {
            setIsLegacy(data.theme_app_extension.theme_version !== "2.0" || env?.ENABLE_THEME_APP_EXTENSION?.toLowerCase() !== 'true');
          }
          // notify intercom as soon as app is loaded and shop info is fetched
          notifyIntercom(data.shop);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        console.log("Error", error);
      })
  }, [])

  if (error) { return < ErrorPage showBranding={true} />; }

  return (
    <Page>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ModalChoosePlan />
          <CustomTitleBar
            title="In Cart Upsell & Cross Sell"
            image={"https://assets.incartupsell.com/images/ICU-Logo-Small.png"}
            buttonText={"Create offer"}
            handleButtonClick={handleOpenOfferPage}
          />
          <Layout>
            {isSubscriptionActive(shop && shop.subscription) && planName!=='free' && trialDays && trialDays>0 &&
              <Layout.Section>
                <CustomBanner
                  icon={InfoIcon}
                  icon_color={"rgb(66,181,194)"}
                  content="days remaining for the trial period"
                  background_color="rgb(221,245,246)"
                  border_color="rgb(187,221,226)"
                  trial_days={trialDays}
                />
              </Layout.Section>
            }

              {shopSettings?.offers_limit_reached && (
                <Layout.Section>
                  <ABTestBanner icon={InfoIcon}
                                icon_color={"rgb(42, 172, 187)"}
                                content={""}
                                background_color={"rgb(221,245,246)"}
                                border_color={"rgb(109 192 205)"}/>
                </Layout.Section>
              )}

              {!isLegacy && (
                <Layout.Section>
                  <ThemeAppCard
                    shopData={shop}
                    themeAppExtension={themeAppExtension}
                  />
                </Layout.Section>
              )}

              <Layout.Section>
                <OffersList />
                {hasOffers && (
                  <Grid>
                   <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
                        <TotalSalesData period='30-days' title={true} />
                      </Grid.Cell>  
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
                      <TotalUpSellsData period='30-days' title={true} />
                    </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
                    <OrderOverTimeData period='30-days' title={true} />
                  </Grid.Cell>
                </Grid>
                )} 
              </Layout.Section>
          </Layout>
          <div className="space-10"></div>
        </>
    )}
    </Page>
  );
};
