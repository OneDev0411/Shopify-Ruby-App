import React from "react";
import { CustomTitleBar } from "../components/customtitlebar";

const ErrorPage = ({ showBranding }) => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      { showBranding &&
        // @ts-ignore
        <CustomTitleBar
        title="In Cart Upsell & Cross Sell"
        image={"https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/ICU-Logo-Small.png"}
      />
      }
      <img
        src={ '' }
        alt= "Error Image"
        style={{ maxWidth: "100%", maxHeight: "400px", marginTop: "20px" }}
      />
      <h2 style={{ fontSize: "22px", fontStyle: "bold", lineHeight: "45px" }}> {  } </h2>
      <p style={{ fontSize: "17px" }}> {  } </p>
    </div>
  );
};
export default ErrorPage;
