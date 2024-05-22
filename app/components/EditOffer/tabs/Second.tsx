import { useState, useCallback } from 'react';
import { Button, LegacyStack } from "@shopify/polaris";
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
            <ChoosePlacement />
            <div className="space-10"/>

            <DisplayConditions />
            <div className="space-10"/>

            <div className="space-4"></div>
            <LegacyStack distribution="center">
                <Button onClick={handleTabChange}>Continue to Appearance</Button>
            </LegacyStack>
            <div className="space-10"></div>
        </div>
    );
}
