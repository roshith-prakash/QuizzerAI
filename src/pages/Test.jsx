import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import { FlashCard, CTAButton } from "@/components";
import { SyncLoader } from "react-spinners";

const Test = () => {
  // The topic for which flashcards need to be created
  const [searchTerm, setSearchTerm] = useState("");

  // The difficulty for the questions
  const [difficulty, setDifficulty] = useState("easy");

  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);

  // Fetch Questions from the API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getQuestions", searchTerm, difficulty],
    queryFn: () => {
      return axiosInstance.post("/getQuestions", {
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
    console.log(searchTerm, difficulty);
    refetch();
  };

  return (
    <div className="bg-[#fcfafa] min-h-screen">
      {/* Input for parameters */}
      <div className="border-b-2 pb-20 flex flex-col items-center py-5 gap-y-8">
        <input
          type="text"
          value={searchTerm}
          placeholder="Enter your topic"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96 border-b-2 p-1 text-center bg-transparent outline-none"
        />
        <p className="text-center font-medium">Choose Difficulty :</p>
        <div className="flex justify-evenly gap-x-10">
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
        <div className="flex justify-center">
          <CTAButton
            // className="shadow p-2 w-fit bg-white rounded px-5 hover:shadow-md transition-all"
            onClick={handleClick}
            disabled={searchTerm?.length == 0 || isLoading}
            text="Create FlashCards"
          ></CTAButton>
        </div>
      </div>

      {/* Mapping flashcards */}
      {!isLoading && questions?.length > 0 && (
        <>
          <p className="text-center mt-14">
            Note : Questions & answers may be wrong.
          </p>
          <div className="flex flex-wrap justify-evenly gap-6 py-10 px-5">
            {questions?.length > 0 &&
              questions?.map((item, index) => {
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

      {isLoading && (
        <div className="mt-32 flex justify-center items-center">
          <SyncLoader
            color={"#9b0ced"}
            loading={isLoading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default Test;
