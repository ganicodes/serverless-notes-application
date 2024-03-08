import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModeToggle } from "./components/mode-toggle";
import Signin from "./pages/Signin";
import { Signup } from "./pages/Signup";

function App() {
  useEffect(() => {
    sessionStorage.setItem("token", "abcdefgh");
    const token = sessionStorage.getItem("token");
    console.log("token: ", token);

    // return sessionStorage.clear();
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="container">
          <ModeToggle />
        </div>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
