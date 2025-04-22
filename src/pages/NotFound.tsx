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
        className="-mt-14 w-72 md:w-80"
        alt="Not Found"
      />
      <p className="text-xl">Uh oh! We are lost. Lets go back?</p>
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
