import { passThrough } from "../utils/api";

export async function loader({ request }) {
  return passThrough(request);
}

export async function action({ request }) {
  return passThrough(request);
}