import { FlashCard, MCQ } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDBUser } from "@/context/UserContext";
import { axiosInstance } from "@/utils/axios";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const Quiz = () => {
  const [correctCount, setCorrectCount] = useState(0);
  const { dbUser } = useDBUser();
  const { quizId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz", dbUser?.id],
    queryFn: () => {
      return axiosInstance.post("/user-quiz/get-quiz-by-id", {
        userId: dbUser?.id,
        quizId,
      });
    },
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data?.data?.quiz?.questions) {
      setCorrectCount(0);
    }
  }, [data?.data]);

  console.log(data?.data, isLoading, error);

  return (
    <div>
      {data?.data && (
        <div className="max-w-[95%] mx-auto flex flex-col">
          {/* Title */}
          <div className="relative w-full mb-10 md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm">
            <p className="text-3xl pr-12 font-semibold">
              {data?.data?.quiz?.name}
            </p>
            {/* Delete + Privacy Popover */}
            <div className="absolute top-5 right-5">
              <Popover>
                <PopoverTrigger className="flex items-center cursor-pointer">
                  <BsThreeDotsVertical className="text-2xl" />
                </PopoverTrigger>

                <PopoverContent className="dark:bg-darkgrey dark:border-2 w-auto mt-2 mr-4 py-0 px-1">
                  <div className="py-1 min-w-32 flex flex-col gap-y-1">
                    <PopoverClose>
                      <button
                        // onClick={() => setIsDeleteModalOpen(true)}
                        className="cursor-pointer w-full flex items-center gap-x-3 justify-center hover:text-red-500 dark:hover:text-red-400 hover:bg-grey/50 dark:hover:bg-grey/5 py-1.5 transition-all"
                      >
                        <FaTrash />
                        <span className="-translate-x-1">Delete</span>
                      </button>
                    </PopoverClose>
                    <PopoverClose>
                      <button
                        // onClick={() => setIsRenameModalOpen(true)}
                        className="cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA w-full flex items-center gap-x-2 justify-center hover:bg-grey/50 dark:hover:bg-grey/5 py-1.5 transition-all"
                      >
                        <FaEye />
                        Rename
                      </button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 justify-center py-10">
            {/* If quiz is of MCQ type */}
            {data?.data?.quiz?.questions?.length > 0 &&
              data?.data?.quiz?.quizType == "MCQ" &&
              data?.data?.quiz?.questions?.map(
                (item: {
                  question: string;
                  answer: string;
                  options: string[];
                  reason: string;
                }) => {
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
                }
              )}

            {/* If quiz is of flashcard type */}
            {data?.data?.quiz?.questions?.length > 0 &&
              data?.data?.quiz?.quizType == "Flashcard" &&
              data?.data?.quiz?.questions?.map(
                (item: { question: string; answer: string }) => {
                  return (
                    <FlashCard
                      key={item?.question}
                      question={item?.question}
                      answer={item?.answer}
                    />
                  );
                }
              )}
          </div>

          {/* Show Score */}
          {data?.data?.quiz?.questions?.length > 0 &&
            data?.data?.quiz?.quizType == "MCQ" && (
              <div className="flex justify-center">
                <p className="font-medium bg-white dark:bg-darkbg dark:border-2 dark:border-white w-[95%] rounded-xl text-center border-2 p-5 text-lg md:text-2xl flex justify-center items-center gap-x-5">
                  {correctCount == data?.data?.quiz?.questions?.length && (
                    <img
                      src={
                        "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427375/confetti_fmluma.gif"
                      }
                      className="w-10  [transform:rotateY(180deg)]"
                    />
                  )}
                  Your Score : <span>{correctCount}</span> /{" "}
                  {data?.data?.quiz?.questions?.length}
                  {correctCount == data?.data?.quiz?.questions?.length && (
                    <img
                      src={
                        "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427375/confetti_fmluma.gif"
                      }
                      className="w-10"
                    />
                  )}
                  {/* */}
                </p>
              </div>
            )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        // Loading indicator for questions
        <div className="mt-12 flex justify-center items-center">
          <SyncLoader
            color={"#9b0ced"}
            loading={isLoading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {/* Error statement */}
      {error && (
        <p className="text-center mt-14 font-medium text-xl px-5 drop-shadow-lg">
          Could not fetch quiz details. Please try again later.
        </p>
      )}
    </div>
  );
};

export default Quiz;
