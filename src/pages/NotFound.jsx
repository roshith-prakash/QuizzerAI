import notfound from "../assets/notfound.svg";
import CTAButton from "../components/CTAButton";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen font-poppins flex flex-col justify-center items-center gap-8">
      <img src={notfound} className="-mt-14 w-72 md:w-80" alt="Not Found" />
      <p className="text-xl">Uh oh! We are lost. Lets go back?</p>
      <CTAButton
        text={"Home"}
        onClick={() => {
          navigate("/");
        }}
      />
    </div>
  );
};

export default NotFound;
