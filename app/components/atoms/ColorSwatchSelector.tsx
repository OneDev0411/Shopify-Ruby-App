import React from "react";
import "../components/stylesheets/colorSwatchStyle.css";

type Props = {
  label?: string;
  backgroundColor: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ColorSwatchSelector: React.FC<Props> = ({ label, onClick, backgroundColor, ariaExpanded, ariaControls }) => {
  const buttonStyle = {
    backgroundColor,
  };

  return (
    <button
      className='custom-button-style'
      style={buttonStyle}
      onClick={onClick}
      aria-label={label}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {label}
    </button>
  );
};

export default ColorSwatchSelector;
