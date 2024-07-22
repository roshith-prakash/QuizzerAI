import { useNavigate } from "react-router-dom";
import { CTAButton } from "../components";
import quizlogo from "../assets/quiz.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-home font-poppins pb-20 bg-cover bg-no-repeat min-h-screen pt-10 px-5`}
    >
      {/* Owl */}
      <div className="flex justify-center">
        <img
          src={quizlogo}
          alt="Quiz Owl"
          className="w-48 pointer-events-none"
        />
      </div>
      {/* Title */}
      <p className="text-white drop-shadow-lg  font-bold text-2xl text-center mt-10">
        Hey! Meet Quizzer - your friendly neighbourhood AI QuizMaster Owl.
      </p>
      {/* Subtitle */}
      <p className="text-white drop-shadow-lg font-medium text-lg text-center mt-8">
        Want a challenge? Give him a topic and he'll quiz you as best as he can!
      </p>

      {/* Choose either FlashCards or MCQs  */}
      <p className="text-white drop-shadow-lg mt-10 text-xl font-medium text-center underline">
        Challenge Modes:
      </p>

      <div className="flex flex-col items-center gap-8 pt-8">
        {/* FlashCard Button */}
        <CTAButton
          text={"FlashCards"}
          className="w-52 hover:scale-105"
          onClick={() => {
            navigate("/flashcard");
          }}
        />

        {/* MCQ Button */}
        <CTAButton
          text={"Multiple Choice"}
          className="w-52 hover:scale-105"
          onClick={() => {
            navigate("/mcq");
          }}
        />
      </div>
    </div>
  );
};

export default Home;
