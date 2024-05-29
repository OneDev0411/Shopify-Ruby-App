import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { useSelector } from "react-redux";
import {Icon} from '@shopify/polaris';

import { IRootState } from "~/store/store";

import { useAuthenticatedFetch } from "../hooks";

const ABTestBanner = ({ icon, icon_color, content, background_color, border_color }) => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [abTestBannerPage, setAbTestBannerPage] = useState<string>("");

  const openBanner = () => {
    if (
      (location.pathname === "/" && abTestBannerPage === "dashboard") ||
      location.pathname.endsWith(abTestBannerPage)
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (localStorage.getItem("abTestBannerPage") === null) {
      fetch(`/api/v2/merchant/ab_test_banner_page?shop=${shopAndHost.shop}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.page !== "") {
            setAbTestBannerPage(data.page);
            localStorage.setItem("abTestBannerPage", data.page);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      setAbTestBannerPage(localStorage.getItem("abTestBannerPage") || "");
    }
  }, []);

  const handleOnClickBanner = () => {
    fetch(`/api/v2/merchant/ab_test_banner_click?shop=${shopAndHost.shop}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        navigateTo("/app/subscription");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      {openBanner() && (
         <div style={{ padding: "20px", 
                       display: "flex", 
                       borderRadius: "10px",
                       backgroundColor: `${background_color}`, 
                       border: `1px solid ${border_color}`
                    }}>
          <div style={{ color: `${icon_color}`}}>
            <Icon source={icon}/>
          </div>
          <div style={{ marginLeft: "1%"}}>
            <p>
              You're currently on the Free plan, and limited to one published
              offer at a time.{" "}
              <a href="#" onClick={handleOnClickBanner}>
                Click here
              </a>{" "}
              to upgrade your plan to get access to more features, and unlimited
              offers!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ABTestBanner;
