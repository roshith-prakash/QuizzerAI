import { useNavigate } from "react-router-dom";
import { SecondaryButton } from "../components";
import { useDarkMode } from "../context/DarkModeContext";

const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
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
      <p className="text-white drop-shadow-lg  font-bold text-2xl text-center mt-10">
        Hey! Meet Quizzer - your friendly neighbourhood AI QuizMaster Owl.
      </p>
      {/* Subtitle */}
      <p className="text-white drop-shadow-lg font-medium text-lg text-center mt-8">
        Want a challenge? Give him a topic and he&apos;ll quiz you as best as he
        can!
      </p>

      {/* Choose either FlashCards or MCQs  */}
      <p className="text-white drop-shadow-2xl mt-10 text-xl font-semibold text-center">
        Challenge Modes:
      </p>

      {/* Button Links */}
      <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
        {/* FlashCard Button */}
        <SecondaryButton
          text={"FlashCards"}
          className="w-52 border-2 border-darkbg hover:scale-105"
          onClick={() => {
            navigate("/flashcard");
          }}
        />

        {/* MCQ Button */}
        <SecondaryButton
          text={"Multiple Choice"}
          className="w-52 border-2 border-darkbg hover:scale-105"
          onClick={() => {
            navigate("/mcq");
          }}
        />

        {/* Fact or not Button */}
        <SecondaryButton
          text={"Fact OR Not"}
          className="w-52 border-2 border-darkbg hover:scale-105"
          onClick={() => {
            navigate("/fact-or-not");
          }}
        />

        {/* Multiplayer Button */}
        <SecondaryButton
          text={"MultiPlayer"}
          className="w-52 border-2 border-darkbg hover:scale-105"
          onClick={() => {
            navigate("/multiplayer");
          }}
        />
      </div>
    </div>
  );
};

export default Home;
