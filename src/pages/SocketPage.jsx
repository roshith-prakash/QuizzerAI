import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { MCQ } from "../components";

const socket = io("http://localhost:4000");

const SocketPage = () => {
  const [roomId, setRoomId] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [disabled, setDisabled] = useState(false);

  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);

  // State to maintain how many questions were "correct"
  const [correctCount, setCorrectCount] = useState(0);

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { roomId });
  };

  const getQuestions = () => {
    socket.emit("getQuestions", { roomId, topic, difficulty });
  };

  useEffect(() => {
    // Receive Room Id (after creation)
    socket.on("sendRoomId", ({ roomId }) => {
      setRoomId(roomId);
      setDisabled(true);
    });

    // On successfully joining room
    socket.on("roomJoined", ({ roomId }) => {
      toast.success("Joined Room : ", roomId);
      setRoomId(roomId);
      setDisabled(true);
    });

    // To receive questions
    socket.on("sendQuestions", ({ questions, topic, difficulty }) => {
      console.log(topic, difficulty);
      console.log(questions);
      setQuestions(questions);
    });

    // Cleanup the socket listener on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <>
      <h1>React Socket.IO Chat</h1>

      {/* Inputs */}
      <div className="flex flex-col gap-y-4 my-5">
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

        <span>
          <label htmlFor="difficulty">Difficulty : </label>
          <input
            type="text"
            id="difficulty"
            className="border-2 rounded px-2 py-1"
            placeholder="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          />
        </span>

        <button onClick={createRoom}>Create Room</button>

        <button onClick={joinRoom}>Join Room</button>

        <button onClick={getQuestions}>Get Questions</button>
      </div>

      {/* MCQs */}
      {questions && questions?.length > 0 && (
        <div className="flex flex-wrap gap-5 justify-center py-10">
          {questions?.map((item) => {
            return (
              <MCQ
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
      {questions && questions?.length > 0 && (
        <div className="flex justify-center">
          <p className="font-medium bg-white w-[95%] rounded-xl text-center border-2 p-5 text-lg md:text-2xl flex justify-center items-center gap-x-5">
            Your Score : <span className="text-hovercta">{correctCount}</span> /{" "}
            {questions?.length}
          </p>
        </div>
      )}
    </>
  );
};

export default SocketPage;
