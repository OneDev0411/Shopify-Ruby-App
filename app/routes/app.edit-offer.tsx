import {SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "@remix-run/react";

import {Banner, Icon, Layout, Page, Spinner, Tabs} from '@shopify/polaris';
import {DesktopIcon, MobileIcon, AlertCircleIcon} from '@shopify/polaris-icons';
import {Redirect} from '@shopify/app-bridge/actions';
import {FirstTab} from "../components/EditOffer/tabs/First";
import {SecondTab} from "../components/EditOffer/tabs/Second";
import {ThirdTab} from "../components/EditOffer/tabs/Third";
import {FourthTab} from "../components/EditOffer/tabs/Fourth";
import {OfferPreview} from "../components/OfferPreview";
import "../components/stylesheets/mainstyle.css";
import {EditOfferTabs, OFFER_DEFAULTS} from '../shared/constants/EditOfferOptions';
import {OfferContent, OfferContext} from "../contexts/OfferContext";
import {useOffer} from "../hooks/useOffer.js";
import {useAppBridge} from '@shopify/app-bridge-react';
import {Toast} from '@shopify/app-bridge/actions';
import ErrorPage from "../components/ErrorPage"
import {useShopSettings} from "../hooks/useShopSettings.js";
import {useShopState} from "../contexts/ShopContext";
import { IRootState } from '~/store/store';
import CustomBanner from '~/components/CustomBanner';
import { ShopSettings } from '~/types/types';
// import { onLCP, onFID, onCLS } from 'web-vitals';
// import { traceStat } from "../services/firebase/perf.js";

export default function EditPage() {
    const { offer, setOffer, updateCheckKeysValidity, setInitialVariants, setInitialOfferableProductDetails, enablePublish } = useContext(OfferContext) as OfferContent;
    const { shopSettings, setShopSettings, setThemeAppExtension } = useShopState();
    const { fetchOffer, saveOffer, createOffer } = useOffer();
    const { fetchShopSettings, updateShopSettings } = useShopSettings();
    const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
    const app = useAppBridge();
    const navigateTo = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<Error | null>(null);

    // Content section tab data
    const [selected, setSelected] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [updatePreviousAppOffer, setUpdatePreviousAppOffer] = useState<boolean>(false);

    const offerID = location?.state?.offerID;
    const redirect = Redirect.create(app);

    // useEffect(()=> {
    //     onLCP(traceStat, {reportSoftNavs: true});
    //     onFID(traceStat, {reportSoftNavs: true});
    //     onCLS(traceStat, {reportSoftNavs: true});
    //   }, []);

    //Call on initial render
    useEffect(() => {
        if (location?.state?.offerID == null) {
            // fetching shop settings
            fetchShopSettings({admin: null})
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    updateSettingsOrRedirect(data)

                    let newOffer = {...offer};
                    newOffer.advanced_placement_setting = {
                      custom_product_page_dom_selector: data.shop_settings.custom_product_page_dom_selector,
                      custom_product_page_dom_action: data.shop_settings.custom_product_page_dom_action,
                      custom_cart_page_dom_selector: data.shop_settings.custom_cart_page_dom_selector,
                      custom_cart_page_dom_action: data.shop_settings.custom_cart_page_dom_action,
                      custom_ajax_dom_selector: data.shop_settings.custom_ajax_dom_selector,
                      custom_ajax_dom_action: data.shop_settings.custom_ajax_dom_action,
                    };

                    setOffer(newOffer);
                })
                .catch((error) => {
                    setError(error);
                    console.log("Error > ", error);
                })

        } else {
            setIsLoading(true);
            fetchOffer(offerID, shopAndHost.shop).then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
                navigateTo('/app/offer');
            }).then((data) => {
                setInitialVariants({...data.included_variants});
                if (data.offerable_product_details.length > 0) {
                    updateCheckKeysValidity('text', data.text_a.replace("{{ product_title }}", data.offerable_product_details[0]?.title));
                }
                updateCheckKeysValidity('cta', data.cta_a);
                for (var i = 0; i < data.offerable_product_details.length; i++) {
                    data.offerable_product_details[i].preview_mode = true;
                }
                setOffer({...data});
                setInitialOfferableProductDetails(data.offerable_product_details);
                setIsLoading(false);

                fetchShopSettings({admin: null})
                  .then((response) => {
                      return response.json()
                  })
                  .then((data) => {
                      updateSettingsOrRedirect(data)
                      setUpdatePreviousAppOffer(!updatePreviousAppOffer);
                  })
                  .catch((error) => {
                    setError(error);
                    console.log("Error > ", error);
                  })
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
                console.log("Error > ", error);
            })
        }
        return function cleanup() {
            setOffer(OFFER_DEFAULTS);
        };
    },[]);


    function updateSettingsOrRedirect(data) {
        if (data.redirect_to) {
            redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
            if (Object.keys(data.shop_settings.css_options.main).length === 0) {
                data.shop_settings.css_options.main.color = "#2B3D51";
                data.shop_settings.css_options.main.backgroundColor = "#AAAAAA";
                data.shop_settings.css_options.button.color = "#FFFFFF";
                data.shop_settings.css_options.button.backgroundColor = "#2B3D51";
                data.shop_settings.css_options.widows = '100%';
            }
        }

        setShopSettings && setShopSettings(data.shop_settings);
        setThemeAppExtension && setThemeAppExtension(data.theme_app_extension)
    }

    const save = async (status: boolean) =>  {
        if (offer.title === "") {
            const toastNotice = Toast.create(app, {
                message: 'Offer requires a title',
                duration: 3000,
                isError: true,
            });

            toastNotice.dispatch(Toast.Action.SHOW);
            return
        }

        if (offer.offerable_product_details.length < 1) {
            const toastNotice = Toast.create(app, {
                message: 'Offer requires a valid item',
                duration: 3000,
                isError: true,
            });

            toastNotice.dispatch(Toast.Action.SHOW);
            return
        }

        let shop_uses_ajax_cart: boolean;

        if(offer.in_product_page && offer.in_cart_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_ajax_cart && offer.in_cart_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_cart_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_product_page) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }
        else if (offer.in_ajax_cart) {
            shop_uses_ajax_cart = offer.in_ajax_cart;
        }

        setIsLoading(true);
        setShopSettings && setShopSettings(prev => {
            let data = {
                ...prev, uses_ajax_cart: shop_uses_ajax_cart
            }
            updateShopSettings(data)
                .then((response) => { return response.json(); })
                .then((data) => {
                    console.log('updated shop settings', data)
                })
                .catch((error) => {
                    setError(error);
                    console.log('an error during api call', error)
                })
            return data
        });

        if (location.state != null && location.state?.offerID == null) {
            try {
                let responseData = await createOffer(offer, shopSettings as ShopSettings, status)
                location.state.offerID = responseData.offer.id
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                  };
                  const toastError = Toast.create(app, toastOptions);
                  toastError.dispatch(Toast.Action.SHOW);
                console.log('Error:', error);
            }
        } else {
            try {
                await saveOffer(offer, location, shopSettings, status);
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                const toastOptions = {
                    message: 'An error occurred. Please try again later.',
                    duration: 3000,
                    isError: true,
                  };
                  const toastError = Toast.create(app, toastOptions);
                  toastError.dispatch(Toast.Action.SHOW);
            }
        }
        navigateTo('/app/offer');
    }

    function saveDraft() {
        save(false);
    }

    // Preview section tab data
    const [selectedPre, setSelectedPre] = useState<number>(0);
    const handlePreTabChange = useCallback((selectedPreTabIndex: number) => {
        setSelectedPre(selectedPreTabIndex);
        if (selectedPreTabIndex == 0) {
            setShopSettings && setShopSettings(previousState => {
                return {...previousState, selectedView: 'desktop'};
            });
        } else {
            setShopSettings && setShopSettings(previousState => {
                return {...previousState, selectedView: 'mobile'};
            });
        }
    }, []);

    const tabsPre = [
        {
            id: 'desktop',
            content: 'Desktop',
            icon: (
                <div className='flex-tab'>
                    <Icon source={DesktopIcon}/>
                    <p>Desktop</p>
                </div>
            ),
            panelID: 'desktop',
        },
        {
            id: 'mobile',
            content: 'Mobile',
            icon: (
                <div className='flex-tab'>
                    <Icon source={MobileIcon}/>
                    <p>Mobile</p>
                </div>
            ),
            panelID: 'mobile',
        }
    ];

    function publishOffer() {
        save(true);
    };

    const changeTab = () => {
        setSelected(selected + 1)
    }

    if (error) { return < ErrorPage/>; }

    return (
        <div className="edit-offer" style={{
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
        }}>
            {isLoading ? (
                <Spinner size="large"/>
            ) : (
                <Page
                    backAction={{content: 'Offers', url: '/app'}}
                    title="Create new offer"
                    primaryAction={{content: 'Publish', disabled: enablePublish || shopSettings?.offers_limit_reached, onAction: publishOffer}}
                    secondaryActions={[{content: 'Save Draft', disabled: false, onAction: () => saveDraft()}]}
                >
                    <Layout>
                        <Layout.Section>
                            <div className="offer-tabs-no-padding">
                                <Tabs
                                    tabs={EditOfferTabs}
                                    selected={selected}
                                    onSelect={setSelected}
                                    disclosureText="More views"
                                    fitted
                                >
                                    { shopSettings?.offers_limit_reached && (
                                        <CustomBanner
                                            icon={AlertCircleIcon}
                                            icon_color={"rgb(183,125,11)"}
                                            content="You are currently at the limit for published offers. "
                                            link_keyword="Click here"
                                            after_link_content=" to upgrade your plan and get access to unlimited offers and features!"
                                            background_color="rgb(252,239,212)"
                                            border_color="rgb(244,197,84)"
                                            link_to={"/app/subscription"}
                                            name="limited_publish_offer" />
                                    )}
                                    <div className='space-4'></div>

                                    {selected == 0 ?
                                        // page was imported from components folder
                                        <FirstTab handleTabChange={changeTab} />
                                        : ""}
                                    {selected == 1 ?
                                        // page was imported from components folder
                                        <SecondTab handleTabChange={changeTab} />
                                        : ""}
                                    {selected == 2 ?
                                        // page was imported from components folder
                                        <ThirdTab saveDraft={saveDraft} publishOffer={publishOffer}
                                                 handleTabChange={changeTab}/>
                                        : ""}
                                    {selected == 3 ?
                                        // page was imported from components folder
                                        <FourthTab saveDraft={saveDraft} publishOffer={publishOffer} />
                                        : ""}
                                </Tabs>
                            </div>
                        </Layout.Section>
                        <Layout.Section variant="oneThird">
                            <div className="offer-tabs-no-padding">
                                <Tabs
                                    tabs={tabsPre}
                                    selected={selectedPre}
                                    onSelect={handlePreTabChange}
                                    disclosureText="More views"
                                    fitted
                                >
                                    <div style={{paddingTop: '40px', marginTop: '-40px'}}></div>
                                    {selectedPre == 0 ?
                                        <OfferPreview updatePreviousAppOffer={updatePreviousAppOffer}/>
                                        :
                                        <OfferPreview updatePreviousAppOffer={updatePreviousAppOffer}/>}
                                </Tabs>
                            </div>
                        </Layout.Section>
                    </Layout>
                </Page>
            )}
        </div>
    );
}

