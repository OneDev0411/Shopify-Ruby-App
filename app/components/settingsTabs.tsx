import { Tabs, Card, TextField, Checkbox } from '@shopify/polaris';
import { useState } from 'react';
import { SettingsFormData, ShopSettings } from '~/types/types';
import { CustomDomAction } from './molecules';

interface ISettingTabsProps {
    formData: SettingsFormData;
    currentShop: ShopSettings;
    updateShop: ((updatedValue: string | boolean, ...updatedKey: string[]) => void);
    handleFormChange: (value: string, id: string) => void;
}

export function SettingTabs({
    formData, 
    currentShop, 
    updateShop, 
    handleFormChange
}: ISettingTabsProps) {
    // Tabs
    const [selected, setSelected] = useState<number>(0);

    const handleTabChange = (selectedTabIndex: number) => {
        setSelected(selectedTabIndex);
    }
    const handleAjaxRefreshCode = (newValue: string) => updateShop(newValue, "ajax_refresh_code");
    const handleUsesAjaxCartChange = (newValue: boolean) => updateShop(newValue, "uses_ajax_cart");
  
    const tabs = [
        {
            id: 'all-customers-1',
            content: 'Product page',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
            innerContent:
                <CustomDomAction
                    selectorId="productDomSelector"
                    actionId="productDomAction"
                    selectorValue={formData.productDomSelector}
                    actionValue={formData.productDomAction}
                    onChangeSelector={handleFormChange}
                    onChangeAction={handleFormChange}
                />
        },
        {
            id: 'accepts-marketing-1',
            content: 'Cart page',
            panelID: 'accepts-marketing-content-1',
            innerContent:
                <CustomDomAction
                    selectorId="cartDomSelector"
                    actionId="cartDomAction"
                    selectorValue={formData.cartDomSelector}
                    actionValue={formData.cartDomAction}
                    onChangeSelector={handleFormChange}
                    onChangeAction={handleFormChange}
                />
        },
        {
            id: 'repeat-customers-1',
            content: 'Ajax cart',
            panelID: 'repeat-customers-content-1',
            innerContent:
                <>
                    <CustomDomAction
                        selectorId="ajaxDomSelector"
                        actionId="ajaxDomAction"
                        selectorValue={formData.ajaxDomSelector}
                        actionValue={formData.ajaxDomAction}
                        onChangeSelector={handleFormChange}
                        onChangeAction={handleFormChange}
                    />
                    <br/>
                    <Checkbox
                        label="My store uses an AJAX (popup or drawer-style) cart"
                        checked={currentShop.uses_ajax_cart}
                        onChange={handleUsesAjaxCartChange}
                    ></Checkbox>
                    {(currentShop.uses_ajax_cart) && (
                        <>
                            <br/><br/>
                            <TextField
                                label="AJAX refresh code"
                                value={currentShop.ajax_refresh_code}
                                onChange={handleAjaxRefreshCode}
                                multiline={6}
                                autoComplete="off"
                            ></TextField>
                        </>
                    )}
                </>
        }
    ];

    return(
        <>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <Card>
                    <div>{tabs[selected].innerContent}</div>
                    <div className="space-4"></div>
                </Card>
            </Tabs>
        </>
    );
}