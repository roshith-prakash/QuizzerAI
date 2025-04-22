import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../components";
import { ContextValue, useDarkMode } from "../context/DarkModeContext";

const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode() as ContextValue;

  return (
    <div
      className={`${
        isDarkMode ? "bg-animatedWaveDark" : "bg-animatedWave"
      }  font-poppins  bg-cover bg-no-repeat py-20 px-5`}
    >
      {/* Owl */}
      <div className="flex justify-center">
        <img
          src={
            "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427090/quiz_imfkoz.png"
          }
          alt="Quiz Owl"
          className="w-48 pointer-events-none"
        />
      </div>
      {/* Title */}
      <p className=" drop-shadow-lg  font-bold text-2xl text-center mt-10">
        Hey! Meet Quizzer - your friendly neighbourhood AI QuizMaster Owl.
      </p>
      {/* Subtitle */}
      <p className=" drop-shadow-lg font-medium text-lg text-center mt-8">
        Want a challenge? Give him a topic and he&apos;ll quiz you as best as he
        can!
      </p>

      {/* Choose either FlashCards or MCQs  */}
      <p className=" drop-shadow-2xl mt-10 text-xl font-semibold text-center">
        Challenge Modes:
      </p>

      {/* Button Links */}
      <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
        {/* FlashCard Button */}
        <PrimaryButton
          text={"FlashCards"}
          className="w-52 border-2 border-darkmodetext hover:scale-105 hover:bg-cta hover:border-cta"
          onClick={() => {
            navigate("/flashcard");
          }}
        />

        {/* MCQ Button */}
        <PrimaryButton
          text={"Multiple Choice"}
          className="w-52 border-2 border-darkmodetext hover:scale-105 hover:bg-cta hover:border-cta"
          onClick={() => {
            navigate("/mcq");
          }}
        />

        {/* Fact or not Button */}
        <PrimaryButton
          text={"Fact OR Not"}
          className="w-52 border-2 border-darkmodetext hover:scale-105 hover:bg-cta hover:border-cta"
          onClick={() => {
            navigate("/fact-or-not");
          }}
        />

        {/* Multiplayer Button */}
        <PrimaryButton
          text={"MultiPlayer"}
          className="w-52 border-2 border-darkmodetext hover:scale-105 hover:bg-cta hover:border-cta"
          onClick={() => {
            navigate("/multiplayer");
          }}
        />
      </div>
    </div>
  );
};

export default Home;
