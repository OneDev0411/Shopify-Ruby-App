import React from "react";
import "../stylesheets/colorSwatchStyle.css";

interface IColorSwatchSelectorProps {
  backgroundColor: string;
  ariaExpanded: boolean;
  ariaControls: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ColorSwatchSelector = ({ onClick, backgroundColor, ariaExpanded, ariaControls }: IColorSwatchSelectorProps) => {
  return (
    <button
      className='custom-button-style color-box'
      style={{ backgroundColor }}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    />
  );
};

export default ColorSwatchSelector;
