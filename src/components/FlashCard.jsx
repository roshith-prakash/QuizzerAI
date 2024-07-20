import { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";

const FlashCard = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="relative h-80 w-80">
      <FaArrowsRotate className="absolute top-5 right-5" />
      <div
        onClick={() => setFlipped((prev) => !prev)}
        className={`relative h-80 w-80 shadow-lg rounded-xl cursor-pointer transition-all duration-300 [transform-style:preserve-3d] ${
          flipped && "[transform:rotateY(180deg)]"
        } `}
      >
        <div className="absolute top-0 h-full w-full p-5 text-center flex justify-center items-center">
          {!flipped && <p>{question}</p>}
        </div>
        <div className="absolute top-0 h-full w-full flex justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {flipped && <p className="font-medium">{answer}</p>}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
