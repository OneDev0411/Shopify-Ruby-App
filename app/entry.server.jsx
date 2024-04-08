// auto generated file
// setup for remix in this file
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
// manually imported provider and store
import { Provider } from 'react-redux';
import store from './store/store';

import { addDocumentResponseHeaders } from "./shopify.server";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  _loadContext
) {
  addDocumentResponseHeaders(request, responseHeaders);

  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";
  
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      // wrap the auto generated remix server code in provider
      <Provider store={store}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
        </Provider>
      ,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
