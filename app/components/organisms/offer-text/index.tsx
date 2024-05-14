import {
    Card,
    TextField,
    Select,
    RangeSlider,
    Grid,
    Text,
} from "@shopify/polaris";
import { useCallback, useContext } from "react";
import React from "react";
import { OfferBorderOptions, OfferFontOptions } from "~/shared/constants/EditOfferOptions";
import {OfferContent, OfferContext} from "~/contexts/OfferContext";

const OfferText = () => {
    const {offer, updateNestedAttributeOfOffer} = useContext(OfferContext) as OfferContent;

    //Font options
    // const [fontSelect, setFontSelect] = useState("Dummy font 1");
    const handleFontSelect = useCallback((value: string) => updateNestedAttributeOfOffer(value, "css_options", "text", "fontFamily"), []);

    //Font sizes
    const handleFontSize = useCallback((newValue: string) => updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "text", "fontSize"), []);


    //Button options
    const handleBtnSelect = useCallback((value: string) => updateNestedAttributeOfOffer(value, "css_options", "button", "fontFamily"), []);

    //Button size
    const handleBtnSize = useCallback((newValue: string) => updateNestedAttributeOfOffer(`${newValue}px`, "css_options", "button", "fontSize"), []);

    // Btn radius
    const handleRangeSliderChange = useCallback((newValue: string) => updateNestedAttributeOfOffer(parseInt(newValue), "css_options", "button", "borderRadius"), []);

    const handleBtnBorderWidth =useCallback((newValue: string) => {
        const numericValue = parseInt(newValue);
        if (isNaN(numericValue) || numericValue >= 0 && numericValue <= 5) {
            updateNestedAttributeOfOffer(
                parseInt(newValue),
                "css_options",
                "button",
                "borderWidth"
            );
        }
    }, []);

    //Button Border style drop-down menu
    const handleBtnBorderStyle = useCallback((newValue: string) => {
        updateNestedAttributeOfOffer(newValue, "css_options", "button", "borderStyle");
    }, []);

    return (
        <Card title="Offer text" sectioned>

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                        label="Font"
                        options={OfferFontOptions}
                        onChange={handleFontSelect}
                        value={offer.css_options?.text?.fontFamily}
                    />
                </Grid.Cell>

                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                        label="Size"
                        type="number"
                        suffix="px"
                        autoComplete="off"
                        onChange={handleFontSize}
                        value={parseInt(offer.css_options?.text?.fontSize)}
                    />
                </Grid.Cell>
            </Grid>
            <hr className="legacy-card-hr" />
            <div style={{paddingBottom: '20px'}}>
                <Text variant="headingMd" as="h2">Button text</Text>
            </div>
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                        label="Font"
                        options={OfferFontOptions}
                        onChange={handleBtnSelect}
                        value={offer.css_options?.button?.fontFamily}
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                        label="Size"
                        type="number"
                        suffix="px"
                        autoComplete="off"
                        onChange={handleBtnSize}
                        value={parseInt(offer.css_options?.button?.fontSize)}
                    />
                </Grid.Cell>
            </Grid>
            <br />
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    {/*TODO: double check slider*/}
                    <RangeSlider
                        label="Border Radius"
                        value={parseInt(offer.css_options?.button?.borderRadius || "0")}
                        min={0}
                        max={16}
                        onChange={(sliderVal) => handleRangeSliderChange(sliderVal.toString())}
                        output
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                        label="Border Width"
                        type="number"
                        suffix="px"
                        autoComplete="off"
                        onChange={handleBtnBorderWidth}
                        value={offer.css_options?.button?.borderWidth}
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <Select label="Border style"
                            options={OfferBorderOptions}
                            onChange={handleBtnBorderStyle}
                            value={offer?.css_options?.button?.borderStyle}
                    />
                </Grid.Cell>
            </Grid>
        </Card>
    );
}

export default OfferText;
