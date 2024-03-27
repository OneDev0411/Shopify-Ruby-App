import React from "react";
import { HSBAColor, TextField } from "@shopify/polaris";
import tinycolor from "tinycolor2";
import CollapsibleColorPicker from "../atoms/CollapsibleColorPicker";
import ColorSwatchSelector from "../atoms/ColorSwatchSelector";
import "../../stylesheets/colorPickerStyles.css";

interface Props {
    label: string;
    onChangeTextFiled: (value: string, id: string) => void;
    color: string;
    onClickColorSwatchSelector: React.MouseEventHandler<HTMLButtonElement>;
    expanded: boolean;
    id: string;
    colorPickerRef: React.LegacyRef<HTMLDivElement>;
    onChangeColorPicker: (color: HSBAColor) => void;
};

const hexToHsba = (hexColor: string) => {
    const color = tinycolor(hexColor);
    const hsbColor = color.toHsv();
    const alpha = color.getAlpha();
    return {
        hue: hsbColor.h,
        saturation: hsbColor.s,
        brightness: hsbColor.v,
        alpha: alpha,
    };
};
  
const ColorPicker: React.FC<Props> = ({
    label,
    onChangeTextFiled,
    color,
    onClickColorSwatchSelector,
    expanded,
    id,
    colorPickerRef,
    onChangeColorPicker,
}) => (
    <div className="color-picker-container">
        <TextField
            label={label}
            onChange={onChangeTextFiled}
            value={color}
            autoComplete="off"
            connectedRight={
                <ColorSwatchSelector
                  onClick={onClickColorSwatchSelector}
                  backgroundColor={color}
                  ariaExpanded={expanded}
                  ariaControls={id}
                />
              }
        />
        <div className="color-picker-style" ref={colorPickerRef}>
            <CollapsibleColorPicker
                open={expanded}
                id={id}
                color={hexToHsba(color)}
                onChange={onChangeColorPicker}
            />
        </div>
    </div>
);

export default ColorPicker;
