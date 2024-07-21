import React from "react";

const CTAButton = ({ text, onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="text-white py-1.5 px-5 rounded-lg bg-cta font-medium disabled:bg-cta/45 "
    >
      {text}
    </button>
  );
};

export default CTAButton;
