// auto generated file
// Entry Point for our code, and it wraps around the entire application code that's found in routes folder
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import {themeCss} from "@assets";
import type { LinksFunction } from "@remix-run/node";
import slick from "slick-carousel/slick/slick.css"
import slickTheme from "slick-carousel/slick/slick-theme.css"
import polarisViz from '@shopify/polaris-viz/build/esm/styles.css';

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : []),
    { rel: "stylesheet", href: polarisStyles},
    { rel: "stylesheet", href: themeCss },
    {rel: "stylesheet", href: slick},
    {rel: "stylesheet", href: polarisViz},
    {rel: "stylesheet", href: slickTheme}
]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Any subroutes are going to be rendered here means every route will be placed here in outlet component*/}
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
