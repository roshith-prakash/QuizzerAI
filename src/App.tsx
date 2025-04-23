import {
  Home,
  NotFound,
  FlashCardQuiz,
  MCQQuiz,
  FactOrNot,
  SocketPage,
} from "./pages";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { axiosInstance } from "./utils/axios";
import { SyncLoader } from "react-spinners";
import { Navbar, Footer } from "./components";
import { Toaster } from "react-hot-toast";
import { ContextValue, useDarkMode } from "./context/DarkModeContext";

function App() {
  // Check if server is active
  const { data, isLoading } = useQuery({
    queryKey: ["check"],
    queryFn: () => {
      return axiosInstance.get("/");
    },
    refetchInterval: 60000,
    retry: 10,
  });

  const { isDarkMode } = useDarkMode() as ContextValue;

  return (
    <div
      className={`bg-whitebg dark:bg-darkbg font-body dark:text-darkmodetext`}
    >
      <Toaster
        toastOptions={{
          style: {
            background: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          },
        }}
      />

      {/* If server isn't ready for use, show a loading indicator */}
      {isLoading && (
        <div className="min-h-screen w-full flex flex-col gap-y-10 justify-center items-center">
          <img
            src="https://res.cloudinary.com/do8rpl9l4/image/upload/v1724056376/sleep_hyhact.webp"
            className="w-52 pointer-events-none"
          />
          {/* Three dots loading indicator */}
          <SyncLoader
            color={"#9b0ced"}
            loading={isLoading}
            size={65}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          {/* Typewriter effect to show 4 different texts. Gradient text */}
          <p className="text-center px-5 max-w-2xl lml-3 font-medium mb-10 text-xl">
            Quizzer might take a minute or two to load because the server's
            powered by broke dreams. Go grab a snack - you've got more resources
            than this server. We'll be here... eventually.
          </p>
        </div>
      )}

      {/* When server responds, allow the user to use the app */}
      {data?.data && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />

            {/* FlashCard Quiz Page */}
            <Route path="/flashcard" element={<FlashCardQuiz />} />

            {/* MCQ Quiz Page */}
            <Route path="/mcq" element={<MCQQuiz />} />

            {/* Fact or Not Page */}
            <Route path="/fact-or-not" element={<FactOrNot />} />

            {/* Test Page */}
            <Route path="/multiplayer" element={<SocketPage />} />

            {/* 404 error page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
