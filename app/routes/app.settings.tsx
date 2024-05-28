import { Card, Grid, Button, Page } from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'
import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from "react";
import { Redirect, Toast } from '@shopify/app-bridge/actions';
import { Partners, SettingTabs } from "../components/";
import {CustomTitleBar } from "../components/customtitlebar";

import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useShopSettings} from "../hooks/useShopSettings";
import FrontWidgetSection from "../components/FrontWidgetSection.jsx"

import ModalChoosePlan from '../components/modal_ChoosePlan'
// import { onLCP, onFID, onCLS } from 'web-vitals';
// import { traceStat } from "../services/firebase/perf.js";
import ErrorPage from "../components/ErrorPage.jsx"
import {useShopState} from "../contexts/ShopContext.jsx";
import { IRootState } from "~/store/store";
import { ShopSettings } from "~/types/types";

interface IFormData {
    productDomSelector?: string;
    productDomAction?: string;
    cartDomSelector?: string;
    cartDomAction?: string;
    ajaxDomSelector?: string;
    ajaxDomAction?: string;
}

interface IApiResponse {
    message: string;
}

export default function Settings() {
    const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const { fetchShopSettings, updateShopSettings } = useShopSettings();
    const { shopSettings, setShopSettings, updateShopSettingsAttributes } = useShopState();
    const [formData, setFormData] = useState<IFormData>({});
    const app = useAppBridge();
    const [error, setError] = useState(null);

    // useEffect(()=> {
    //     onLCP(traceStat, {reportSoftNavs: true});
    //     onFID(traceStat, {reportSoftNavs: true});
    //     onCLS(traceStat, {reportSoftNavs: true});
    //   }, []);

    useEffect(() => {
        fetchCurrentShop();
    }, []);

    const fetchCurrentShop = useCallback(async () => {
        let redirect = Redirect.create(app);
        setShopSettings && fetchShopSettings({admin: null})
            .then((response) => { return response.json() })
            .then((data) => {
                if (data.redirect_to) {
                    redirect.dispatch(Redirect.Action.APP, data.redirect_to);
                }
                setShopSettings(data.shop_settings);
                setFormData({
                    productDomSelector: data.shop_settings?.custom_product_page_dom_selector,
                    productDomAction: data.shop_settings?.custom_product_page_dom_action,
                    cartDomSelector: data.shop_settings?.custom_cart_page_dom_selector,
                    cartDomAction: data.shop_settings?.custom_cart_page_dom_action,
                    ajaxDomSelector: data.shop_settings?.custom_ajax_dom_selector,
                    ajaxDomAction: data.shop_settings?.custom_ajax_dom_action,
                })
            })
            .catch((error) => {
                setError(error);
                console.log("Error > ", error);
            })
    }, [])

    const handleFormChange = (value: string, id: string) => {
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const toggleActivation = async () => {
        fetch(`/api/v2/merchant/toggle_activation?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response: Response) => { return response.json()as Promise<IApiResponse>; })
            .then((data: IApiResponse) => {
                const toastOptions = {
                    message: data.message,
                    duration: 3000,
                    isError: false,
                };
                const toastNotice = Toast.create(app, toastOptions);
                toastNotice.dispatch(Toast.Action.SHOW);
                // TODO check this function
                if (updateShopSettingsAttributes) {
                    updateShopSettingsAttributes(!shopSettings.activated, 'activated');
                }

            })
            .catch((error: Error) => {
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                };
                const toastError = Toast.create(app, toastOptions);
                toastError.dispatch(Toast.Action.SHOW);
                console.log("Error:", error);
            })
    }

    const handleSave = async () => {
        setShopSettings && setShopSettings((prev: ShopSettings) => {
            let data = {
                ...prev,
                custom_product_page_dom_selector: formData.productDomSelector,
                custom_product_page_dom_action: formData.productDomAction,
                custom_cart_page_dom_selector: formData.cartDomSelector,
                custom_cart_page_dom_action: formData.cartDomAction,
                custom_ajax_dom_selector: formData.ajaxDomSelector,
                custom_ajax_dom_action: formData.ajaxDomAction,
            };
            updateShopSettings(data)
                .then((response) => { return response.json(); })
                .then((data) => {
                    const toastOptions = {
                        message: data.message,
                        duration: 3000,
                        isError: false,
                    };
                    const toastNotice = Toast.create(app, toastOptions);
                    toastNotice.dispatch(Toast.Action.SHOW);
                })
                .catch(() => {
                    const toastOptions = {
                        message: "Error saving shop settings",
                        duration: 3000,
                        isError: false,
                    };
                    const toastNotice = Toast.create(app, toastOptions);
                    toastNotice.dispatch(Toast.Action.SHOW);
                })
            return data
        });
    }

    if (error) { return < ErrorPage showBranding={true} />; }

    return (
        <>
            <Page>
                <ModalChoosePlan />
                <CustomTitleBar title='Settings' buttonText='Save' handleButtonClick={handleSave} />
                <FrontWidgetSection isStatusActive={shopSettings?.activated} toggleActivation={toggleActivation} />
                <div className="space-4"></div>
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                        <div id="no-bg-Card">
                            <Card>
                                <h2><strong>Default offer placement settings</strong></h2>
                                <br />
                                <p>Only edit these settings if you know HTML.</p>
                            </Card>
                        </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                        <Card>
                            {/* Tabs */}
                            {shopSettings ? <SettingTabs formData={formData} currentShop={shopSettings} updateShop={updateShopSettingsAttributes} handleFormChange={handleFormChange} /> : 'Loading...'}
                        </Card>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners />
            </Page>
        </>
    );
}
