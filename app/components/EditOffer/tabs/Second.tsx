import { useState, useCallback } from 'react';
import { Button, LegacyStack } from "@shopify/polaris";
import { ChoosePlacement, DisplayConditions } from "../../organisms/index";
import { AutopilotCheck } from '~/types/types';

interface ISecondTabProps {
    autopilotCheck: AutopilotCheck,
    handleTabChange: () => void
    enableOrDisablePublish: (enable: boolean) => void
}

export function SecondTab(props: ISecondTabProps) {
    const [disableCheckoutInfo, setDisableCheckoutInfo] = useState<string>('')

    const changeDisableCheckoutInfo = useCallback((value: string) => {
         setDisableCheckoutInfo(value);
    }, [disableCheckoutInfo]);

    return (
        <div id="polaris-placement-cards">
            <ChoosePlacement
                autopilotCheck={props.autopilotCheck}
                enableOrDisablePublish={props.enableOrDisablePublish}
            />
            <div className="space-10"/>

            <DisplayConditions 
                autopilotCheck={props.autopilotCheck}
            />
            <div className="space-10"/>

            <div className="space-4"></div>
            <LegacyStack distribution="center">
                <Button onClick={props.handleTabChange}>Continue to Appearance</Button>
            </LegacyStack>
            <div className="space-10"></div>
        </div>
    );
}