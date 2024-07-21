import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { CTAButton, MCQ } from "@/components";
import { mcqData } from "../data/MCQ";
import { SyncLoader } from "react-spinners";
import { FaArrowDown } from "react-icons/fa6";

const MCQQuiz = () => {
  // The topic for which flashcards need to be created
  const [searchTerm, setSearchTerm] = useState("");

  // The difficulty for the questions
  const [difficulty, setDifficulty] = useState("easy");

  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);

  // State to maintain how many questions were "correct"
  // const [correctCount, setCorrectCount] = useState(0);

  // Fetch Questions from the API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getMCQQuestions", searchTerm, difficulty],
    queryFn: () => {
      return axiosInstance.post("/getMCQs", {
        topic: searchTerm,
        difficulty: difficulty,
      });
    },
    staleTime: 60 * 1000 * 10,
    enabled: false,
  });

  // Set questions only if new ones are fetched - stops blank screen when parameters are changed
  useEffect(() => {
    if (data?.data?.questions?.length > 0) {
      setQuestions(data?.data?.questions);
    }
  }, [data?.data]);

  // Fetch data on click of the button
  const handleClick = () => {
    refetch();
  };

  console.log(questions);

  return (
    <div className="bg-wave bg-no-repeat bg-cover min-h-screen">
      {/* Input for parameters */}
      <div className="py-10 flex justify-center">
        <div className="flex w-[95%] md:w-fit py-10 px-10 flex-col items-center gap-y-8 bg-white rounded-xl shadow-xl">
          {/* Page Title */}
          <div className="flex items-center gap-x-2">
            <p className="bg-gradient-to-br from-cta to-hovercta bg-clip-text text-transparent text-2xl font-semibold">
              MCQ Quiz
            </p>
            <span className="text-xl">✅❌</span>
          </div>

          {/* Topic input text */}
          <p className="text-center font-medium">Enter your topic :</p>

          {/* Input box for topic */}
          <input
            type="text"
            value={searchTerm}
            placeholder="Enter the topic for the MCQ quiz!"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-96 border-b-2 p-1 text-center bg-transparent outline-none"
          />

          {/* Difficulty text */}
          <p className="text-center font-medium">Choose Difficulty :</p>

          {/* Radio Button Group for difficulty */}
          <div className="flex justify-evenly gap-x-10">
            {/* Radio Button for difficulty : EASY */}
            <div className="flex gap-x-2 justify-center">
              <input
                type="radio"
                className="accent-cta"
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
                type="radio"
                className="accent-cta"
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
                type="radio"
                className="accent-cta"
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
              disabled={searchTerm?.length == 0 || isLoading}
              text="Get Questions"
            ></CTAButton>
          </div>

          {/* Note for informing that MCQs are ready */}
          {questions?.length > 0 && !isLoading && (
            <p className="text-cta font-medium flex gap-x-2 items-center">
              Your MCQs are ready! <FaArrowDown />
            </p>
          )}
        </div>
      </div>

      {/* Div for MCQs */}
      {!isLoading && questions?.length > 0 && (
        <>
          <p className="text-center mt-14">
            Note : Questions & answers are created using AI and may be
            incorrect.
          </p>

          <div className="flex flex-wrap gap-5 justify-center py-10">
            {questions?.map((item) => {
              return (
                <MCQ
                  key={item?.question}
                  question={item?.question}
                  answer={item?.answer}
                  options={item?.options}
                  // setCount={setCorrectCount}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        // Loading indicator for questions
        <div className="mt-16 lg:mt-20 flex justify-center items-center">
          <SyncLoader
            color={"#ffffff"}
            loading={isLoading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {/* <p className="text-center">{correctCount}</p> */}

      {/* Button to go back to top */}
      {!isLoading && questions?.length > 0 && (
        // Button to go back to the input Div
        <div className="pt-8 pb-12 flex justify-center">
          <button
            className="bg-white p-2 px-4 rounded-lg transition-all text-cta hover:text-hovercta hover:scale-105"
            onClick={() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            Go Back Up?
          </button>
        </div>
      )}
    </div>
  );
};

export default MCQQuiz;
