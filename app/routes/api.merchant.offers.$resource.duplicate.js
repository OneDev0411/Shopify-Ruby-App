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
  return json({
    hello: 'world'
  });
}