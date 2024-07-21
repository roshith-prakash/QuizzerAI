import { useNavigate } from "react-router-dom";
import { CTAButton } from "../components";
import quizlogo from "../assets/quiz.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-home bg-cover bg-no-repeat min-h-screen pt-10 px-5">
      <div className="flex justify-center">
        <img src={quizlogo} alt="Quiz Owl" className="w-48" />
      </div>
      <p className="text-white font-bold text-2xl text-center mt-10">
        Hey! Meet Quizzer - your friendly neighbourhood QuizMaster Owl.
      </p>
      <p className="text-slate-800 font-medium text-lg text-center mt-8">
        Want a challenge? Give him a topic and he'll quiz you as best as he can!
      </p>

      <p className="text-slate-800 mt-12 text-xl font-medium text-center underline">
        Challenge Modes:
      </p>

      <div className="flex flex-col items-center gap-8 pt-8">
        <CTAButton
          text={"FlashCards"}
          className="w-52 hover:scale-105"
          onClick={() => {
            navigate("/flashcard");
          }}
        />
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
