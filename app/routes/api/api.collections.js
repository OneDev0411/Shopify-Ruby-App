import React from "react";
import { json } from "@remix-run/node";

export async function loader({ request }) {
  return json({
    hello: 'world'
  });
}