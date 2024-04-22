import React, { useEffect } from 'react';
import {Redirect} from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useSelector } from "react-redux";
import { useAuthenticatedFetch } from "../hooks";
import { Toast } from '@shopify/app-bridge/actions';
import { IRootState } from '~/store/store';

const ConfirmFromOutside = () => {
  const urlParams = new URLSearchParams(typeof document !== 'undefined' ? window.location.search : '');
  const shopify_domain = urlParams.get('shop');
  const charge_id = urlParams.get('charge_id');
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  async function renderConfirmCharge(){

    fetch(`/api/v2/merchant/subscription/confirm_charge?shop=${shopify_domain}&charge_id=${charge_id}`, {
      method: 'GET',
         headers: {
           'Content-Type': 'application/json',
         },
     })
     .then( (response) => { return response.json(); })
     .then( (data) => {
      if (typeof document !== 'undefined' && window.top == window.self) {
        // If the current window is the 'parent', change the URL by setting location.href  
        redirect.dispatch(Redirect.Action.REMOTE, `/confirm_charge?success=${data.success}`);
  
      } else {
        // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
        redirect.dispatch(Redirect.Action.APP, `/confirm_charge?success=${data.success}`);
  
      }
     })
     .catch((error) => {
      const toastOptions = {
        message: 'An error occurred. Please try again later.',
        duration: 3000,
        isError: true,
      };
      const toastError = Toast.create(app, toastOptions);
      toastError.dispatch(Toast.Action.SHOW);
      console.log("error", error);
     })
  }

  useEffect(() => {
    const fetchData = async () => {
      await renderConfirmCharge();
    }

    fetchData()
    .catch(console.error)
  }, []);

  return <div></div>;
};

export default ConfirmFromOutside;