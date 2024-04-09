import {
    LegacyCard,
    TextField,
    Select,
    RangeSlider,
    Grid,
} from "@shopify/polaris";
import { useCallback, useContext } from "react";
import React from "react";
import { OfferStyleOptions, OfferBorderOptions } from "~/shared/constants/EditOfferOptions";
import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import {IAutopilotSettingsProps} from "~/types/global";

interface IOfferBoxProp extends IAutopilotSettingsProps {
}

const OfferBox = ({ autopilotCheck }: IOfferBoxProp) => {
    const {offer, updateOffer, updateNestedAttributeOfOffer} = useContext(OfferContext) as OfferContent;

    const handleLayout = useCallback((value: string) => {
        updateOffer("multi_layout", value);
    }, []);

    // Space above the offer
    const handleAboveSpace = useCallback((newValue: string) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue > 0 && numericValue <= 100) {
            updateNestedAttributeOfOffer(
                `${newValue}px`,
                "css_options",
                "main",
                "marginTop"
            );
        }
    }, []);
    // Space below the offer
    const handleBelowSpace = useCallback((newValue: string) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue > 0 && numericValue <= 100) {
            updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "main", "marginBottom");
        }
    }, []);
    //Border style drop-down menu
    const handleBorderStyle = useCallback((newValue: string) => {
        updateNestedAttributeOfOffer(newValue, "css_options", "main", "borderStyle");
    }, []);

    //Border width
    const handleBorderWidth = useCallback((newValue: string) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue >= 0 && numericValue <= 10) {
            updateNestedAttributeOfOffer(
                parseInt(newValue),
                "css_options",
                "main",
                "borderWidth"
            );
        }
    }, []);

    //Border range slider
    const handlesetBorderRange = useCallback((newValue: string) => updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "main", "borderRadius"), []);

    return (
        <LegacyCard title="Offer box" sectioned>
            {(offer.id != null && autopilotCheck?.autopilot_offer_id == offer.id) ? (
                <>
                </>
            ) : (
                <>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                            <Select
                                label="Layout"
                                options={OfferStyleOptions}
                                onChange={handleLayout}
                                value={offer.multi_layout}
                            />
                        </Grid.Cell>
                    </Grid>
                    <br/>
                </>
            )
            }
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <TextField
                        label="Space above offer"
                        type="number"
                        onChange={handleAboveSpace}
                        value={offer.css_options?.main?.marginTop}
                        suffix="px"
                        placeholder="1-100px"
                        autoComplete="off"
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <TextField
                        label="Space below offer"
                        type="number"
                        onChange={handleBelowSpace}
                        value={offer.css_options?.main?.marginBottom}
                        suffix="px"
                        placeholder="1-100px"
                        autoComplete="off"
                    />
                </Grid.Cell>
            </Grid>
            <br />
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <Select label="Border style"
                            options={OfferBorderOptions}
                            onChange={handleBorderStyle}
                            value={offer?.css_options?.main?.borderStyle}
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <TextField
                        label="Border width"
                        type="number"
                        onChange={handleBorderWidth}
                        value={offer.css_options?.main?.borderWidth}
                        suffix="px"
                        placeholder="0-10px"
                        autoComplete="off"
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <div className="range-slider-container">
                            {/*TODO: Double check range slider*/}
                        <RangeSlider
                            label="Corner Radius"
                            value={parseInt(offer.css_options?.main?.borderRadius as string)}
                            min={0}
                            max={50}
                            onChange={(value, id) => handlesetBorderRange(id)}
                            output
                        />
                    </div>
                </Grid.Cell>
            </Grid>
        </LegacyCard>
    );
}

export default OfferBox;
