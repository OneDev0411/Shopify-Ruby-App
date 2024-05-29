// auto generated file

import { authenticate } from "../shopify.server";
import { ActionFunction } from "@remix-run/node";

import db from "../db.server";

export const action: ActionFunction = async ({ request }) => {
  const { topic, shop, session } = await authenticate.webhook(request);

  switch (topic) {
      // @ts-ignore
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
