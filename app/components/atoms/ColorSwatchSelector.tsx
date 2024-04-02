import React from "react";
import "../components/stylesheets/colorSwatchStyle.css";

interface IColorSwatchSelectorProps {
  backgroundColor: string;
  ariaExpanded: boolean;
  ariaControls: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ColorSwatchSelector = ({ onClick, backgroundColor, ariaExpanded, ariaControls }: IColorSwatchSelectorProps) => {
  return (
    <button
      className='custom-button-style'
      style={{ backgroundColor }}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    />
  );
};

export default ColorSwatchSelector;
