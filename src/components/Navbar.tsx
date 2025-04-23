import { Link } from "react-router-dom";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { PrimaryButton } from "@/components";
import { useNavigate } from "react-router-dom";
import { ContextValue, useDarkMode } from "../context/DarkModeContext";
import { IoMoon, IoSunnySharp } from "react-icons/io5";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode() as ContextValue;

  return (
    <div className="font-title border-darkbg dark:border-darkmodetext/75 dark:bg-darkbg relative w-full flex p-5 z-5 justify-between items-center">
      <Link to="/" className="md:ml-5 flex gap-x-3 items-center">
        <img
          src={
            "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427090/quiz_imfkoz.png"
          }
          alt="Quizzer AI"
          className="h-10 pointer-events-none"
        />
        <p className=" font-black dark:text-darkmodetext  bg-gradient-to-t text-transparent tracking-wider bg-clip-text from-cta to-hovercta text-4xl">
          Quizzer AI
        </p>
      </Link>
      {/* LG screen links */}
      <div className="hidden text-3xl font-semibold tracking-wide pr-5 lg:flex items-center gap-x-10">
        <Link
          to="/flashcard"
          className="flex gap-x-3 items-center hover:text-cta dark:hover:text-darkmodeCTA transition-all"
        >
          FlashCards
        </Link>
        <Link
          to="/mcq"
          className="flex gap-x-3 items-center hover:text-cta dark:hover:text-darkmodeCTA transition-all"
        >
          MCQs
        </Link>
        <Link
          to="/fact-or-not"
          className="flex gap-x-3 items-center hover:text-cta dark:hover:text-darkmodeCTA transition-all"
        >
          Fact OR Not
        </Link>

        <Link
          to="/multiplayer"
          className="flex gap-x-3 items-center hover:text-cta dark:hover:text-darkmodeCTA transition-all"
        >
          MultiPlayer
        </Link>

        <Link
          to="/faq"
          className="flex gap-x-3 items-center hover:text-cta dark:hover:text-darkmodeCTA transition-all"
        >
          FAQ
        </Link>

        <button
          onClick={toggleDarkMode}
          className="hidden md:block cursor-pointer outline-none "
        >
          {isDarkMode ? (
            <IoSunnySharp className="text-2xl hover:text-cta dark:hover:text-darkmodeCTA transition-all" />
          ) : (
            <IoMoon className="text-2xl hover:text-cta dark:hover:text-darkmodeCTA transition-all" />
          )}
        </button>
      </div>

      {/* Open Drawer button */}
      <div className="lg:hidden flex gap-x-5 items-center">
        <button
          onClick={toggleDarkMode}
          className="outline-none cursor-pointer"
        >
          {isDarkMode ? (
            <IoSunnySharp className="text-2xl hover:text-cta dark:hover:text-darkmodeCTA transition-all" />
          ) : (
            <IoMoon className="text-2xl hover:text-cta dark:hover:text-darkmodeCTA transition-all" />
          )}
        </button>

        <RxHamburgerMenu
          onClick={() => setOpen(true)}
          className="lg:hidden text-xl cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA transition-all"
        />
      </div>

      {/* Pop out drawer - displayed when hamburger is clicked  */}
      <div
        className={`h-screen w-full text-xl md:text-lg overflow-y-scroll scroller fixed top-0 right-0 z-50 bg-whitebg dark:bg-darkbg pb-6 text-center shadow-md ${
          open ? "translate-x-0" : "translate-x-[100%]"
        } transition-all duration-500`}
      >
        <div className="flex justify-between items-center pt-5 px-5 lg:px-10 mb-14">
          {/* Title */}
          <div
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
            className="flex items-center gap-x-2 cursor-pointer"
          >
            <img
              src={
                "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427090/quiz_imfkoz.png"
              }
              alt="Quizzer AI"
              className="h-10 pointer-events-none"
            />
            <p className=" font-black dark:text-darkmodetext  bg-gradient-to-t text-transparent tracking-wider bg-clip-text from-cta to-hovercta text-4xl">
              Quizzer AI
            </p>
          </div>
          {/* Close drawer */}
          <RxCross2
            onClick={() => setOpen(false)}
            className="cursor-pointer text-2xl hover:text-cta dark:hover:text-darkmodeCTA transition-all"
          />
        </div>
        <div className="px-8 mt-14 text-2xl flex flex-col items-center gap-y-5">
          <img
            src={
              "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427090/quiz_imfkoz.png"
            }
            alt="Quizzer AI"
            className="w-40 pointer-events-none"
          />
          <p className="font-semibold tracking-wide text-3xl w-[70%]">
            Hey! Quizzer is ready to quiz you!
          </p>

          {/* Buttons */}
          <div className="mt-5 flex flex-col items-center gap-y-8">
            <PrimaryButton
              text={"FlashCards"}
              onClick={() => {
                navigate("/flashcard");
                setOpen(false);
              }}
              className="text-2xl font-bold tracking-wider  w-52 "
            />
            <PrimaryButton
              text={"Multiple Choice"}
              onClick={() => {
                navigate("/mcq");
                setOpen(false);
              }}
              className="text-2xl font-bold tracking-wider  w-52 "
            />

            <PrimaryButton
              text={"Fact OR Not"}
              onClick={() => {
                navigate("/fact-or-not");
                setOpen(false);
              }}
              className="text-2xl font-bold tracking-wider  w-52 "
            />

            <PrimaryButton
              text={"MultiPlayer"}
              onClick={() => {
                navigate("/multiplayer");
                setOpen(false);
              }}
              className="text-2xl font-bold tracking-wider  w-52 "
            />

            <PrimaryButton
              text={"FAQ"}
              onClick={() => {
                navigate("/faq");
                setOpen(false);
              }}
              className="text-2xl font-bold tracking-wider  w-52 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
