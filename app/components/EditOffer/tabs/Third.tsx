import { LegacyStack, ButtonGroup, Button } from "@shopify/polaris";
import { useContext } from "react";
import {OfferContent, OfferContext} from "../../../contexts/OfferContext";
import { AppearanceColor, OfferBox, OfferText } from "../../organisms/index";

interface IThirdTabProps {
    saveDraft: () => void,
    publishOffer: () => void,
    handleTabChange: () => void
}

export function ThirdTab({ saveDraft, publishOffer, handleTabChange } : IThirdTabProps) {
    const { offer, enablePublish } = useContext(OfferContext) as OfferContent;

    return (
        <div id="appearance-offers">
            <OfferBox />
            <div className="space-10" />

            <AppearanceColor />
            <div className="space-10" />

            <OfferText />
            <div className="space-10"></div>
            {(offer?.advanced_placement_setting?.advanced_placement_setting_enabled) ? (
                <>
                    <LegacyStack distribution="center">
                        <Button onClick={handleTabChange}>Continue to Advanced</Button>
                    </LegacyStack>
                </>) : (
                <LegacyStack distribution="center">
                    <ButtonGroup>
                        <Button onClick={() => saveDraft()}>Save Draft</Button>
                        <Button primary disabled={enablePublish} onClick={() => publishOffer()}>Publish</Button>
                    </ButtonGroup>
                </LegacyStack>
                )}
            <div className="space-10"></div>
        </div>
    );
}
