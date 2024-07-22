import { Link } from "react-router-dom";
import quizlogo from "../assets/quiz.png";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import CTAButton from "./CTAButton";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative w-full flex p-5 shadow-md z-5 justify-between items-center">
      <Link to="/" className="flex gap-x-3 items-center">
        <img
          src={quizlogo}
          alt="FlashCardQuiz"
          className="h-10 pointer-events-none"
        />
        <p className="font-medium bg-gradient-to-t text-transparent bg-clip-text from-cta to-hovercta text-lg">
          Quizzer - FlashCard Quiz
        </p>
      </Link>
      <div className="hidden pr-10 md:flex items-center gap-x-10 font-medium">
        <Link
          to="/flashcard"
          className="flex gap-x-3 items-center hover:text-cta transition-all"
        >
          FlashCards
        </Link>
        <Link
          to="/mcq"
          className="flex gap-x-3 items-center hover:text-cta transition-all"
        >
          MCQs
        </Link>
      </div>
      <RxHamburgerMenu
        onClick={() => setOpen(true)}
        className="md:hidden text-xl cursor-pointer text-cta transition-all"
      />

      {/* Pop out div - displayed when hamburger is clicked  */}
      <div
        className={`bg-home h-screen w-full text-xl md:text-lg fixed top-0 right-0 z-10 bg-white pb-6 text-center shadow-md ${
          open ? "translate-x-0" : "translate-x-[100%]"
        } transition-all duration-500`}
      >
        <div className="flex justify-between items-center pt-5 px-5 lg:px-10 mb-14">
          {/* Title */}
          <div className="flex items-center gap-x-2">
            <img src={quizlogo} className="h-10 pointer-events-none" />
            <p className="text-lg text-white font-semibold italic pr-2">
              Quizzer - FlashCard Quiz
            </p>
          </div>
          {/* Close drawer */}
          <RxCross2
            onClick={() => setOpen(false)}
            className="cursor-pointer text-2xl text-white"
          />
        </div>
        <div className="px-8 mt-14 text-2xl flex flex-col items-center gap-y-5">
          <img src={quizlogo} className="w-40 pointer-events-none" />
          <p className="font-medium text-white w-[70%]">
            Hey! The Quizzer is ready to quiz you!
          </p>
          <div className="mt-5 flex flex-col items-center gap-y-8">
            <CTAButton
              text={"FlashCards"}
              onClick={() => navigate("/flashcard")}
              className="text-lg w-52 bg-hovercta"
            >
              FlashCards
            </CTAButton>
            <CTAButton
              text={"Multiple Choice"}
              onClick={() => navigate("/mcq")}
              className="text-lg w-52 bg-hovercta"
            >
              MCQs
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
