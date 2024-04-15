import {
    LegacyCard,
    Button,
    Collapsible,
    Grid,
    LegacyStack,
} from "@shopify/polaris";
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import tinycolor from "tinycolor2";
import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import { ColorPicker } from "../../molecules";

type ColorSettings = {
    hue: number,
    saturation: number,
    brightness: number,
    alpha: number,
}

const AppearanceColor = () => {
    const {offer, updateNestedAttributeOfOffer} = useContext(OfferContext) as OfferContent;

    const [openEditMenu, setOpenEditMenu] = useState<boolean>(false)
    const handleMenuToggle = useCallback(() => {
        setOpenEditMenu((openEditMenu) => !openEditMenu)
        setOpen({
            cardColorPicker: false,
            borderColorPicker: false,
            buttonColorPicker: false,
            textColorPicker: false,
            btnTextColorPicker: false,
            btnBorderColorPicker: false,
        });
    }, [])

    // Toggle for color pickers
    const [open, setOpen] = useState({
        cardColorPicker: false,
        borderColorPicker: false,
        buttonColorPicker: false,
        textColorPicker: false,
        btnTextColorPicker: false,
        btnBorderColorPicker: false,
    });

    const handleToggle = useCallback(
        (colorPickerName: string) => {
            setOpen((prevState) => ({
                ...prevState,
                [colorPickerName]: !prevState[colorPickerName],
            }));
        },
        [open]
    );

    const colorPickerRefs = {
        cardColorPicker: useRef<HTMLInputElement>(null),
        borderColorPicker: useRef<HTMLInputElement>(null),
        buttonColorPicker: useRef<HTMLInputElement>(null),
        textColorPicker: useRef<HTMLInputElement>(null),
        btnTextColorPicker: useRef<HTMLInputElement>(null),
        btnBorderColorPicker: useRef<HTMLInputElement>(null),
    };

    const handleOutsideClick = (event: MouseEvent) => {
        for (const [colorPickerName, ref] of Object.entries(colorPickerRefs)) {
            // TODO: Check
            if (ref.current && !ref.current.contains(event.currentTarget as Node)) {
                setOpen((prevState) => ({ ...prevState, [colorPickerName]: false }));
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    //Sketch picker
    const handleColorChanges = useCallback((colorSettings: ColorSettings, comp: string, property: string) => {
        const rgbColor = tinycolor({ h: colorSettings.hue, s: colorSettings.saturation, v: colorSettings.brightness, a: colorSettings.alpha }).toRgb();
        const hexColor = tinycolor(rgbColor).toHex();
        updateNestedAttributeOfOffer(`#${hexColor}`, "css_options", `${comp}`, `${property}`);
    }, []);

    const handleTextFieldChanges = useCallback((newValue: string, comp: string, property: string) => {
        updateNestedAttributeOfOffer(newValue, "css_options", `${comp}`, `${property}`);
    }, []);

    return (
        <LegacyCard title="Color" sectioned>
            <LegacyStack vertical>
                {/*<Button>Choose Template</Button>*/}
                <Button
                    onClick={handleMenuToggle}
                    ariaExpanded={openEditMenu}
                    ariaControls="basic-menu-collapsible"
                >Manually Edit Colors</Button>
                <Collapsible
                    open={openEditMenu}
                    id="basic-menu-collapsible"
                    transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                    expandOnPrint
                >
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Card"
                                onChangeTextFiled={(newValue: string) => handleTextFieldChanges(newValue, "main", "backgroundColor")}
                                color={offer.css_options?.main?.backgroundColor}
                                onClickColorSwatchSelector={() => handleToggle("cardColorPicker")}
                                expanded={open.cardColorPicker}
                                id="basic-card-collapsible"
                                colorPickerRef={colorPickerRefs.cardColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "main", "backgroundColor")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Border"
                                onChangeTextFiled={(newValue: string) => handleTextFieldChanges(newValue, "main", "borderColor")}
                                color={offer.css_options?.main?.borderColor}
                                onClickColorSwatchSelector={() => handleToggle("borderColorPicker")}
                                expanded={open.borderColorPicker}
                                id="basic-border-collapsible"
                                colorPickerRef={colorPickerRefs.borderColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "main", "borderColor")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Button"
                                onChangeTextFiled={(newValue: string) => handleTextFieldChanges(newValue, "button", "backgroundColor")}
                                color={offer.css_options?.button?.backgroundColor}
                                onClickColorSwatchSelector={() => handleToggle("buttonColorPicker")}
                                expanded={open.buttonColorPicker}
                                id="basic-button-collapsible"
                                colorPickerRef={colorPickerRefs.buttonColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "button", "backgroundColor")}
                            />
                        </Grid.Cell>
                    </Grid>
                    <div style={{marginBottom: '20px'}} />
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Offer text"
                                onChangeTextFiled={(newValue: string) => handleTextFieldChanges(newValue, "text", "color")}
                                color={offer.css_options?.text?.color}
                                onClickColorSwatchSelector={() => handleToggle("textColorPicker")}
                                expanded={open.textColorPicker}
                                id="basic-offer-collapsible"
                                colorPickerRef={colorPickerRefs.textColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "text", "color")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Button text"
                                onChangeTextFiled={(newValue: string) => handleTextFieldChanges(newValue, "button", "color")}
                                color={offer.css_options?.button?.color}
                                onClickColorSwatchSelector={() => handleToggle("btnTextColorPicker")}
                                expanded={open.btnTextColorPicker}
                                id="basic-button-text-collapsible"
                                colorPickerRef={colorPickerRefs.btnTextColorPicker}
                                onChangeColorPicker={(newValue) => handleColorChanges(newValue, "button", "color")}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
                            <ColorPicker
                                label="Button border"
                                onChangeTextFiled={(newValue: string) => handleTextFieldChanges(newValue, "button", "borderColor")}
                                color={offer.css_options?.button?.borderColor}
                                onClickColorSwatchSelector={() => handleToggle("btnBorderColorPicker")}
                                expanded={open.btnBorderColorPicker}
                                id="basic-button-border-collapsible"
                                colorPickerRef={colorPickerRefs.btnBorderColorPicker}
                                onChangeColorPicker={(newValue: any) => handleColorChanges(newValue, "button", "borderColor")}
                            />
                        </Grid.Cell>
                    </Grid>
                </Collapsible>
            </LegacyStack>
        </LegacyCard>
    );
}

export default AppearanceColor;
