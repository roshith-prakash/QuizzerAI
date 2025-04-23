import { SecondaryButton } from "@/components";
import { useNavigate } from "react-router-dom";

import doodle from "@/assets/SitReadingDoodle.svg";
import doodleDark from "@/assets/SitReadingDoodleDark.svg";
import { ContextValue, useDarkMode } from "@/context/DarkModeContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode() as ContextValue;
  return (
    <div className="h-screen font-poppins flex flex-col justify-center items-center gap-8">
      <img
        src={isDarkMode ? doodleDark : doodle}
        className="-mt-14 w-80 md:w-96"
        alt="Not Found"
      />
      <p className="text-3xl font-medium text-center px-5">
        Uh oh! We are lost. Lets go back?
      </p>
      <SecondaryButton
        text={"Home"}
        onClick={() => {
          navigate("/");
        }}
      />
    </div>
  );
};

export default NotFound;
