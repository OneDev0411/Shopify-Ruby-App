import React from "react";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix";
import { Provider } from "react-redux";
import store from "../store/store";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
const url = require('url');

import { authenticate } from "../shopify.server";
import MyGlobalContext from "~/contexts/global";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  // const symbols = Object.getOwnPropertySymbols(request);
  // const internals = request[symbols.find(sym => String(sym).includes('Request internals'))];
  // const parsedURL = internals?.parsedURL;
  const parsedURL = new URL(request.url);

  // return json({ shop: session.shop.replace(".myshopify.com", "") });
  return json({
    polarisTranslations: require("@shopify/polaris/locales/en.json"),
    apiKey: process.env.SHOPIFY_API_KEY,
    session,
    host: parsedURL?.searchParams.get('host'),
  });
}

export default function App() {
  const { apiKey, polarisTranslations, session, host } = useLoaderData();
  const navigate = useNavigate();

  console.log('HOST', host);
  return (
    <>
      <script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        data-api-key={apiKey}
      />
      <MyGlobalContext.Provider value={{session, navigate}}>
        <AppBridgeProvider
          config={{ host, apiKey, forceRedirect: true }}
        >
          <PolarisAppProvider
            i18n={polarisTranslations}
            linkComponent={RemixPolarisLink}
          >
            <Provider store={store}>
              <ui-nav-menu>
                <Link to="/app/dashboard">
                  Dashboard
                </Link>
                <Link to="/app/offer">
                  Offers
                </Link>
                <Link to="/app/analytics">
                  Analytics
                </Link>
                <Link to="/app/subscription">
                  Subscription
                </Link>
                <Link to="/app/settings">
                  Settings
                </Link>
                <Link to="/app/help">
                  Help
                </Link>
              </ui-nav-menu>
              <Outlet />
            </Provider>
          </PolarisAppProvider>
        </AppBridgeProvider>
      </MyGlobalContext.Provider>
    </>
  );
}

/** @type {any} */
const RemixPolarisLink = React.forwardRef((/** @type {any} */ props, ref) => (
  <Link {...props} to={props.url ?? props.to} ref={ref}>
    {props.children}
  </Link>
));

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
