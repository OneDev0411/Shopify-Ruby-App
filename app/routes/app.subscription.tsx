import {
	Card,
	Page,
	Layout,
	Image,
	BlockStack,
	Banner,
	Text,
	InlineStack,
	Button,
	ButtonGroup,
} from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect} from '@shopify/app-bridge/actions';
import { Reviews } from "../components";
import { CustomTitleBar } from "../components/customtitlebar";

import "../components/stylesheets/mainstyle.css";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { isSubscriptionActive } from "../services/actions/subscription";
import { billingImg } from "../assets/index";
// import { onLCP, onFID, onCLS } from 'web-vitals';
// import { traceStat } from "../services/firebase/perf";
import ErrorPage from "../components/ErrorPage"
import { useShopState } from "../contexts/ShopContext";
import { IRootState } from "~/store/store";
import { LoadingSpinner } from "../components/atoms/index";
import { IApiResponse, Subscription as SubscriptionType } from "~/types/types";
import { sendToastMessage } from "~/shared/helpers/commonHelpers";
import {InfoIcon} from "@shopify/polaris-icons";
import CustomBanner from "~/components/CustomBanner";

type CurrentSubscriptionType = {
	redirect_to?: string;
	subscription: SubscriptionType;
	plan: string;
	days_remaining_in_trial: number;
	active_offers_count: number;
	unpublished_offer_ids: number[];
	subscription_not_paid: boolean;
}

