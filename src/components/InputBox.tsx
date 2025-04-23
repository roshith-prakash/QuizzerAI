import { ErrorStatement, PrimaryButton } from "@/components";

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
}: {
  buttonText?: string;
  searchTerm?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  handleClick: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  inputError?: number;
  questions?: { question: string }[]; // Replace `any` with a specific type if you know the question shape
  text?: string;
}) => {
  return (
    <div className="py-10 flex justify-center ">
      <div className="flex max-w-[95%] w-full sm:max-w-lg py-10 px-10 flex-col items-center bg-white dark:bg-white/5 rounded-xl shadow-xl">
        {/* Page Title */}
        <div className="flex items-center gap-x-2">
          <p className="text-cta font-title  dark:text-darkmodeCTA text-4xl tracking-wider font-semibold">
            {title}
          </p>
        </div>

        {/* Topic input text */}
        <p className="text-center py-8 font-medium text-xl">
          Enter your topic :
        </p>

        {/* Input box for topic */}
        <input
          disabled={isLoading || isFetching}
          type="text"
          value={searchTerm}
          placeholder="Enter the topic for the questions!"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-b-2 dark:border-darkmodetext p-1 text-center bg-transparent outline-none"
        />

        <ErrorStatement
          text="Please enter a topic."
          isOpen={inputError == 1}
        ></ErrorStatement>

        <ErrorStatement
          text="Topic must not exceed 50 characters."
          isOpen={inputError == 2}
        ></ErrorStatement>

        {/* Difficulty text */}
        <p className="text-center py-8 text-xl font-medium">
          Choose Difficulty :
        </p>

        {/* Radio Button Group for difficulty */}
        <div className="flex justify-evenly text-lg gap-x-10">
          {/* Radio Button for difficulty : EASY */}
          <div className="flex gap-x-2 justify-center">
            <input
              disabled={isLoading || isFetching}
              type="radio"
              className="accent-cta w-5 cursor-pointer"
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
              className="accent-cta bg-transparent w-5 cursor-pointer"
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
              className="accent-cta w-5 cursor-pointer"
              name="difficulty"
              value={"hard"}
              checked={difficulty == "hard"}
              onChange={(e) => setDifficulty(e.target.value)}
            />{" "}
            Hard
          </div>
        </div>

        {/* Button to fetch flashcards */}
        <div className="mt-10 flex justify-center">
          <PrimaryButton
            // className="shadow p-2 w-fit bg-white rounded px-5 hover:shadow-md transition-all"
            onClick={handleClick}
            disabled={searchTerm?.length == 0 || isLoading || isFetching}
            text={buttonText}
          ></PrimaryButton>
        </div>

        {/* Fetching */}
        {questions && questions?.length > 0 && !isLoading && (
          <p className="text-cta dark:text-darkmodetext font-medium animate-bounce mt-5 flex gap-x-2 items-center">
            {!isFetching ? text : "Fetching new questions..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default InputBox;
