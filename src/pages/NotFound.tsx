import { SecondaryButton } from "@/components";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen font-poppins flex flex-col justify-center items-center gap-8">
      <img
        src={
          "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736427708/notfound_daswnw.svg"
        }
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
