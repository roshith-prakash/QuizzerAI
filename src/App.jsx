import { Home, NotFound, Test } from "./pages";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { axiosInstance } from "./utils/axios";
import { SyncLoader } from "react-spinners";
import Navbar from "./components/Navbar";

function App() {
  // Check if server is active
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["check"],
    queryFn: () => {
      return axiosInstance.get("/");
    },
    refetchInterval: 10000,
    retry: 10,
  });

  return (
    <>
      {/* If server isn't ready for use, show a loading indicator */}
      {isLoading && (
        <div className="h-screen w-full flex justify-center items-center">
          <SyncLoader
            color={"#9b0ced"}
            loading={isLoading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {/* When server responds, allow the user to use the app */}
      {data?.data && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Test />} />

            {/* Test Page */}
            {/* <Route path="/test" element={<Test />} /> */}

            {/* 404 error page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
