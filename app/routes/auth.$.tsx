// auto generated file
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  await authenticate.admin(request);

  return null;
}

export async function action({ request }) {

  return null;
}
