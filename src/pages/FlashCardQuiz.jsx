import { FlashCard } from "@/components";
import { demonSlayer, harryPotter } from "@/data/testData";

const FlashCardQuiz = () => {
  return (
    <div className="bg-[#fcfafa] flex flex-wrap justify-evenly p-5 gap-x-5 gap-y-10">
      {harryPotter?.map((item, index) => {
        return (
          <FlashCard
            key={index}
            question={item?.question}
            answer={item?.answer}
          />
        );
      })}
    </div>
  );
};

export default FlashCardQuiz;
