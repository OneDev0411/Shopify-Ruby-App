// auto generated file
// Entry Point for our code and it wraps around the entire application code that's found in routes folder
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import {themeCss} from "@assets";

export const links = () => [{ rel: "stylesheet", href: polarisStyles}, { rel: "stylesheet", href: themeCss }];

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
