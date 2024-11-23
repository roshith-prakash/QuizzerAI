import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // Call the function when the timer reaches zero
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Cleanup the interval on component unmount or if timeLeft changes
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="sticky w-fit top-10 lg:top-5 py-3 px-5 rounded-xl shadow-lg left-5 bg-hovercta text-white font-semibold hover:scale-110 transition-all">
      <h1>Time Left: {formatTime(timeLeft)}</h1>
    </div>
  );
};

Timer.propTypes = {
  duration: PropTypes.number,
  onTimeUp: PropTypes.func,
};

export default Timer;
