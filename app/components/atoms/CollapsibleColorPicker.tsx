import React from "react";
import { ColorPicker, Collapsible, ColorPickerProps, HSBAColor } from '@shopify/polaris';

type Props = {
  open: boolean;
  id: string;
  color: ColorPickerProps["color"];
  onChange: (color: HSBAColor) => void;
};

const CollapsibleColorPicker: React.FC<Props> = ({ open, id, color, onChange }) => {
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
