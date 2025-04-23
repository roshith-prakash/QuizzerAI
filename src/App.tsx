import {
  Home,
  NotFound,
  FlashCardQuiz,
  MCQQuiz,
  FactOrNot,
  SocketPage,

  // V2 Routes
  Signup,
  Login,
  Onboarding,
  Signout,
  User,
  Profile,
  EditProfile,
  FAQ,
} from "./pages";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { axiosInstance } from "./utils/axios";
import { SyncLoader } from "react-spinners";
import { Navbar, Footer } from "./components";
import { Toaster } from "react-hot-toast";
import { ContextValue, useDarkMode } from "./context/DarkModeContext";
import Protector from "./components/Protector";
import NoteEditor from "./pages/NoteEditor";

function App() {
  // Check if server is active
  const { data, isLoading } = useQuery({
    queryKey: ["check"],
    queryFn: () => {
      return axiosInstance.get("/");
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
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
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
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

                {/* V2 Routes */}

                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/signout" element={<Signout />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Protected routes - Logged In User required. */}

                <Route
                  path="/edit-profile"
                  element={
                    <Protector>
                      <EditProfile />
                    </Protector>
                  }
                />

                {/* View your profile */}
                <Route
                  path="/profile"
                  element={
                    <Protector>
                      <Profile />
                    </Protector>
                  }
                />

                {/* View a User's Profile (Non Current user) */}
                <Route
                  path="/user/:username"
                  element={
                    <Protector>
                      <User />
                    </Protector>
                  }
                />

                <Route path="/test" element={<NoteEditor />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
