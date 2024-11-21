import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { MCQ, Timer } from "../components";

const socket = io("http://localhost:4000");

const SocketPage = () => {
  // Room input state
  const [roomId, setRoomId] = useState("");
  // To enter topic
  const [topic, setTopic] = useState("");
  // To enter difficulty
  const [difficulty, setDifficulty] = useState("");
  // To enter topic
  const [username, setUsername] = useState("");
  // To disable room input
  const [disabled, setDisabled] = useState(false);
  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);
  // State to maintain how many questions were "correct"
  const [correctCount, setCorrectCount] = useState(0);
  // State to check if submitted
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Establish a socket connection
    if (!socket.connected) {
      socket.connect();
    }

    // When room has been created
    socket.on("sendRoomId", ({ roomId }) => {
      setRoomId(roomId);
      setDisabled(true);
    });

    // When room has been joined (non-creator)
    socket.on("roomJoined", ({ roomId }) => {
      toast.success(`Joined Room : ${roomId}`);
      setRoomId(roomId);
      setDisabled(true);
    });

    // Receiving questions
    socket.on("sendQuestions", ({ questions, topic, difficulty }) => {
      setTopic(topic);
      setDifficulty(difficulty);
      setSubmitted(false);
      setCorrectCount(0);
      setQuestions(questions);
    });

    // When the score has been submitted
    socket.on("submitted", () => {
      setSubmitted(true);
      toast.success("Submitted");
    });

    // Listener to submit score (signalled from server)
    socket.on("submit", () => {
      submitScore();
      toast("Time Over!");
    });

    // Listener to submit score (signalled from server)
    socket.on("err", () => {
      toast.error("Something went wrong!");
    });

    // Disconnect socket when user leaves this page.
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  console.log(socket.id);

  // Create a new Room
  const createRoom = () => {
    socket.emit("createRoom");
  };

  // Join an existing room
  const joinRoom = () => {
    socket.emit("joinRoom", { roomId });
  };

  // Send topic and difficulty to get questions
  const getQuestions = () => {
    socket.emit("getQuestions", { roomId, topic, difficulty });
  };

  // Submit Score
  const submitScore = () => {
    socket.emit("sendScore", { correctCount });
  };

  return (
    <main className="bg-fullwave bg-no-repeat pb-20 bg-cover font-poppins min-h-screen">
      <h1 className="text-white text-center py-5 text-2xl font-medium italic">
        Quizzer AI Multi-Player (TEST)
      </h1>

      {/* Inputs */}
      <div className="flex justify-center">
        <div className="flex justify-center  rounded-md items-center p-10 bg-white flex-col gap-y-4 my-5">
          {/* Room ID */}
          <span>
            <label htmlFor="room">Room ID : </label>
            <input
              type="text"
              id="room"
              className="border-2 rounded px-2 py-1"
              disabled={disabled}
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </span>

          {/* Username */}
          <span>
            <label htmlFor="username">Username : </label>
            <input
              type="text"
              id="username"
              className="border-2 rounded px-2 py-1"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </span>

          {/* Topic */}
          <span>
            <label htmlFor="topic">Topic : </label>
            <input
              type="text"
              id="topic"
              className="border-2 rounded px-2 py-1"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </span>

          {/* Radio Button Group for difficulty */}
          <div className="flex justify-evenly pt-5 gap-x-10">
            {/* Radio Button for difficulty : EASY */}
            <div className="flex gap-x-2 justify-center">
              <input
                type="radio"
                className="accent-cta w-4 cursor-pointer"
                name="difficulty"
                value={"easy"}
                checked={difficulty == "easy"}
                onChange={(e) => setDifficulty(e.target.value)}
              />{" "}
              Easy
            </div>
            {/* Radio Button for difficulty : MEDIUM */}
            <div className="flex gap-x-2 justify-center">
              <input
                type="radio"
                className="accent-cta w-4 cursor-pointer"
                name="difficulty"
                value={"medium"}
                checked={difficulty == "medium"}
                onChange={(e) => setDifficulty(e.target.value)}
              />{" "}
              Medium
            </div>
            {/* Radio Button for difficulty : HARD */}
            <div className="flex gap-x-2 justify-center">
              <input
                type="radio"
                className="accent-cta w-4 cursor-pointer"
                name="difficulty"
                value={"hard"}
                checked={difficulty == "hard"}
                onChange={(e) => setDifficulty(e.target.value)}
              />{" "}
              Hard
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-x-8 py-5">
            <button
              className="w-fit px-10 py-2 border-2 rounded"
              onClick={createRoom}
            >
              Create Room
            </button>

            <button
              className="w-fit px-10 py-2 border-2 rounded"
              onClick={joinRoom}
            >
              Join Room
            </button>

            <button
              className="w-fit px-10 py-2 border-2 rounded"
              onClick={getQuestions}
            >
              Get Questions
            </button>
          </div>
        </div>
      </div>

      {/* Timer */}
      {!submitted && questions && questions?.length > 0 && (
        <Timer duration={300} onTimeUp={submitScore} />
      )}

      {/* MCQs */}
      {!submitted && questions && questions?.length > 0 && (
        <div className="flex flex-wrap gap-5 justify-center py-10">
          {questions?.map((item) => {
            return (
              <MCQ
                // showAnswer={false}
                // allowReSelection={true}
                key={item?.question}
                question={item?.question}
                answer={item?.answer}
                options={item?.options}
                setCount={setCorrectCount}
              />
            );
          })}
        </div>
      )}

      {/* Score */}
      {!submitted && questions && questions?.length > 0 && (
        <div className="flex justify-center">
          <p className="font-medium bg-white w-[95%] rounded-xl text-center border-2 p-5 text-lg md:text-2xl flex justify-center items-center gap-x-5">
            Your Score : <span className="text-hovercta">{correctCount}</span> /{" "}
            {questions?.length}
          </p>
        </div>
      )}

      {/* Submit Button */}
      {!submitted && questions && questions?.length > 0 && (
        <div className="flex py-10 justify-center">
          <button
            onClick={submitScore}
            className="shadow-xl bg-white px-10 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      )}

      {/* Submitted text */}
      {submitted && <p className="text-white py-10 text-center">Submitted</p>}
    </main>
  );
};

export default SocketPage;
