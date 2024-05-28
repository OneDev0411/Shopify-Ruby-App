import {LegacyStack, ButtonGroup, Button, BlockStack} from "@shopify/polaris";
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
            <BlockStack gap={"500"}>
                <OfferBox  />
                <AppearanceColor />
                <OfferText />

                {(offer?.advanced_placement_setting?.advanced_placement_setting_enabled) ? (
                    <>
                        <BlockStack>
                            <div className="align-center">
                                <span className="padding-fit"><Button onClick={handleTabChange}>Continue To Advanced</Button></span>
                            </div>
                        </BlockStack>
                    </>) : (
                    <BlockStack>
                        <div className="align-center">
                            <span className="padding-fit">
                                <ButtonGroup>
                                    <Button onClick={() => saveDraft()}>Save Draft</Button>
                                    <Button variant="primary" disabled={enablePublish} onClick={() => publishOffer()}>Publish</Button>
                                </ButtonGroup>
                            </span>
                        </div>
                    </BlockStack>
                )}
                <div className="space-10"></div>
            </BlockStack>
        </div>
    );
}
