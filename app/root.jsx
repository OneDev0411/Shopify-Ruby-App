import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import MyGlobalContext from './contexts/global';

export default function App() {
  let globalData = {
    theme: 'dark',
    // ... other data
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MyGlobalContext.Provider value={globalData}>
          <Outlet />
          <ScrollRestoration />
          <LiveReload />
          <Scripts />
        </MyGlobalContext.Provider>
      </body>
    </html>
  );
}
