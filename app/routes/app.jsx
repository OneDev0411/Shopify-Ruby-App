// @ts-nocheck
// auto generated file

import React, { useEffect } from "react";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import { boundary } from "@shopify/shopify-app-remix";
// manually imported provider
import { Provider } from "react-redux";
import store from "../store/store";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import { intercomSettingsConfig } from "../assets/index";
import ShopProvider from "../contexts/ShopContext"
import OfferProvider from "../contexts/OfferContext";
import EnvProvider from "../contexts/EnvContext"
import { authenticate } from "../shopify.server";

// manually imported provider
import MyGlobalContext from "~/contexts/global";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  // const symbols = Object.getOwnPropertySymbols(request);
  // const internals = request[symbols.find(sym => String(sym).includes('Request internals'))];
  // const parsedURL = internals?.parsedURL;
  const parsedURL = new URL(request.url);
  // console.log('SESSION', parsedURL, session);
  // return json({ shop: session.shop.replace(".myshopify.com", "") });
  return json({
    polarisTranslations: require("@shopify/polaris/locales/en.json"),
    apiKey: process.env.SHOPIFY_API_KEY,
    session,
    host: parsedURL?.searchParams.get('host'),
    ENV: {
      SERVER_BASE_URL: process.env.SERVER_BASE_URL,
      CHOOSE_PLAN_MODAL_CONTENT: process.env.CHOOSE_PLAN_MODAL_CONTENT,
      INTERCOM_APP_ID: process.env.INTERCOM_APP_ID,
      ERROR_IMG_URL: process.env.ERROR_IMG_URL,
      ERROR_TITLE: process.env.ERROR_TITLE,
      ERROR_CONTENT: process.env.ERROR_CONTENT,
      SHOPIFY_ICU_EXTENSION_APP_ID: process.env.SHOPIFY_ICU_EXTENSION_APP_ID
    },
  });
}

export default function App() {
  const { apiKey, polarisTranslations, session, host, ENV } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    // configured intercom settings
    const moduleScripts = document.head.querySelectorAll("script[type='module']");
    if (moduleScripts.length > 0) {
      moduleScripts[0].append(intercomSettingsConfig()); 
    }
  }, []);

  console.log('HOST', host);
  return (
    <>
      <script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        data-api-key={apiKey}
      />
      <ui-nav-menu>
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
      
      <MyGlobalContext.Provider value={{...session, host, navigate}}>
        <EnvProvider env={ENV}>
          <AppBridgeProvider config={{ host, apiKey, forceRedirect: true }}>
            <PolarisAppProvider i18n={polarisTranslations} linkComponent={RemixPolarisLink}>
              <Provider store={store}>
                <ShopProvider>
                  <OfferProvider>
                    <Outlet />
                    <script dangerouslySetInnerHTML={{__html: `window.ENV = ${JSON.stringify(ENV)}`}}/>
                  </OfferProvider>
                </ShopProvider>
              </Provider>           
            </PolarisAppProvider>
          </AppBridgeProvider>
        </EnvProvider>
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
