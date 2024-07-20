import { FlashCardQuiz, NotFound, Test } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Creating the Queryclient instance
const client = new QueryClient();

function App() {
  return (
    <>
      {/* The query client provider that provides the client for child components. */}
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<FlashCardQuiz />} />

            {/* Home Page */}
            <Route path="/test" element={<Test />} />

            {/* 404 error page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
