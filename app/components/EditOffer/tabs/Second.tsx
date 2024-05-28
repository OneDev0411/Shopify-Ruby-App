import { useState, useCallback } from 'react';
import {BlockStack, Button, LegacyStack} from "@shopify/polaris";
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
            <BlockStack gap={"500"}>
                <BlockStack gap={"500"}>
                    <ChoosePlacement
                        autopilotCheck={props.autopilotCheck}
                        enableOrDisablePublish={props.enableOrDisablePublish}
                    />

                    <DisplayConditions
                        autopilotCheck={props.autopilotCheck}
                    />
                </BlockStack>
                <BlockStack>
                    <div className="align-center">
                        <span className="padding-fit"><Button onClick={props.handleTabChange}>Continue To Appearance</Button></span>
                    </div>
                </BlockStack>
            </BlockStack>
        </div>
    );
}
