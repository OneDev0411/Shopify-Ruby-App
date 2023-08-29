import { json } from "@remix-run/node";
import jwt from 'jsonwebtoken';

export async function passThrough(request, pathname = '', body = undefined) {  
  const authenticated = verifyJWT(request.headers.get('authorization')?.replace('Bearer ', ''), process.env.SHOPIFY_APP_SECRET);
  if (!authenticated) {
    return new Response("Not Allowed", {
      status: 401,
      statusText: "Not Allowed",
    });
  };

  // Change the host to proxy to our actual endpoint
  request.headers.set('host', process.env.API_HOST);
  // Also change the request url to ensure that the request is proxied properly
  const symbols = Object.getOwnPropertySymbols(request);
  const internals = request[symbols.find(sym => String(sym).includes('Request internals')) as any];
  const parsedURL = internals?.parsedURL;
  const requestPath = parsedURL?.searchParams?.get('pathname');
  // replace the pathname if a new path is passed.
  const endpoint = `${parsedURL.href.replace(parsedURL.host, process.env.API_HOST).replace(requestPath, pathname || requestPath)}`;
  internals.parsedURL =  new URL(endpoint);

  const response = await fetch(request, {
    ...request,
    method: request.method,
    headers: request.headers,
    body: body || request.body,
  })
  .then(async(response) => response.text())
  .then((text) => {
    try {
      return JSON.parse(text)
    } catch {
      return { error: text }
    }
  })
  .catch((error) => {
      return { error: error.toString() }
  });
  return json(response);
}

export const verifyJWT = (token: string, secret: string | undefined): boolean => {
  if(!secret || !token) return false;
  try {
    const decoded = jwt.verify(token, secret);
    console.log('Success decoding and verifying JWT:', decoded);
    return true;
  } catch (error) {
    console.error('Error while decoding and verifying JWT:', error);
    return false;
  }
};



  // request.url = endpoint;
  // const parsedURL = new URL(request.url);
  // if (parsedURL?.searchParams.get('pathname')?.includes('api/merchant/offers_list')){
  //   console.log('PATH DATA', endpoint);
  // }

  // if (parsedURL?.searchParams.get('pathname')?.includes('api/merchant/offers_list')){
  //   console.log('RESPONSE HEADERS', headers)
  // }
  // console.log('REQUEST', request.url);
  // .then(async(response) => {
  //   return {
  //     ok: response.ok,
  //     headers: response.headers,
  //     text: await response.text(),
  //   }
  // })
  // .then(({ok, text, headers}) => {
  //   try {
  //     return JSON.parse(text)
  //   } catch {
  //     return { error: text }
  //   }
  // })
  // .catch((error) => {
  //     return { error: error.toString() }
  // });
  // return json(response);
