/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import { FlashCard } from "@/components";
import { SyncLoader } from "react-spinners";
import { InputBox } from "../components";

const FlashCardQuiz = () => {
  // The topic for which flashcards need to be created
  const [searchTerm, setSearchTerm] = useState("");

  // The difficulty for the questions
  const [difficulty, setDifficulty] = useState("easy");

  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);

  const [inputError, setInputError] = useState(0);

  // Fetch Questions from the API
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["getQuestions", searchTerm, difficulty],
    queryFn: () => {
      return axiosInstance.post("/getQuestions", {
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
        buttonText={"Generate FlashCards"}
        difficulty={difficulty}
        handleClick={handleClick}
        inputError={inputError}
        isFetching={isFetching}
        isLoading={isLoading}
        questions={questions}
        searchTerm={searchTerm}
        setDifficulty={setDifficulty}
        setSearchTerm={setSearchTerm}
        title={"FlashCard Quiz"}
        text={"Your Flashcards are ready!"}
      />

      {/* Mapping flashcards */}
      {!isLoading && questions?.length > 0 && (
        <>
          <p className="text-center mt-10 text-white px-2">
            Note : Questions & answers are created using AI and may be
            incorrect.
          </p>
          <div className="flex flex-wrap justify-evenly gap-6 py-10 px-5">
            {questions?.length > 0 &&
              questions?.map((item) => {
                return (
                  <FlashCard
                    key={item?.question}
                    question={item?.question}
                    answer={item?.answer}
                  />
                );
              })}
          </div>
        </>
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

      {/* Error statement */}
      {error && (
        <p className="text-center font-medium text-xl text-white drop-shadow-lg">
          Uh oh! Couldn't create flashcards about "{searchTerm}". Maybe try a
          different topic?
        </p>
      )}

      {/* Button to go back to top */}
      {questions?.length > 0 && !isLoading && (
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

export default FlashCardQuiz;