export default function Subscription() {
	const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
	const fetch = useAuthenticatedFetch(shopAndHost.host);
	const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
	const {
		planName,
		setPlanName,
		trialDays,
		setTrialDays,
		isSubscriptionUnpaid,
		setIsSubscriptionUnpaid
	} = useShopState();
	const [activeOffersCount, setActiveOffersCount] = useState<number>();
	const [unpublishedOfferIds, setUnpublishedOfferIds] = useState<number[]>([]);
	const app = useAppBridge();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [upgradeButtonDisable, setUpgradeButtonDisable] = useState<boolean>(false);

  // useEffect(()=> {
  //   onLCP(traceStat, {reportSoftNavs: true});
  //   onFID(traceStat, {reportSoftNavs: true});
  //   onCLS(traceStat, {reportSoftNavs: true});
  // }, []);
	const [error, setError] = useState<Error | null>(null);

	const handlePlanChange = (internal_name: string) => {
		let redirect = Redirect.create(app);

		fetch('/api/v2/merchant/subscription', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				subscription: { plan_internal_name: internal_name },
				shop: shopAndHost.shop,
			}),
		})
		.then((response) => response.json())
		.then((data: IApiResponse) => {
			if (data.payment == 'no') {
				const toastOptions = {
					message: data.message,
					duration: 3000,
					isError: false,
				};
				sendToastMessage(app, toastOptions);
				redirect.dispatch(Redirect.Action.APP, `/?shop=${shopAndHost.shop}`);
			} else {
				redirect.dispatch(Redirect.Action.REMOTE, data.url+'/?shop='+shopAndHost.shop);
			}
		})
		.catch((error: Error) => {
			const toastOptions = {
				message: 'An error occurred. Please try again later.',
				duration: 3000,
				isError: true,
			};
			sendToastMessage(app, toastOptions);
			console.log("Error:", error);
		})
	}

	useEffect(() => {
		const fetchSubscription = () => {
			let redirect = Redirect.create(app);
			fetch(`/api/v2/merchant/current_subscription?shop=${shopAndHost.shop}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => response.json())
			.then((data: CurrentSubscriptionType) => {
				if (data.redirect_to) {
					redirect.dispatch(Redirect.Action.APP, data.redirect_to);
				} else {
					setCurrentSubscription(data.subscription);
					setPlanName(data.plan);
					setTrialDays(data.days_remaining_in_trial);
					setActiveOffersCount(data.active_offers_count);
					setUnpublishedOfferIds(data.unpublished_offer_ids);
					setIsSubscriptionUnpaid(data.subscription_not_paid);
					setIsLoading(false);
				}
			})
			.catch((error: Error) => {
				setError(error);
				console.log("error", error);
			})
		};

		fetchSubscription();
	}, []);

  if (error) { return <ErrorPage showBranding={true} />; }

  return (
    <Page>
        <CustomTitleBar title='Billing' />
        { isLoading ?  (
          <LoadingSpinner />
        ) : (
          <>
            <div className="auto-height paid-subscription">
              <Layout>
                <Layout.Section>
                  {(isSubscriptionActive(currentSubscription) && planName!=='free' && trialDays && trialDays>0) ? (
                    <CustomBanner
                      icon={InfoIcon}
                      icon_color={"rgb(66,181,194)"}
                      content=" days remaining for the trial period"
                      background_color="rgb(221,245,246)"
                      border_color="rgb(187,221,226)"
                      trial_days={trialDays}
                      name="non_icon"
                    />) : null
                  }
                  {!isSubscriptionActive(currentSubscription) ? (
                    <CustomBanner
                      icon={InfoIcon}
                      icon_color={"rgb(66,181,194)"}
                      content="Your Subscription Is Not Active: please confirm it on this page"
                      background_color="rgb(221,245,246)"
                      border_color="rgb(187,221,226)"
                      name="non_icon"
                    />) : null
                  }
                  {(planName==='trial' && (unpublishedOfferIds?.length>0 || activeOffersCount)) ? (
                    <CustomBanner
                      icon={InfoIcon}
                      icon_color={"rgb(66,181,194)"}
                      content="If you choose free plan after trial, offers will be unpublished"
                      background_color="rgb(221,245,246)"
                      border_color="rgb(187,221,226)"
                      name="non_icon"
                    />) : null
                  }
                </Layout.Section>
                <Layout.Section>
                  Choose a Plan
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <BlockStack>
											<div className="recommended-current">
												{(planName==='flex' && isSubscriptionActive(currentSubscription)) ? (
													<p><small>Current Plan</small></p>
												) : (
													<p><small>Recommended</small></p>
												)}
											</div>
											<Text variant="headingMd" as="h6">IN CART UPSELL & CROSS-SELL UNLIMITED - Paid Subscription</Text>
											<p className="subscription-subtitle">Upgrade now on our 30-DAY FREE TRIAL!</p>
											<div className="sub-hr-custom"></div>
											<div className="pl-10">
												<p className="bold space-4">Features</p>
												<div className="features-grid">
													<div className="features">
														<p className="subscription-feature">500 Upsell Offers</p>
														<p className="subscription-desc">Create as many as you want!</p>
														<p className="subscription-feature">Unlimited Upsell orders</p>
														<p className="subscription-desc">No order limit!</p>
														<p className="subscription-feature">Autopilot AI offers</p>
														<p className="subscription-desc">Automatic offers feature, simply let it run</p>
														<p className="subscription-feature">Autopilot AI offers</p>
														<p className="subscription-desc">Cart, AJAX cart, & product page offers</p>
														<p className="subscription-feature">Offer multiple upsells</p>
														<p className="subscription-desc">A/B testing</p>
														<p className="subscription-feature">Learn which offers perform the best</p>
														<p className="subscription-desc">Offer discounts with upsell offers</p>
														<p className="subscription-feature">Conditional logic</p>
														<p className="subscription-desc">Show the right offer based on set conditions</p>
														<p className="subscription-feature">Custom design & placement</p>
														<p className="subscription-desc">Full offer box design customization </p>
													</div>
													<Image
														source={billingImg}
														alt="upgrade subscription"
														className="billing-image"
													/>
												</div>
											</div>
											<div className="sub-hr-custom"></div>
											<div className="pl-10">
												<p className="bold space-4">Pricing</p>
												<p className="mb-16">Paid app subscription plan pricing is based on your Shopify store’s subscription</p>

												<div className="pricing-grid">
													<p><b>Shopify Subscription</b></p>
													<p><b>In Cart Upsell & Cross Sell Unlimited price</b></p>
													<p className="mt-14">Basic</p>
													<p className="mt-14">$19.99/mo</p>
													<p className="mt-14">Shopify</p>
													<p className="mt-14">$29.99/mo</p>
													<p className="mt-14">Advanced</p>
													<p className="mt-14">$59.99/mo</p>
													<p className="mt-14">Plus</p>
													<p className="mt-14">$99.99/mo</p>
												</div>
											</div>
                    </BlockStack>
                    <InlineStack align="end">
											<ButtonGroup>
												<Button
													disabled={upgradeButtonDisable}
													variant="primary"
													onClick={() => {
														planName === "flex" &&
														isSubscriptionActive(currentSubscription) &&
														!isSubscriptionUnpaid
															? setUpgradeButtonDisable(true)
															: handlePlanChange("plan_based_billing");
													}}
													accessibilityLabel="Upgrade"
												>
													Upgrade
												</Button>
											</ButtonGroup>
										</InlineStack>
                  </Card>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  <Card>
                    <div className="recommended-current">
                      {(planName==='free' && isSubscriptionActive(currentSubscription)) ? (
                        <p><small>Current Plan</small></p>
                      ) : (
                        <p><small>Not Recommended</small></p>
                      )}
                    </div>
                    <Text variant="headingMd" as="h6">Free</Text>
                    <p className="subscription-subtitle">1 branded upsell offer</p>
                    <div className="mt-28">
                      <p><b>1 upsell offer only</b></p>
                      <p>with “Powered by In Cart Upsell” watermark at bottom of offer block</p>
                    </div>
                    <InlineStack align="end">
											<ButtonGroup>
												<Button
													variant="primary"
													onClick={() => {
													planName === "free" ||
													(planName === "trial" &&
														isSubscriptionActive(currentSubscription))
														? undefined
														: handlePlanChange("free_plan");
													}}
													accessibilityLabel="Downgrade"
												>
													Downgrade
												</Button>
											</ButtonGroup>
										</InlineStack>
                  </Card>
                </Layout.Section>
              </Layout>
            </div>

            <div className="space-10"></div>
            <Layout>
              <Layout.Section>
                <Card>
                  <p>Need help, have some questions, or just want to say hi? We're available for a live chat 7 days a week from 5 AM EST - 9 PM EST.</p>
                  <br/>
                  <p>Not anything urgent? Fire us an email, we usually respond with 24 hours Monday to Friday</p>
                </Card>
              </Layout.Section>
            </Layout>
            <div className="space-10"></div>
            <Reviews/>
            <div className="space-10"></div>
          </>
        )}
    </Page>
  );
}
