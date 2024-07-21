import { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";
import { ImCross } from "react-icons/im";

const MCQ = ({ question, answer, options }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full border-2 p-4 max-w-[95%] shadow-xl rounded-lg bg-white">
      {/* Display the question */}
      <span className="font-medium">Q . {question}</span>

      {/* Display the options */}
      <div className="flex flex-col gap-y-3 mt-5">
        {/* Map the options */}
        {options?.map((option, index) => {
          return (
            <button
              key={option}
              disabled={selected != null}
              onClick={() => {
                setSelected(option);
              }}
              // Highlight the option selected by CTA background
              // Highlight the correct answer by green background
              // Highlight the incorrect answer by red background
              className={`w-full px-4 border-2 p-2 gap-3 flex items-center rounded text-left transition-all
                ${selected == option && "border-cta"} 
                ${
                  selected && (answer == option ? "bg-green-100" : "bg-red-100")
                }`}
            >
              <p>
                {/* When an option isn't selected, display index for options */}
                {/* When option is selected, display tick for correct answer / cross for incorrect answer */}
                {!selected ? (
                  index + 1 + "."
                ) : answer == option ? (
                  <SiTicktick className="text-green-500" />
                ) : (
                  <ImCross className="text-red-500" />
                )}
              </p>
              {/* Display option text */}
              <p>{option}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQ;