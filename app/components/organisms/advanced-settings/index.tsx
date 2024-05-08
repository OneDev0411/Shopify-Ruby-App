import {
    Card,
    TextField,
    Checkbox,
    Text,
} from "@shopify/polaris";
import { useCallback, useContext } from "react";
import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import { DomAction } from "../../molecules";

const AdvancedSettings = () => {

    const { offer, updateOffer, updateNestedAttributeOfOffer } = useContext(OfferContext) as OfferContent;
    const handleChange = useCallback((newChecked: boolean) => updateOffer("save_as_default_setting", newChecked), []);
    const handleProductDomSelector = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting",  "custom_product_page_dom_selector"), []);
    const handleProductDomAction = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_product_page_dom_action"), []);
    const handleCartDomSelector = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_selector"), []);
    const handleCartDomAction = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_cart_page_dom_action"), []);
    const handleAjaxDomSelector = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_selector"), []);
    const handleAjaxDomAction = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "advanced_placement_setting", "custom_ajax_dom_action"), []);
    const handleOfferCss = useCallback((newValue: string) => updateNestedAttributeOfOffer(newValue, "custom_css"), []);

    return (
        <>
            {/* <Card sectioned title="Offer placement - advanced settings" actions={[{ content: 'View help doc' }]}> */}
            <Card sectioned title="Offer placement - advanced settings">
                {(!offer?.advanced_placement_setting?.advanced_placement_setting_enabled) && (
                    <>
                        <b>To edit Advanced settings, enable "Advanced Placement Settings" option on the Placement tab.</b>
                        <br/><br/><br/>
                    </>
                )}
                <DomAction
                    title="Product page"
                    actionId="productDomAction"
                    selectorValue={offer?.advanced_placement_setting?.custom_product_page_dom_selector}
                    actionValue={offer?.advanced_placement_setting?.custom_product_page_dom_action}
                    onChangeSelector={handleProductDomSelector}
                    onChangeAction={handleProductDomAction}
                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                />

                <DomAction
                    title="Cart page"
                    actionId="cartDomAction"
                    selectorValue={offer?.advanced_placement_setting?.custom_cart_page_dom_selector}
                    actionValue={offer?.advanced_placement_setting?.custom_cart_page_dom_action}
                    onChangeSelector={handleCartDomSelector}
                    onChangeAction={handleCartDomAction}
                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                />

                <DomAction
                    title="AJAX/Slider cart"
                    actionId="ajaxDomAction"
                    selectorValue={offer?.advanced_placement_setting?.custom_ajax_dom_selector}
                    actionValue={offer?.advanced_placement_setting?.custom_ajax_dom_action}
                    onChangeSelector={handleAjaxDomSelector}
                    onChangeAction={handleAjaxDomAction}
                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                />

                <div>
                    <div style={{paddingBottom: '10px'}}>
                        <Text variant="headingSm" as="h2">Custom CSS</Text>
                    </div>

                    <TextField
                        value={offer?.custom_css}
                        onChange={handleOfferCss}
                        multiline={6}
                        autoComplete="off"
                        label={"Custom CSS"}
                        labelHidden
                    />
                </div>
                <br/>

                <Checkbox
                    label="Save as default settings"
                    helpText="This placement will apply to all offers created in the future.
                     They can be edited in the Settings section."
                    checked={offer?.save_as_default_setting}
                    onChange={handleChange}
                    disabled={!offer?.advanced_placement_setting?.advanced_placement_setting_enabled}
                />
            </Card>
        </>
    );
}

export default AdvancedSettings;
