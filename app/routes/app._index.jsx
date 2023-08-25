import {iculogo} from "@assets";
import "../components/stylesheets/mainstyle.css";
import { GenericTitleBar, OffersList } from "../components";
import { isSubscriptionActive } from "../services/actions/subscription";
import {useEffect, useState, useCallback, useRef} from "react";
import { useAuthenticatedFetch } from "../hooks";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Banner,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useGlobalData } from "~/contexts/global";
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

  const nav = useNavigation();
  const { shop } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  let { theme } = useGlobalData();
  const { shopie } = useSelector(state => ({ shop: 'HEo'}) );

  const fetchCurrentShop = useCallback(async () => {
    const navigate = useNavigate();

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
  }, [setCurrentShop, setPlanName, setTrialDays]);

  useEffect(()=>{
    fetchCurrentShop();
  }, [fetchCurrentShop])

  return (
    <Page
      title={<GenericTitleBar image={iculogo} title={'In Cart Upsell & Cross Sell'} /> }
      primaryAction={null}
    >
    <ui-title-bar title="Remix app template">
      <button variant="primary" >
        Generate a product
      </button>
    </ui-title-bar>
      <Layout>
        <Layout.Section>
          {isSubscriptionActive(currentShop?.subscription) && planName!=='free' && trialDays>0 &&
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
