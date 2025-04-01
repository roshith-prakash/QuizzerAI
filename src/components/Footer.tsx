import { ContextValue, useDarkMode } from "@/context/DarkModeContext";

const Footer = () => {
  const { isDarkMode } = useDarkMode() as ContextValue;

  return (
    <footer
      className={`${
        isDarkMode ? "bg-secondarydarkbg  border-t-2" : "bg-hovercta"
      } border-t-8 border-darkbg dark:border-darkmodetext font-inter min-h-50vh px-10 relative mt-20 pt-36 pb-20 text-white`}
    >
      {/* Floating Div */}
      <div className="dark:border-darkmodetext absolute -top-16 left-1/2 flex h-32 w-[90vw] -translate-x-1/2 items-center justify-around rounded-lg bg-[#1f1e1e] text-white lg:w-[80vw] dark:border-4">
        <p className="text-xl px-5 text-center font-medium">
          Meet Quizzer - your friendly neighbourhood AI QuizMaster Owl!
        </p>
      </div>

      {/* Main Footer section */}
      <div className="flex flex-wrap-reverse gap-y-8 pt-3 lg:flex-row">
        <div className="flex w-full md:flex-1 flex-col items-center justify-center">
          <p className="text-5xl font-bold">Quizzer AI</p>
          <p className="text-xl font-medium text-center pt-5 px-6">
            Want a challenge? Give him a topic and he'll quiz you as best as he
            can!
          </p>
        </div>

        <div className="w-full md:flex-1 items-center justify-center lg:flex">
          <img
            src={
              "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427090/quiz_imfkoz.png"
            }
            alt="Quizzer AI"
            className="pointer-events-none h-32 md:h-60 mx-auto"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
