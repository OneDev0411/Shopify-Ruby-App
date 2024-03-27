const helpImage =
  "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/support-images/help.svg";

const homeImage =
  "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/plan-images/business-plan.svg";

const billingImg =
  "https://in-cart-upsell.nyc3.cdn.digitaloceanspaces.com/images/billing-ICU-Logo-Small.png";


// @ts-ignore
const CHAT_APP_ID = import.meta.env.VITE_REACT_APP_INTERCOM_APP_ID;

export { homeImage };
export { billingImg };
export { helpImage };
export { default as themeCss } from "./theme.css";
export { default as customCss } from "./custom.css";
export { CHAT_APP_ID };

export const intercomSettingsConfig = (function () {

  // @ts-ignore
  window.intercomSettings = {
    app_id: CHAT_APP_ID
  };

  const w = window;
  // @ts-ignore
  const ic = w.Intercom;

  if (typeof ic === "function") {
      ic('reattach_activator');
      // @ts-ignore
      ic('update', w.intercomSettings);
  }
  else {
      const d = document;
      const i = function () { i.c(arguments); };
      i.q = [];
      i.c = function (args) { i.q.push(args); };
      // @ts-ignore
      w.Intercom = i;

      const loadIntercomScript = function () {
          const s = d.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = `https://widget.intercom.io/widget/${CHAT_APP_ID}`;
          const x = d.getElementsByTagName('script')[0];
          // @ts-ignore
          x.parentNode.insertBefore(s, x);
      };

      if (d.readyState === 'complete') {
          loadIntercomScript();
      // @ts-ignore
      } else if (w.attachEvent) {
          // @ts-ignore
          w.attachEvent('onload', loadIntercomScript);
      } else {
          w.addEventListener('load', loadIntercomScript, false);
      }
  }
})();
