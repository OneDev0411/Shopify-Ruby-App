import { LegacyStack, ButtonGroup, Button } from "@shopify/polaris";
import { useContext } from "react";
import {OfferContent, OfferContext} from "../../../contexts/OfferContext";
import { AppearanceColor, OfferBox, OfferText } from "../../organisms/index";
import { AutopilotCheck } from "~/types/types";

interface IThirdTabProps {
    saveDraft: () => void,
    publishOffer: () => void,
    autopilotCheck: AutopilotCheck,
    enablePublish: boolean
    handleTabChange: () => void
}

export function ThirdTab(props: IThirdTabProps) {
    const {offer} = useContext(OfferContext) as OfferContent;

    return (
        <div id="appearance-offers">
            <OfferBox autopilotCheck={props.autopilotCheck} />
            <div className="space-10" />

            <AppearanceColor />
            <div className="space-10" />

            <OfferText />
            <div className="space-10"></div>
            {(offer?.advanced_placement_setting?.advanced_placement_setting_enabled) ? (
                <>
                    <LegacyStack distribution="center">
                        <Button onClick={props.handleTabChange}>Continue to Advanced</Button>
                    </LegacyStack>
                </>) : (
                <LegacyStack distribution="center">
                    <ButtonGroup>
                        <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                        <Button primary disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
                    </ButtonGroup>
                </LegacyStack>
                )}
            <div className="space-10"></div>
        </div>
    );
}