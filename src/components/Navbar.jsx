import { Link } from "react-router-dom";
import quizlogo from "../assets/quiz.png";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  return (
    <div className="relative w-full flex p-5 shadow-md z-5 justify-between items-center">
      <Link to="/" className="flex gap-x-3 items-center">
        <img src={quizlogo} alt="FlashCardQuiz" className="h-10" />
        <p className="font-medium bg-gradient-to-t text-transparent bg-clip-text from-cta to-hovercta text-lg">
          FlashCard Quiz
        </p>
      </Link>
      <RxHamburgerMenu className="text-xl cursor-pointer hover:text-cta transition-all" />
    </div>
  );
};

export default Navbar;
