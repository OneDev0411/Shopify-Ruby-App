import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useEnv } from '../contexts/EnvContext';
import React from 'react'
import { AppBridgeState, ClientApplication } from "@shopify/app-bridge";

/**
 * A hook that returns an auth-aware fetch function.
 * @desc The returned fetch function that matches the browser's fetch API
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * It will provide the following functionality:
 *
 * 1. Add a `X-Shopify-Access-Token` header to the request.
 * 2. Check response for `X-Shopify-API-Request-Failure-Reauthorize` header.
 * 3. Redirect the user to the reauthorization URL if the header is present.
 *
 * @returns {Function} fetch function
 */
export function useAuthenticatedFetch(host: string) {
  const env = useEnv();
  const app = useAppBridge();
  const fetchFunction = authenticatedFetch(app);
  return React.useCallback(async (uri: string, options: RequestInit) => {
    const req_url = `${env.SERVER_BASE_URL}${uri}`
    const hasQueryParams = uri.includes("?");
    const uriWithHost = hasQueryParams
      ? `${req_url}&host=${host}`
      : `${req_url}?host=${host}`;
    try {
      const response = await fetchFunction(uriWithHost, options);
      checkHeadersForReauthorization(response.headers, app);
      return response;
    } 
    catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }, [env, app, fetchFunction, host]);
}

function checkHeadersForReauthorization(headers: Headers, app: ClientApplication<AppBridgeState>) {
  if (headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
    const authUrlHeader =
      headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url") ||
      `/api/auth`;

    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.REMOTE,
      authUrlHeader.startsWith("/")
        ? `https://${typeof document !== "undefined" && window.location.host}${authUrlHeader}`
        : authUrlHeader
    );
  }
}
