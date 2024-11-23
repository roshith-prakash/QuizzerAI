import PropTypes from "prop-types";

const CTAButton = ({ text, onClick, disabled, className }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`font-poppins text-white py-1.5 px-5 rounded-lg bg-cta font-medium disabled:bg-cta/45 hover:bg-hovercta transition-all ${className}`}
    >
      {text}
    </button>
  );
};

CTAButton.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CTAButton;
