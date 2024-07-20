import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import { FlashCard } from "@/components";

const Test = () => {
  // The topic for which flashcards need to be created
  const [searchTerm, setSearchTerm] = useState("");

  // The difficulty for the questions
  const [difficulty, setDifficulty] = useState("easy");

  const [questions, setQuestions] = useState([]);

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

  useEffect(() => {
    if (data?.data?.questions?.length > 0) {
      setQuestions(data?.data?.questions);
    }
  }, [data?.data]);

  const handleClick = () => {
    console.log(searchTerm, difficulty);
    refetch();
  };

  console.log(isLoading);

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2"
        />
        <br />
        <br />
        <input
          type="radio"
          name="difficulty"
          value={"easy"}
          checked={difficulty == "easy"}
          onChange={(e) => setDifficulty(e.target.value)}
        />{" "}
        Easy
        <br />
        <input
          type="radio"
          name="difficulty"
          value={"medium"}
          checked={difficulty == "medium"}
          onChange={(e) => setDifficulty(e.target.value)}
        />{" "}
        Medium
        <br />
        <input
          type="radio"
          name="difficulty"
          value={"hard"}
          checked={difficulty == "hard"}
          onChange={(e) => setDifficulty(e.target.value)}
        />{" "}
        Hard
        <br />
        <br />
        <br />
        <button
          className="border-2 p-2"
          onClick={handleClick}
          disabled={searchTerm?.length == 0}
        >
          Get Questions
        </button>
      </div>

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
    </div>
  );
};

export default Test;
