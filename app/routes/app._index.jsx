// auto generated file
//this is the file that will run on /app url directly
// @ts-nocheck
import "../components/stylesheets/mainstyle.css";
import { TitleBar, OffersList } from "../components";
import { isSubscriptionActive } from "../services/actions/subscription";
import {useEffect, useState, useCallback, useRef, useContext} from "react";
import { useAuthenticatedFetch } from "../hooks";
import { json } from "@remix-run/node";
import {iculogo} from "@assets";

import {
  Page,
  Layout,
  Banner,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import MyGlobalContext from "~/contexts/global";
import { useSelector } from "react-redux";


export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return json({ shop: session.shop.replace(".myshopify.com", "") });
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
    ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );

  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
}

export default function HomePage() {
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [currentShop, setCurrentShop] = useState(null);
  const [planName, setPlanName] = useState();
  const [trialDays, setTrialDays] = useState();
  const { navigate } = useContext(MyGlobalContext);

  useEffect(() => {
    fetch(`/api/merchant/current_shop?shop=${shopAndHost.shop}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then( (response) => { return response.json(); })
      .then( (data) => {
        setCurrentShop(data.shop);
        setPlanName(data.plan);
        setTrialDays(data.days_remaining_in_trial);
      })
      .catch((error) => {
        console.log("error", error);
      })
  }, [shopAndHost.shop, setCurrentShop, setPlanName, setTrialDays, fetch])

  const handleOpenOfferPage = () => {
    navigate('/app/edit-offer', { state: { offerID: null } });
  }

  return (
    <Page fullWidth={true}>
      <TitleBar
        title="In Cart Upsell & Cross Sell"
        image={iculogo}
        buttonText={"Create offer"}
        handleButtonClick={handleOpenOfferPage}
      />
        <Layout>
          <Layout.Section>
            {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays > 0 &&
              <Banner icon='none' status="info">
                <p>{ trialDays } days remaining for the trial period</p>
              </Banner>
            }
          </Layout.Section>
          <Layout.Section>
            <OffersList />
          </Layout.Section>
        </Layout>
    </Page>
  );
};
