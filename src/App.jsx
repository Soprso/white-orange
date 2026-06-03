import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <SmoothScroll />

      {isLoading && (
        <Loader onComplete={() => setIsLoading(false)} />
      )}

      {!isLoading && (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      )}
    </>
  );
}

export default App;