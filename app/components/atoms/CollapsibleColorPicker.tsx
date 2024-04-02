import React from "react";
import { ColorPicker, Collapsible, ColorPickerProps, HSBAColor } from '@shopify/polaris';

interface ICollapsibleColorPickerProps {
  open: boolean;
  id: string;
  color: ColorPickerProps["color"];
  onChange: (color: HSBAColor) => void;
};

const CollapsibleColorPicker = ({ open, id, color, onChange }: ICollapsibleColorPickerProps) => {
  return (
    <Collapsible
      open={open}
      id={id}
    >
      <br />
      <ColorPicker onChange={onChange} color={color} allowAlpha />
    </Collapsible>
  );
};

export default CollapsibleColorPicker;
