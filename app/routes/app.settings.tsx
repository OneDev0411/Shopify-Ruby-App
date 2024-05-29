import { Card, Grid, Button, Page } from "@shopify/polaris";
import { useAppBridge } from '@shopify/app-bridge-react'
import { useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import { Redirect } from '@shopify/app-bridge/actions';
import { Partners, SettingTabs } from "../components/";
import { CustomTitleBar } from "../components/customtitlebar";

import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import FrontWidgetSection from "../components/FrontWidgetSection.jsx"
import { useShopSettings } from "../hooks/useShopSettings";

import ModalChoosePlan from '../components/modal_ChoosePlan'
// import { onLCP, onFID, onCLS } from 'web-vitals';
// import { traceStat } from "../services/firebase/perf.js";
import ErrorPage from "../components/ErrorPage"
import { useShopState } from "../contexts/ShopContext";
import { IRootState } from "~/store/store";
import { SettingsFormData, ShopSettings, ToastOptions } from "~/types/types";
import "../components/stylesheets/settingPageStyles.css"
import { sendToastMessage } from "~/shared/helpers/commonHelpers";

interface IApiResponse {
    message: string;
}

export default function Settings() {
    const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
    const fetch = useAuthenticatedFetch(shopAndHost.host);
    const { fetchShopSettings, updateShopSettings } = useShopSettings();
    const { shopSettings, setShopSettings, updateShopSettingsAttributes } = useShopState();
    const [formData, setFormData] = useState<SettingsFormData>({
        productDomSelector: '',
        productDomAction: '',
        cartDomSelector: '',
        cartDomAction: '',
        ajaxDomSelector: '',
        ajaxDomAction: ''
    });
    const app = useAppBridge();
    const [error, setError] = useState<Error | null>(null);

    // useEffect(()=> {
    //     onLCP(traceStat, {reportSoftNavs: true});
    //     onFID(traceStat, {reportSoftNavs: true});
    //     onCLS(traceStat, {reportSoftNavs: true});
    //   }, []);

    useEffect(() => {
        const fetchCurrentShop = () => {
            let redirect = Redirect.create(app);
            fetchShopSettings({admin: null})
                .then((response) => response.json())
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
                .catch((error: Error) => {
                    setError(error);
                    console.log("Error > ", error);
                })
        }

        fetchCurrentShop();
    }, []);

    const handleFormChange = (value: string, id: string) => {
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const toggleActivation = () => {
        fetch(`/api/v2/merchant/toggle_activation?shop=${shopAndHost.shop}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response: Response) => response.json())
            .then((data: IApiResponse) => {
                const toastOptions: ToastOptions = {
                    message: data.message,
                    duration: 3000,
                    isError: false,
                };

                sendToastMessage(app, toastOptions);
            })
            .catch((error: Error) => {
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                };
                sendToastMessage(app, toastOptions);
                console.log("Error:", error);
            })
    }

    const handleSave = async () => {
        setShopSettings((prev: ShopSettings) => {
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
                .then((response) => response.json())
                .then((data: IApiResponse) => {
                    const toastOptions = {
                        message: data.message,
                        duration: 3000,
                        isError: false,
                    };
                    sendToastMessage(app, toastOptions);
                })
                .catch((error: Error) => {
                    const toastOptions = {
                        message: "Error saving shop settings",
                        duration: 3000,
                        isError: false,
                    };
                    sendToastMessage(app, toastOptions);
                    console.log('Error: ', error);
                })
            return data
        });
    }

    if (error) { return <ErrorPage showBranding={true} />; }

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
                            {shopSettings ? (
                                <SettingTabs
                                    formData={formData}
                                    currentShop={shopSettings}
                                    updateShop={updateShopSettingsAttributes}
                                    handleFormChange={handleFormChange}
                                />
                            ) : (
                                "Loading..."
                            )}
                        </Card>
                    </Grid.Cell>
                </Grid>
                <div className="space-4"></div>
                <Partners />
            </Page>
        </>
    );
}
