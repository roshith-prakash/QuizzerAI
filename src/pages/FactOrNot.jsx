/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { MCQ } from "@/components";
import { SyncLoader } from "react-spinners";
import { InputBox } from "../components";
import confetti from "../assets/confetti.gif";

const FactOrNot = () => {
  // The topic for which flashcards need to be created
  const [searchTerm, setSearchTerm] = useState("");

  // The difficulty for the questions
  const [difficulty, setDifficulty] = useState("easy");

  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);

  // State to maintain how many questions were "correct"
  const [correctCount, setCorrectCount] = useState(0);

  const [inputError, setInputError] = useState(0);

  // Fetch Questions from the API
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["getFactOrNot", searchTerm, difficulty],
    queryFn: () => {
      return axiosInstance.post("/getFactOrNot", {
        topic: searchTerm,
        difficulty: difficulty,
      });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 60 * 1000 * 10,
    enabled: false,
  });

  // Set questions only if new ones are fetched - stops blank screen when parameters are changed
  useEffect(() => {
    if (data?.data?.questions?.length > 0) {
      setCorrectCount(0);
      setQuestions(data?.data?.questions);
    }
  }, [data?.data]);

  //   Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Fetch data on click of the button
  const handleClick = () => {
    setInputError(0);
    let search = searchTerm?.replaceAll(" ", "");

    if (search?.length == 0) {
      setInputError(1);
      return;
    } else if (searchTerm?.length > 50) {
      setInputError(2);
      return;
    }

    refetch();
  };

  return (
    <div className="bg-animatedWave bg-no-repeat bg-cover font-poppins min-h-screen">
      {/* Input for parameters */}
      <InputBox
        buttonText={"Generate Questions"}
        difficulty={difficulty}
        handleClick={handleClick}
        inputError={inputError}
        isFetching={isFetching}
        isLoading={isLoading}
        questions={questions}
        searchTerm={searchTerm}
        setDifficulty={setDifficulty}
        setSearchTerm={setSearchTerm}
        title={"Fact Or Not"}
        text={"Your questions are ready!"}
      />

      {/* Div for questions */}
      {!isLoading && questions?.length > 0 && (
        <>
          <p className="text-center mt-10 text-white px-2">
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
                  reason={item?.reason}
                  setCount={setCorrectCount}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Error statement */}
      {error && (
        <p className="text-center font-medium text-xl text-white drop-shadow-lg">
          Uh oh! Couldn't create questions about "{searchTerm}". Maybe try a
          different topic?
        </p>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        // Loading indicator for questions
        <div className="mt-12 flex justify-center items-center">
          <SyncLoader
            color={"#ffffff"}
            loading={isLoading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {/* Show Score */}
      {!isLoading && questions?.length > 0 && (
        <div className="flex justify-center ">
          <p className="font-medium bg-white w-[95%] rounded-xl text-center border-2 p-5 text-lg md:text-2xl flex justify-center items-center gap-x-5">
            {correctCount == questions?.length && (
              <img
                src={confetti}
                className="w-10  [transform:rotateY(180deg)]"
              />
            )}
            Your Score : <span className="text-hovercta">{correctCount}</span> /{" "}
            {questions?.length}
            {correctCount == questions?.length && (
              <img src={confetti} className="w-10" />
            )}
            {/* */}
          </p>
        </div>
      )}

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

export default FactOrNot;
