import { CustomTitleBar } from "./customtitlebar";
import {useEnv} from "../contexts/EnvContext";

interface IErrorPageProps {
  showBranding?: boolean;
};

const ErrorPage = ({ showBranding }: IErrorPageProps) => {
  const env = useEnv();
  console.log("USE ENV", env)
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      { showBranding &&
        <CustomTitleBar
          title="In Cart Upsell & Cross Sell"
          image={"https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/ICU-Logo-Small.png"}
        />
      }
      <img
        src={ env.ERROR_IMG_URL }
        alt= "Error Image"
        style={{ maxWidth: "100%", maxHeight: "400px", marginTop: "20px" }}
      />
      <h2 style={{ fontSize: "22px", fontStyle: "bold", lineHeight: "45px" }}> { env.ERROR_TITLE  } </h2>
      <p style={{ fontSize: "17px" }}> { env.ERROR_CONTENT   } </p>
    </div>
  );
};
export default ErrorPage;
