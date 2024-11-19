/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";
import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";

const MCQ = ({
  question,
  answer,
  options,
  setCount,
  reason,
  showAnswer = true,
  allowReSelection = false,
}) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!allowReSelection && selected == String(answer)) {
      setCount((prev) => prev + 1);
    }
  }, [selected, answer, allowReSelection, setCount]);

  return (
    <div className="font-poppins w-full border-2 p-4 max-w-[95%] shadow-xl rounded-lg bg-white">
      {/* Display the question */}
      <span className="font-medium">Q . {question}</span>

      {/* Display the options */}
      <div className="flex flex-col gap-y-3 mt-5">
        {/* Map the options */}
        {options?.map((option, index) => {
          return (
            <button
              key={option}
              disabled={!allowReSelection && selected != null}
              onClick={() => {
                setSelected(String(option));
              }}
              // Highlight the option selected by CTA background
              // Highlight the correct answer by green background
              // Highlight the incorrect answer by red background
              className={`w-full px-4 border-2 p-2 gap-3 flex items-center rounded text-left transition-all
                ${selected == option && "border-cta"} 
                ${
                  showAnswer &&
                  selected &&
                  (answer == option ? "bg-green-100" : "bg-red-100")
                }
                ${
                  showAnswer &&
                  selected &&
                  selected != option &&
                  (answer == option ? "border-green-100" : "border-red-100")
                }`}
            >
              <p>
                {/* When an option isn't selected, display index for options */}
                {/* When option is selected, display tick for correct answer / cross for incorrect answer */}
                {!selected ? (
                  index + 1 + "."
                ) : showAnswer && answer == option ? (
                  <SiTicktick className="text-green-500" />
                ) : (
                  showAnswer && <ImCross className="text-red-500" />
                )}
                {!showAnswer && selected && index + 1 + "."}
              </p>
              {/* Display option text */}
              <p>{String(option)}</p>
            </button>
          );
        })}
      </div>

      {reason && selected && <p className="mt-4 px-1">{reason}</p>}
    </div>
  );
};

MCQ.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.string,
  options: PropTypes.array,
  setCount: PropTypes.func,
  reason: PropTypes.string,
  showAnswer: PropTypes.bool,
  allowReSelection: PropTypes.bool,
};

export default MCQ;
