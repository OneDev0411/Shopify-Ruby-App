import {LegacyStack, ButtonGroup, Button, BlockStack} from "@shopify/polaris";
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
            <BlockStack gap={"500"}>
                <OfferBox autopilotCheck={props.autopilotCheck} />
                <AppearanceColor />
                <OfferText />

                {(offer?.advanced_placement_setting?.advanced_placement_setting_enabled) ? (
                    <>
                        <BlockStack>
                            <div className="align-center">
                                <span className="padding-fit"><Button onClick={props.handleTabChange}>Continue To Advanced</Button></span>
                            </div>
                        </BlockStack>
                    </>) : (
                    <BlockStack>
                        <div className="align-center">
                            <span className="padding-fit">
                                <ButtonGroup>
                                    <Button onClick={() => props.saveDraft()}>Save Draft</Button>
                                    <Button variant="primary" disabled={props.enablePublish} onClick={() => props.publishOffer()}>Publish</Button>
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
