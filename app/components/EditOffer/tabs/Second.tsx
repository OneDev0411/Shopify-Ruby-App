import { useState, useCallback } from 'react';
import {BlockStack, Button, LegacyStack} from "@shopify/polaris";
import { ChoosePlacement, DisplayConditions } from "../../organisms/index";

interface ISecondTabProps {
    handleTabChange: () => void
}

export function SecondTab({ handleTabChange }: ISecondTabProps) {
    const [disableCheckoutInfo, setDisableCheckoutInfo] = useState<string>('')

    const changeDisableCheckoutInfo = useCallback((value: string) => {
        setDisableCheckoutInfo(value);
    }, [disableCheckoutInfo]);

    return (
        <div id="polaris-placement-cards">
            <BlockStack gap={"500"}>
                <BlockStack gap={"500"}>
                    <ChoosePlacement />

                    <DisplayConditions />
                </BlockStack>
                <BlockStack>
                    <div className="align-center">
                        <span className="padding-fit"><Button onClick={handleTabChange}>Continue To Appearance</Button></span>
                    </div>
                </BlockStack>
            </BlockStack>
        </div>
    );
}
