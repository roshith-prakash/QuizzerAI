/* eslint-disable react/prop-types */
import CTAButton from "./CTAButton";

const InputBox = ({
  buttonText,
  searchTerm,
  setSearchTerm,
  difficulty,
  setDifficulty,
  title,
  handleClick,
  isLoading,
  isFetching,
  inputError,
  questions,
  text,
}) => {
  return (
    <div className="py-10 flex justify-center ">
      <div className="flex w-[95%] md:w-fit py-10 px-10 flex-col items-center gap-y-8 bg-white rounded-xl shadow-xl">
        {/* Page Title */}
        <div className="flex items-center gap-x-2">
          <p className="bg-gradient-to-br from-cta to-hovercta bg-clip-text text-transparent text-2xl font-semibold">
            {title}
          </p>
        </div>

        {/* Topic input text */}
        <p className="text-center font-medium">Enter your topic :</p>

        {/* Input box for topic */}
        <input
          disabled={isLoading || isFetching}
          type="text"
          value={searchTerm}
          placeholder="Enter the topic for the questions!"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full lg:w-96 border-b-2 p-1 text-center bg-transparent outline-none"
        />

        {inputError == 1 && (
          <p className="text-center text-red-500">Please enter a topic.</p>
        )}

        {inputError == 2 && (
          <p className="text-center text-red-500">
            Topic must not exceed 50 characters.
          </p>
        )}

        {/* Difficulty text */}
        <p className="text-center font-medium">Choose Difficulty :</p>

        {/* Radio Button Group for difficulty */}
        <div className="flex justify-evenly gap-x-10">
          {/* Radio Button for difficulty : EASY */}
          <div className="flex gap-x-2 justify-center">
            <input
              disabled={isLoading || isFetching}
              type="radio"
              className="accent-cta w-4 cursor-pointer"
              name="difficulty"
              value={"easy"}
              checked={difficulty == "easy"}
              onChange={(e) => setDifficulty(e.target.value)}
            />{" "}
            Easy
          </div>
          {/* Radio Button for difficulty : MEDIUM */}
          <div className="flex gap-x-2 justify-center">
            <input
              disabled={isLoading || isFetching}
              type="radio"
              className="accent-cta w-4 cursor-pointer"
              name="difficulty"
              value={"medium"}
              checked={difficulty == "medium"}
              onChange={(e) => setDifficulty(e.target.value)}
            />{" "}
            Medium
          </div>
          {/* Radio Button for difficulty : HARD */}
          <div className="flex gap-x-2 justify-center">
            <input
              disabled={isLoading || isFetching}
              type="radio"
              className="accent-cta w-4 cursor-pointer"
              name="difficulty"
              value={"hard"}
              checked={difficulty == "hard"}
              onChange={(e) => setDifficulty(e.target.value)}
            />{" "}
            Hard
          </div>
        </div>

        {/* Button to fetch flashcards */}
        <div className="mt-5 flex justify-center">
          <CTAButton
            // className="shadow p-2 w-fit bg-white rounded px-5 hover:shadow-md transition-all"
            onClick={handleClick}
            disabled={searchTerm?.length == 0 || isLoading || isFetching}
            text={buttonText}
          ></CTAButton>
        </div>

        {questions?.length > 0 && !isLoading && (
          <p className="text-cta font-medium animate-bounce mt-5 flex gap-x-2 items-center">
            {!isFetching ? text : "Fetching new questions..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default InputBox;
