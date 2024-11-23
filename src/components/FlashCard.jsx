import { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import PropTypes from "prop-types";

const FlashCard = ({ question, answer }) => {
  // State to check whether the card was flipped to view the answer.
  const [flipped, setFlipped] = useState(false);

  return (
    // Main container
    <div className="relative font-poppins h-80 w-80 rounded-xl">
      {/* The rotate icon on the top right of the card. */}
      <FaArrowsRotate className="absolute z-10 top-5 right-5" />

      {/* The Flip Card which can be rotated. */}
      <div
        onClick={() => setFlipped((prev) => !prev)}
        className={`relative z-1 bg-white h-80 w-80 shadow-lg rounded-xl cursor-pointer transition-all duration-300 [transform-style:preserve-3d] ${
          flipped && "[transform:rotateY(180deg)]"
        } `}
      >
        {/* The Front face of the card - displays the question. */}
        <div className="absolute top-0 h-full w-full p-5 text-center flex justify-center items-center">
          {!flipped && <p>{question}</p>}
        </div>

        {/* The Back face of the card - displays the answer. */}
        <div className="absolute top-0 h-full w-full p-5 text-center flex justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {flipped && (
            <p className="font-medium text-hovercta text-lg">{answer}</p>
          )}
        </div>
      </div>
    </div>
  );
};

FlashCard.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.string,
};

export default FlashCard;
