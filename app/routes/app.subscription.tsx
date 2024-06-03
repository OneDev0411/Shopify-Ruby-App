import {
	Card,
	Page,
	Layout,
	Image,
	BlockStack,
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
import { PricingList, SubscriptionFeatures } from "~/shared/constants/Others";
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const firstBannerCondition: boolean = isSubscriptionActive(currentSubscription) && planName!=='free' && trialDays && trialDays ? true : false;
	const thirdBannerCondition: boolean = (planName==='trial' && (unpublishedOfferIds?.length>0 || activeOffersCount)) ? true : false;
	const showUpgradeButton: boolean = !(planName === "flex" && isSubscriptionActive(currentSubscription) && !isSubscriptionUnpaid);
	const showFreePlanButton: boolean = !(planName === "free" || (planName === "trial" &&	isSubscriptionActive(currentSubscription)));

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
		setIsLoading(true);
		const fetchSubscription = () => {
			let redirect = Redirect.create(app);
			setIsLoading(true);
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
			.catch((err: Error) => {
				setError(err);
				setIsLoading(false);
				console.log("error", err);
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
                  	{firstBannerCondition && (
						<CustomBanner
							icon={InfoIcon}
							icon_color={"rgb(66,181,194)"}
							content=" days remaining for the trial period"
							background_color="rgb(221,245,246)"
							border_color="rgb(187,221,226)"
							trial_days={trialDays}
							name="non_icon"
						/>)}
                  	{!isSubscriptionActive(currentSubscription) && (
						<CustomBanner
							icon={InfoIcon}
							icon_color={"rgb(66,181,194)"}
							content="Your Subscription Is Not Active: please confirm it on this page"
							background_color="rgb(221,245,246)"
							border_color="rgb(187,221,226)"
							name="non_icon"
						/>)}
                  	{thirdBannerCondition && (
						<CustomBanner
						icon={InfoIcon}
						icon_color={"rgb(66,181,194)"}
						content="If you choose free plan after trial, offers will be unpublished"
						background_color="rgb(221,245,246)"
						border_color="rgb(187,221,226)"
						name="non_icon"
					/>)}
                </Layout.Section>
                <Layout.Section>
                  Choose a Plan
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <BlockStack>
						<div className="recommended-current">
							{(planName==='flex' && isSubscriptionActive(currentSubscription)) ? (
								<Text variant="bodySm" as="p">Current Plan</Text>
							) : (
								<Text variant="bodySm" as="p">Recommended</Text>
							)}
						</div>
						<Text variant="headingMd" as="h6">IN CART UPSELL & CROSS-SELL UNLIMITED - Paid Subscription</Text>
						<Text as="p">Upgrade now on our 30-DAY FREE TRIAL!</Text>
						<div className="sub-hr-custom"></div>
						<BlockStack as="div" gap="400">
							<Text as="p" fontWeight="bold">Features</Text>
							<BlockStack>
								<BlockStack gap="050">
									{SubscriptionFeatures.map((feature, id) => (
										<BlockStack key={id}>
											<Text as="p">{feature.feature}</Text>
											<Text as="p">{feature.description}</Text>
										</BlockStack>
									))}
								</BlockStack>
								<Image
									source={billingImg}
									alt="upgrade subscription"
									width={200}
								/>
							</BlockStack>
						</BlockStack>
						<div className="sub-hr-custom"></div>
						<BlockStack gap="400">
							<Text as="p" fontWeight="bold">Pricing</Text>
							<Text as="p">Paid app subscription plan pricing is based on your Shopify store’s subscription</Text>

							<BlockStack gap="300">
								<Text as="p" fontWeight="bold">Shopify Subscription</Text>
								<Text as="p" fontWeight="bold">In Cart Upsell & Cross Sell Unlimited price</Text>
								{PricingList.map((price, id) => (
									<BlockStack gap="300" key={id}>
										<Text as="p">{price.type}</Text>
										<Text as="p">${price.value}/mo</Text>
									</BlockStack>	
								))}
							</BlockStack>
						</BlockStack>
                    </BlockStack>
                    {showUpgradeButton && 
						<InlineStack align="end">
							<ButtonGroup>
								<Button
									variant="primary"
									onClick={() => handlePlanChange("plan_based_billing")}
									accessibilityLabel="Upgrade"
								>
									Upgrade
								</Button>
							</ButtonGroup>
						</InlineStack>
					}
                  </Card>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  <Card>
                    <div className="recommended-current">
                      {(planName==='free' && isSubscriptionActive(currentSubscription)) ? (
                        <Text variant="bodySm" as="p" >Current Plan</Text>
                      ) : (
                        <Text variant="bodySm" as="p">Not Recommended</Text>
                      )}
                    </div>
                    <Text variant="headingMd" as="h6">Free</Text>
										<Text as="p">1 branded upsell offer</Text>
                    <div className="mt-28">
                      <Text as="p" fontWeight="bold">1 upsell offer only</Text>
                      <Text as="p">with “Powered by In Cart Upsell” watermark at bottom of offer block</Text>
                    </div>
						{showFreePlanButton &&
							<InlineStack align="end">
								<ButtonGroup>
									<Button
										variant="primary"
										onClick={() => handlePlanChange("free_plan")}
										accessibilityLabel="Downgrade"
									>
										Downgrade
									</Button>
								</ButtonGroup>
							</InlineStack>
						}
                  </Card>
                </Layout.Section>
              </Layout>
            </div>

            <div className="space-10"></div>
            <Layout>
              <Layout.Section>
                <Card>
                  <Text as="p">Need help, have some questions, or just want to say hi? We're available for a live chat 7 days a week from 5 AM EST - 9 PM EST.</Text>
                  <br/>
                  <Text as="p">Not anything urgent? Fire us an email, we usually respond with 24 hours Monday to Friday</Text>
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
