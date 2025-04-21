import * as PropTypes from "prop-types";

const SecondaryButton = ({ text, onClick, disabled, className }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`font-poppins text-white py-2 px-5 rounded-lg bg-cta dark:bg-cta/85 dark:font-medium font-medium disabled:bg-cta/45 dark:disabled:bg-gray-400/60 hover:bg-hovercta hover:scale-105 transition-all ${className}`}
    >
      {text}
    </button>
  );
};

SecondaryButton.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SecondaryButton;
