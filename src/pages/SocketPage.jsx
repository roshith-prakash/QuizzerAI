/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { CTAButton, MCQ, Timer } from "../components";
import { SyncLoader } from "react-spinners";
import { MdOutlineContentCopy } from "react-icons/md";

const socket = io("https://flashcardquiz-backend.onrender.com");
// const socket = io("http://localhost:4000");

const SocketPage = () => {
  // Room input state
  const [roomId, setRoomId] = useState("");
  // To enter topic
  const [topic, setTopic] = useState("");
  // To enter difficulty
  const [difficulty, setDifficulty] = useState("easy");
  // To enter topic
  const [username, setUsername] = useState("");
  // To disable room input
  const [disabled, setDisabled] = useState(false);
  // To disable other inputs
  const [disableInputs, setDisableInputs] = useState(false);
  // The questions array that is mapped for the flashcards
  const [questions, setQuestions] = useState([]);
  // State to maintain how many questions were "correct"
  const [correctCount, setCorrectCount] = useState(0);
  // State to check if submitted
  const [submitted, setSubmitted] = useState(false);
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  // Stage to be displayed
  const [stage, setStage] = useState(1);
  // Errors
  const [error, setError] = useState({
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4: 0,
  });
  // To check if questions are being fetched
  const [loading, setLoading] = useState(false);
  // Players in Room
  const [players, setPlayers] = useState([]);

  // Socket listeners
  useEffect(() => {
    // Establish a socket connection
    if (!socket.connected) {
      socket.connect();
    }

    // When room has been created
    socket.on("sendRoomId", ({ roomId, room }) => {
      setRoomId(roomId);
      setPlayers(room?.playerAlias);
      setStage(3);
      toast.success("Room Created Successfully!");
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
      setDisableInputs(true);
      setLeaderboard([]);
      setLoading(false);
      setQuestions(questions);

      if (stage == 4) {
        toast("Quiz has started!");
      }
    });

    // When the score has been submitted
    socket.on("submitted", () => {
      setSubmitted(true);
      toast.success("Submitted");
    });

    // Listener to submit score (signalled from server)
    socket.on("submit", () => {
      socket.emit("submitScore", {
        name: username,
        score: correctCount,
        roomId,
      });
      toast("Time Over!");
    });

    // Listener to submit score (signalled from server)
    socket.on("err", () => {
      toast.error("Something went wrong!");
      setDisableInputs(false);
      setLoading(false);
    });

    // Room does note exist in DB
    socket.on("roomDoesNotExist", () => {
      toast.error("Room Does Not Exist!");
    });

    // Room has been locked
    socket.on("roomLocked", () => {
      toast.error("Quiz has already been started!");
    });

    // Leaderboard
    socket.on("leaderboard", ({ scoreTable }) => {
      setLeaderboard(scoreTable);
      setDisableInputs(false);
      setTopic("");
      setDifficulty("easy");
      setQuestions([]);
      setSubmitted(false);
      setCorrectCount(0);
    });

    // To promote user to Host
    socket.on("promoteToHost", () => {
      toast("You have been promoted to Host!");
      setStage(3);
    });

    // To promote user to Host
    socket.on("roomMembers", ({ room }) => {
      setPlayers(room?.playerAlias);
    });

    // Disconnect socket when user leaves this page.
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset when stage changes
  useEffect(() => {
    if (stage == 2) {
      setRoomId();
      setLoading(false);
      setQuestions([]);
      setLeaderboard([]);
      setTopic("");
      setDisableInputs(false);
      setCorrectCount(0);
      setDisabled(false);
    }
  }, [stage]);

  // Create a new Room
  const createRoom = () => {
    socket.emit("createRoom", { name: username });
  };

  // Join an existing room
  const joinRoom = () => {
    socket.emit("joinRoom", { roomId, name: username });
  };

  // To leave a room
  const leaveRoom = () => {
    if (disabled && roomId) {
      socket.emit("leaveRoom", { roomId });
    }
  };

  // Send topic and difficulty to get questions
  const getQuestions = () => {
    setError((prev) => ({ ...prev, stage3: 0 }));

    if (!topic || topic?.length == 0) {
      setError((prev) => ({ ...prev, stage3: 1 }));
      return;
    }

    setLoading(true);
    setDisableInputs(true);

    socket.emit("getQuestions", { roomId, topic, difficulty });
  };

  // Submit Score
  const submitScore = () => {
    socket.emit("submitScore", { name: username, score: correctCount, roomId });
  };

  console.log(disabled, roomId);

  return (
    <main className="bg-animatedWave bg-no-repeat flex flex-col pb-20 bg-cover font-poppins min-h-screen">
      {/* Title */}
      <h1 className="text-white text-center py-10 text-3xl md:text-4xl font-medium">
        Quizzer AI <span className="text-nowrap">Multi-Player</span>
      </h1>

      {/* Subtitle */}
      {(stage == 1 || stage == 2) && (
        <div className="flex justify-center pb-10">
          <h2 className="text-white text-center md:text-xl lg:max-w-[70%] px-2">
            Challenge your friends and level up the fun with{" "}
            <b className="text-nowrap">Quizzer AI's Multiplayer Mode!</b> <br />
            Compete in real-time and prove who's the ultimate quiz master. Are
            you ready to take the crown?
          </h2>
        </div>
      )}

      {/* Enter your username */}
      {stage == 1 && (
        <div className="flex flex-col flex-1 gap-y-10 items-center">
          <div className="bg-white flex flex-col gap-y-6 w-full md:w-fit px-10 shadow-xl rounded-xl hover:scale-105 transition-all py-10 max-w-[90%]">
            {/* Username */}
            <label htmlFor="username" className="text-xl font-medium">
              Enter your username{" "}
            </label>
            <span>
              <input
                type="text"
                disabled={disabled}
                id="username"
                className="border-2 rounded px-2 py-1.5 md:min-w-80 w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </span>

            {error.stage1 == 1 && (
              <p className="text-red-500">Please enter your username.</p>
            )}

            <CTAButton
              onClick={() => {
                if (username?.length == 0 || !username) {
                  setError((prev) => ({ ...prev, stage1: 1 }));
                  return;
                } else {
                  setError((prev) => ({ ...prev, stage1: 0 }));
                  setStage(2);
                }
              }}
              text={"Next"}
            ></CTAButton>
          </div>
        </div>
      )}

      {/* Choose to join a room or create a new one */}
      {stage == 2 && (
        <div className="flex flex-col flex-1 gap-y-10 items-center">
          <div className="bg-white flex flex-col gap-y-6 w-fit shadow-xl px-5 lg:px-10 rounded-xl py-10 max-w-[90%] hover:scale-105 transition-all">
            <label className="text-lg text-center font-medium">
              Join an existing room{" "}
              <span className="text-nowrap">or create a new one!</span>
            </label>
            <CTAButton
              className="min-w-80 py-2"
              onClick={createRoom}
              text="Create New Room"
            ></CTAButton>
            <CTAButton
              className="min-w-80 py-2"
              onClick={() => {
                setStage(4);
              }}
              text="Join Existing Room"
            ></CTAButton>
            <button
              onClick={() => {
                setStage(1);
              }}
              className="shadow-lg hover:bg-gray-100 transition-all py-2 border-2 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Creator */}
      {stage == 3 && (
        <>
          {/* Inputs */}
          <div className="flex justify-center">
            <div className="flex max-w-[90%] rounded-lg p-10 bg-white flex-col gap-y-4 my-5 hover:scale-105 transition-all">
              {/* Room ID */}
              <span className="flex justify-center gap-x-2 items-center text-lg font-medium">
                <label htmlFor="room">Room ID : </label>
                <p>{roomId}</p>
                <button
                  onClick={() => {
                    navigator?.clipboard?.writeText(roomId);
                    toast.success("Copied Room ID!");
                  }}
                  className="hover:text-cta transition-all"
                >
                  <MdOutlineContentCopy />
                </button>
              </span>

              {/* Topic */}
              <label htmlFor="topic" className="text-center font-medium mt-5">
                Enter your Topic :{" "}
              </label>
              <input
                type="text"
                id="topic"
                disabled={disableInputs}
                className="border-b-2 text-center outline-none rounded px-2 py-1 w-full md:flex-1"
                placeholder="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              {/* Radio Button Group for difficulty */}
              <label className="pt-5 text-center font-medium">
                Choose Difficulty :{" "}
              </label>
              <div className="flex justify-between pt-3">
                {/* Radio Button for difficulty : EASY */}
                <div className="flex gap-x-2 justify-center">
                  <input
                    type="radio"
                    disabled={disableInputs}
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
                    disabled={disableInputs}
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
                    disabled={disableInputs}
                    className="accent-cta w-4 cursor-pointer"
                    name="difficulty"
                    value={"hard"}
                    checked={difficulty == "hard"}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />{" "}
                  Hard
                </div>
              </div>

              {/* Error */}
              {error?.stage3 == 1 && (
                <p className="text-red-500">
                  Please enter the topic for the quiz.
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-x-8 py-5">
                <button
                  className="shadow-lg hover:bg-gray-100 px-10 transition-all py-2 border-2 rounded-lg"
                  onClick={() => {
                    leaveRoom();
                    setStage(2);
                  }}
                >
                  Leave Room
                </button>
                <button
                  disabled={disableInputs || loading}
                  className="shadow-lg hover:bg-gray-100 px-10 transition-all py-2 border-2 disabled:border-gray-300 rounded-lg disabled:bg-gray-300"
                  onClick={getQuestions}
                >
                  Get Questions
                </button>
              </div>
            </div>
          </div>

          {loading && (
            // Loading indicator for questions
            <div className="mt-12 flex justify-center items-center">
              <SyncLoader
                color={"#9b0ced"}
                loading={loading}
                size={60}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
        </>
      )}

      {/* Non Creator */}
      {stage == 4 && (
        <>
          {/* Inputs */}
          <div className="flex justify-center">
            <div className="flex max-w-[90%] rounded-lg p-10 bg-white flex-col gap-y-4 my-5 hover:scale-105 transition-all">
              {/* Topic */}
              <label htmlFor="roomId" className="text-center font-medium">
                Enter Room ID :{" "}
              </label>
              <input
                type="text"
                id="roomId"
                disabled={disabled}
                className="border-b-2 text-center outline-none rounded px-2 py-1 w-full md:flex-1"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
              />

              {disabled && (
                <>
                  {/* Topic */}
                  <label
                    htmlFor="topic"
                    className="text-center font-medium mt-5"
                  >
                    Topic :{" "}
                  </label>

                  <input
                    type="text"
                    id="topic"
                    disabled
                    className="border-b-2 text-center outline-none rounded px-2 py-1 w-full md:flex-1"
                    placeholder="Topic"
                    value={topic}
                  />

                  {/* Radio Button Group for difficulty */}
                  <label className="pt-5 text-center font-medium">
                    Difficulty :{" "}
                  </label>
                  <div className="flex justify-between pt-3">
                    {/* Radio Button for difficulty : EASY */}
                    <div className="flex gap-x-2 justify-center">
                      <input
                        type="radio"
                        disabled
                        className="accent-cta w-4 cursor-pointer"
                        name="difficulty"
                        value={"easy"}
                        checked={difficulty == "easy"}
                      />{" "}
                      Easy
                    </div>
                    {/* Radio Button for difficulty : MEDIUM */}
                    <div className="flex gap-x-2 justify-center">
                      <input
                        type="radio"
                        disabled
                        className="accent-cta w-4 cursor-pointer"
                        name="difficulty"
                        value={"medium"}
                        checked={difficulty == "medium"}
                      />{" "}
                      Medium
                    </div>
                    {/* Radio Button for difficulty : HARD */}
                    <div className="flex gap-x-2 justify-center">
                      <input
                        type="radio"
                        disabled
                        className="accent-cta w-4 cursor-pointer"
                        name="difficulty"
                        value={"hard"}
                        checked={difficulty == "hard"}
                      />{" "}
                      Hard
                    </div>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-x-8 py-5">
                <button
                  className="shadow-lg hover:bg-gray-100 px-10 transition-all py-2 border-2 rounded-lg"
                  onClick={() => {
                    leaveRoom();
                    setStage(2);
                  }}
                >
                  Leave Room
                </button>
                <button
                  disabled={disableInputs || loading}
                  className="shadow-lg hover:bg-gray-100 px-10 transition-all py-2 border-2 disabled:border-gray-300 rounded-lg disabled:bg-gray-300"
                  onClick={joinRoom}
                >
                  Join Room
                </button>
              </div>

              {disabled && (
                <p>Topic and Difficulty will be chosen by Room Host!</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Everything else */}
      {(stage == 3 || stage == 4) && (
        <>
          {!submitted &&
            questions?.length == 0 &&
            leaderboard?.length == 0 &&
            !loading &&
            players.length > 0 && (
              <section className="flex flex-col items-center gap-y-10 mt-10">
                <p className="text-3xl font-medium text-hovercta bg-clip-text">
                  Players
                </p>
                <table className="overflow-hidden max-w-[90%] w-full bg-white rounded-lg">
                  <tr className="border-b-2 text-center">
                    <th>Sr No.</th>
                    <th className="p-2">Name</th>
                  </tr>
                  {players.map((row, i) => {
                    return (
                      <tr className="border-b-2 text-center" key={row?.id}>
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{row?.name}</td>
                      </tr>
                    );
                  })}
                </table>
              </section>
            )}
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
                Your Score :{" "}
                <span className="text-hovercta">{correctCount}</span> /{" "}
                {questions?.length}
              </p>
            </div>
          )}

          {/* Submit Button */}
          {!submitted && questions && questions?.length > 0 && (
            <div className="flex py-10 justify-center">
              <button
                onClick={submitScore}
                className="shadow-xl text-xl border-2 bg-white text-hovercta font-medium px-10 py-2 rounded-lg hover:scale-110 transition-all"
              >
                Submit
              </button>
            </div>
          )}

          {/* Submitted text */}
          {submitted && leaderboard.length == 0 && (
            <p className="text-white py-10 text-center">Submitted</p>
          )}

          {/* Leaderboard table */}
          {!loading && leaderboard.length > 0 && (
            <section className="px-5">
              <h2 className="text-center drop-shadow-lg text-hovercta text-4xl font-medium py-5">
                LeaderBoard
              </h2>
              <table className="overflow-hidden w-full bg-white rounded-lg">
                <tr className="border-b-2 text-center">
                  <th className="p-2">Name</th>
                  <th className="p-2">Score</th>
                </tr>
                {leaderboard.map((row) => {
                  return (
                    <tr className="border-b-2 text-center" key={row?.id}>
                      <td className="p-2">{row?.name}</td>
                      <td className="p-2">{row?.score}</td>
                    </tr>
                  );
                })}
              </table>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default SocketPage;
