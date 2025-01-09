import { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import * as PropTypes from "prop-types";

const FlashCard = ({ question, answer }) => {
  // State to check whether the card was flipped to view the answer.
  const [flipped, setFlipped] = useState(false);

  return (
    // Main container
    <div className="relative font-poppins h-80 w-80 rounded-xl">
      {/* The rotate icon on the top right of the card. */}
      <FaArrowsRotate
        onClick={() => setFlipped((prev) => !prev)}
        className="absolute z-10 top-5 right-5 cursor-pointer"
      />

      <div className="absolute z-10 font-medium dark:text-darkmodetext top-3.5 left-5">
        {flipped ? "A." : "Q."}
      </div>

      {/* The Flip Card which can be rotated. */}
      <div
        onClick={() => setFlipped((prev) => !prev)}
        className={`relative z-1 bg-white dark:bg-secondarydarkbg dark:border-2 h-80 w-80 shadow-lg rounded-xl cursor-pointer transition-all duration-300 [transform-style:preserve-3d] ${
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
            <p className="font-medium text-hovercta dark:text-white text-lg">
              {answer}
            </p>
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
